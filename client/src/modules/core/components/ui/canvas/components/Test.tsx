import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { TestType } from "@/modules/features/tests/types/TestType";
import {
  T_Test,
  T_Test_Respuesta,
} from "@/modules/features/tests/api/responses";
import { useNavigate } from "@tanstack/react-router";
import { TestForm } from "@/modules/features/tests/api/dtos";
import { isForResolveTest } from "@/modules/features/tests/utils/isForResolve";
import { STORAGE_URL } from "@/modules/core/constants/ENVIRONMENT";
import { useModal } from "../../modal/useModal";
import { cleanOptionTags, getOptionText } from "../utils/dynamicOptions";
import Button from "../../Button";
import Icon from "../../../icons/Icon";
import TestAutofill from "./TestAutofill";
import TestProgress from "./TestProgress";
import TestOutside from "./TestOutside";
import TestPhrase from "./TestPhrase";
import TestRequirements from "./TestRequirements";
import TestCarousel from "./TestCarousel";
import TestFinishPage from "./TestFinishPage";
import { useTestSender } from "../hooks/useTestSender";
import { useTestActual } from "../hooks/useTestActual";

interface Props {
  data: T_Test | T_Test_Respuesta;
  test: TestType;
  idRespuesta?: number;
}

const Test = ({ data, test, idRespuesta }: Props) => {
  const { modal, setOpen } = useModal();
  const navigate = useNavigate();

  const prev = !idRespuesta;

  const resultados: TestForm[] | null = isForResolveTest(data)
    ? JSON.parse(data.resultados)
    : null;

  const [form, setForm] = useState<TestForm[]>(resultados || []);
  const { finished, finishedPage, handleSend, setFinishedPage } = useTestSender(
    idRespuesta,
    resultados
  );

  const [[preguntaIndex, direction], setCurrentPage] = useState([0, 1]);

  const { preguntas, pregunta, opciones, seccion, requirements } =
    useTestActual(test, preguntaIndex);

  const exist = form.find((v) => v.idPregunta === pregunta.id);

  const [finalizedAnimation, setFinalizedAnimation] = useState(!!exist);
  useEffect(() => {
    setFinalizedAnimation(!!exist);
  }, [preguntaIndex]);

  function setPreguntaIndex(newPage: number, newDirection: number) {
    if (!newDirection) newDirection = newPage - preguntaIndex;
    setCurrentPage([newPage, newDirection]);
  }

  const nextCondition = !exist || !finalizedAnimation;
  const inLastPregunta = preguntaIndex === preguntas.length - 1;
  const allPreguntasChecked = form.length === preguntas.length;

  const timerRef = useRef<any>();
  const handleOption = (idOpcion: number) => {
    clearTimeout(timerRef.current);
    if (seccion?.type === "multi") {
      //* SELECCION MULTIPLE
      setForm((prev) => {
        setFinalizedAnimation(true);
        //? PREGUNTA TODAVÍA NO EXISTE EN EL ARRAY DEL FORMULARIO
        const ids = exist?.idOpcion;
        const checkedsAreArray = Array.isArray(ids);
        if (!checkedsAreArray)
          return [
            ...prev,
            {
              idPregunta: pregunta.id,
              idOpcion: [idOpcion],
            },
          ];
        //? ESTA OPCION TODAVÍA NO SE CHECKEO, AÑADIR AL ARRAY
        const alreadyChecked = ids.some((v) => v === idOpcion);
        if (!alreadyChecked)
          return prev.map((p) => {
            if (p.idPregunta === pregunta.id) {
              return {
                ...p,
                idOpcion: [...ids, idOpcion],
              };
            }
            return p;
          });
        //? LA OPCION YA ESTABA CHECKEADA, QUITARLA DEL ARRAY
        const newIds = ids.filter((v) => v !== idOpcion);
        if (newIds.length > 0)
          return prev.map((p) => {
            if (p.idPregunta === pregunta.id) {
              return {
                ...p,
                idOpcion: newIds,
              };
            }
            return p;
          });
        //? EL ARRAY ESTA VACÍO, QUITAR LA PREGUNTA DEL FORMULARIO
        return prev.filter((p) => p.idPregunta !== pregunta.id);
      });
    } else {
      //* SELECCION ÚNICA
      setForm((prev) => {
        if (exist) {
          return prev.map((v) => {
            if (v.idPregunta === pregunta.id) {
              return { ...v, idOpcion };
            }
            return v;
          });
        } else {
          return [
            ...prev,
            {
              idPregunta: pregunta.id,
              idOpcion,
            },
          ];
        }
      });
      if (nextCondition && !prev && !inLastPregunta) {
        timerRef.current = setTimeout(() => {
          setPreguntaIndex(preguntaIndex + 1, 1);
          setFinalizedAnimation(true);
        }, 1300);
      }
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
    }),
    active: {
      x: 0,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
    }),
  };

  const descripcion = cleanOptionTags(pregunta.descripcion);
  return (
    <>
      <TestOutside
        data={data}
        finished={finished}
        initiated={form.length > 0}
        setOpen={setOpen}
      />
      {modal(
        data.nombre_test,
        <>
          <TestAutofill
            finished={finished}
            form={form}
            prev={prev}
            setForm={setForm}
            setPreguntaIndex={setPreguntaIndex}
            test={test}
          />
          <div className="flex flex-col gap-2">
            <TestPhrase />
            <TestProgress
              finished={finished}
              preguntaIndex={preguntaIndex}
              totalPreguntas={preguntas.length}
            />
            <TestCarousel test={test}>
              {finishedPage ? (
                <TestFinishPage direction={direction} variants={variants} />
              ) : requirements.length > 0 ? (
                <TestRequirements
                  direction={direction}
                  requirements={requirements}
                  variants={variants}
                />
              ) : (
                <motion.div
                  key={pregunta.id}
                  variants={variants}
                  custom={direction}
                  initial="enter"
                  animate="active"
                  exit="exit"
                  className="flex justify-center py-10 max-md:py-4 inset-0 absolute"
                >
                  <div className="flex flex-col gap-3 w-[600px] max-w-full">
                    <div className="flex flex-col px-4 gap-1">
                      <h4 className="text-base text-alto-600 max-md:text-sm">
                        Pregunta {preguntaIndex + 1}.
                      </h4>
                      <h3 className="text-xs text-alto-500">
                        {seccion?.type === "multi"
                          ? "Selecciona varias opciones"
                          : "Selecciona una opción"}
                      </h3>
                    </div>
                    <div className="border-b border-alto-200 px-4 h-40 flex items-center">
                      <motion.div
                        className={clsx("w-full", {
                          "flex justify-center": pregunta.type === "image",
                        })}
                        initial={{
                          opacity: !exist ? 0 : 1,
                          y: !exist ? "-100%" : 0,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay: 0.4,
                          ease: "easeOut",
                          duration: 0.5,
                        }}
                      >
                        {
                          {
                            text: (
                              <p
                                title={descripcion}
                                className={clsx(
                                  "text-lg line-clamp-5 whitespace-pre-line max-md:text-sm max-md:text-center max-md:text-balance",
                                  {
                                    "text-center": pregunta.align === "center",
                                  }
                                )}
                              >
                                {descripcion}
                              </p>
                            ),
                            image: (
                              <img
                                className="object-cover max-h-36 rounded-md max-w-full border-2 border-alto-50 shadow-lg"
                                src={STORAGE_URL + pregunta.descripcion}
                              />
                            ),
                          }[pregunta.type ?? "text"]
                        }
                      </motion.div>
                    </div>
                    <div className="flex flex-col pt-2 px-4 gap-4">
                      {opciones.map((opcion) => {
                        const ids = exist?.idOpcion;
                        const isMulti =
                          seccion?.type === "multi" && Array.isArray(ids);
                        const checked = isMulti
                          ? ids.includes(opcion.id)
                          : ids === opcion.id;
                        return (
                          <button
                            key={opcion.id}
                            onClick={() => handleOption(opcion.id)}
                            className={clsx(
                              "w-full max-md:px-4 gap-2 flex items-center justify-between border border-alto-300 px-10 h-10 rounded-md transition-all duration-300 disabled:cursor-pointer",
                              {
                                "border-l-8 border-l-primary-500 bg-white shadow-sm":
                                  checked,
                                "hover:shadow-md": !finished,
                              }
                            )}
                            disabled={finished || (isMulti ? false : checked)}
                          >
                            <p className="text-sm max-md:text-xs text-start">
                              {opcion.descripcion}{" "}
                              {getOptionText(pregunta.descripcion, opcion.id)}
                            </p>
                            <div className="h-6 aspect-square text-alto-300 flex items-center justify-center">
                              <Icon
                                type={
                                  checked
                                    ? Icon.Types.CHECK_ANIMATED
                                    : Icon.Types.CHECK
                                }
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </TestCarousel>
            <div className={clsx("w-full flex gap-4", "justify-between")}>
              <Button
                key="anterior"
                disabled={preguntaIndex === 0}
                onClick={() => {
                  if (finishedPage) {
                    setPreguntaIndex(preguntaIndex, -1);
                    setFinishedPage(false);
                    return;
                  }
                  setPreguntaIndex(preguntaIndex - 1, -1);
                }}
                reverse
                btnType="secondary"
                icon={Icon.Types.ARROW_LEFT}
              >
                Anterior
              </Button>
              {finishedPage ? (
                <Button
                  key="regresar"
                  btnType="primary"
                  icon={Icon.Types.BRAIN}
                  onClick={() => navigate({ to: "/resolve" })}
                >
                  Regresar a tests
                </Button>
              ) : requirements.length > 0 ? (
                <Button
                  key="regresar"
                  btnType="primary"
                  icon={Icon.Types.CHEVRON_RIGHT}
                  form="userForm"
                  type="submit"
                >
                  Continuar
                </Button>
              ) : !inLastPregunta ? (
                <Button
                  key="siguiente"
                  disabled={nextCondition && !prev}
                  onClick={() => {
                    setPreguntaIndex(preguntaIndex + 1, 1);
                  }}
                  btnType="secondary"
                  icon={Icon.Types.ARROW_RIGHT}
                >
                  Siguiente
                </Button>
              ) : finished ? (
                <Button
                  key="siguiente"
                  disabled={finished || (nextCondition && !prev)}
                  onClick={() => {
                    setPreguntaIndex(preguntaIndex + 1, 1);
                  }}
                  btnType="secondary"
                  icon={Icon.Types.ARROW_RIGHT}
                >
                  Siguiente
                </Button>
              ) : (
                <Button
                  key="enviar"
                  disabled={!allPreguntasChecked || prev}
                  btnType="primary"
                  icon={Icon.Types.ARROW_RIGHT}
                  onClick={() => handleSend(form)}
                >
                  Terminar
                </Button>
              )}
            </div>
          </div>
        </>,
        {
          blur: true,
          width: 920,
          titleBar: false,
        }
      )}
    </>
  );
};

export default Test;
