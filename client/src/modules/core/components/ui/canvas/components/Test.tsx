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
import { TEST_CAROUSEL_VARIANT } from "../constants/TEST_CAROUSEL_VARIANT";
import TestSection from "./TestSection";
import { formatTime } from "@/modules/core/utils/formatTime";
import { useTestTimer } from "../hooks/useTestTimer";
import TestTimeout from "./TestTimeout";
import { COLORS } from "@/modules/core/constants/COLORS";

interface Props {
  data: T_Test | T_Test_Respuesta;
  test: TestType;
  idRespuesta?: number;
}

const Test = ({ data, test, idRespuesta }: Props) => {
  const { modal, open, setOpen } = useModal();
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

  const { preguntas, secciones, pregunta, opciones, seccion, requirements } =
    useTestActual(test, preguntaIndex);

  const [sectionViews, setSectionViews] = useState<
    {
      id: number;
      view: boolean;
    }[]
  >(
    secciones
      .map((s) =>
        s.description
          ? {
              id: s.id,
              view: true,
            }
          : undefined
      )
      .filter((s) => !!s)
  );
  const [canViewSection, setCanViewSection] = useState(!prev && !finished);

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

  const allPreguntasChecked = secciones.every((s) =>
    (s.required ?? true)
      ? s.items.every((i) => form.map((f) => f.idPregunta).includes(i.id))
      : true
  );

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
        }, 1200);
      }
    }
  };

  const descripcion = cleanOptionTags(pregunta.descripcion);
  const viewSection =
    canViewSection && sectionViews.some((s) => s.id === seccion?.id && s.view);
  const firstOfSection =
    !finished &&
    !prev &&
    seccion?.items.findIndex((p) => p.id === pregunta.id) === 0;

  const { timer, isLastSection, goToNextSection } = useTestTimer(
    preguntaIndex,
    setPreguntaIndex,
    preguntas,
    secciones,
    seccion,
    open,
    viewSection,
    prev
  );

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
            {seccion && pregunta && (
              <TestProgress
                secciones={secciones}
                seccion={seccion}
                pregunta={pregunta}
                finished={finished}
              />
            )}
            <TestCarousel test={test}>
              {finishedPage ? (
                <TestFinishPage direction={direction} />
              ) : requirements.length > 0 ? (
                <TestRequirements
                  direction={direction}
                  requirements={requirements}
                />
              ) : timer === 0 ? (
                <TestTimeout
                  direction={direction}
                  text={
                    isLastSection
                      ? "Se acabó tu tiempo para esta sección, envía tus resultados haciendo click en el botón de terminar."
                      : "Se acabó tu tiempo para esta sección, haz click en el botón de continuar."
                  }
                />
              ) : viewSection ? (
                <TestSection direction={direction} seccion={seccion} />
              ) : (
                <motion.div
                  key={pregunta.id}
                  variants={TEST_CAROUSEL_VARIANT}
                  custom={direction}
                  initial="enter"
                  animate="active"
                  exit="exit"
                  className="flex justify-center py-10 max-md:py-4 inset-0 absolute"
                >
                  <div className="flex flex-col gap-3 w-[600px] max-w-full relative">
                    <div className="absolute top-0 right-4 flex gap-2">
                      {timer !== null && (
                        <div
                          className={clsx(
                            "text-center select-none group h-8 hover:w-20 ring-0 hover:ring-1 ring-inset ring-primary-400 overflow-hidden transition-all duration-300 w-8 gap-1 rounded-md flex items-center justify-between border border-alto-300 text-alto-500 p-1",
                            {
                              "!w-20": timer <= 20,
                            }
                          )}
                        >
                          <motion.div
                            animate={
                              timer <= 20
                                ? {
                                    color: [
                                      COLORS.alto[500],
                                      COLORS.primary[500],
                                      COLORS.alto[500],
                                    ],
                                  }
                                : undefined
                            }
                            transition={{
                              color: {
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "mirror",
                                ease: "easeInOut",
                              },
                            }}
                            className="h-full aspect-square"
                          >
                            <Icon type={Icon.Types.CLOCK} />
                          </motion.div>
                          <p
                            className={clsx(
                              "group-hover:opacity-100 opacity-0 flex-1 transition-all duration-300 text-sm",
                              {
                                "opacity-100": timer <= 20,
                              }
                            )}
                          >
                            {formatTime(timer)}
                          </p>
                        </div>
                      )}
                      {seccion?.description && (
                        <button
                          onClick={() => {
                            setSectionViews((prev) =>
                              prev.map((prev) => {
                                if (prev.id === seccion?.id) {
                                  return { ...prev, view: true };
                                }
                                return prev;
                              })
                            );
                            setCanViewSection(true);
                            setCurrentPage((prev) => [prev[0], 1]);
                          }}
                          className="w-8 rounded-md aspect-square flex items-center justify-between border border-alto-300 text-alto-500 p-1"
                        >
                          <Icon type={Icon.Types.QUESTION} />
                        </button>
                      )}
                    </div>
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
                              "w-full max-md:px-4 gap-2 flex items-center disabled:hover:shadow-none justify-between border border-alto-300 px-10 h-10 rounded-md transition-all duration-300 disabled:cursor-default",
                              {
                                "border-l-8 border-l-primary-500 bg-white shadow-sm":
                                  checked,
                                "hover:shadow-md": !finished,
                              }
                            )}
                            disabled={
                              finished ||
                              timer === 0 ||
                              (isMulti ? false : checked)
                            }
                          >
                            <p className="text-sm max-md:text-xs text-start">
                              {getOptionText(pregunta.descripcion, opcion.id) ||
                                opcion.descripcion}
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
                disabled={
                  firstOfSection ||
                  viewSection ||
                  preguntaIndex === 0 ||
                  timer === 0
                }
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
              ) : timer === 0 ? (
                isLastSection ? (
                  <Button
                    key="regresar"
                    btnType="primary"
                    icon={Icon.Types.CHEVRON_RIGHT}
                    onClick={() => handleSend(form)}
                    disabled={!allPreguntasChecked || prev}
                  >
                    Terminar
                  </Button>
                ) : (
                  <Button
                    key="regresar"
                    btnType="primary"
                    icon={Icon.Types.CHEVRON_RIGHT}
                    onClick={goToNextSection}
                  >
                    Continuar
                  </Button>
                )
              ) : viewSection ? (
                <Button
                  key="regresar"
                  btnType="primary"
                  icon={Icon.Types.CHEVRON_RIGHT}
                  onClick={() => {
                    setSectionViews((prev) =>
                      prev.map((prev) => {
                        if (prev.id === seccion?.id) {
                          return { ...prev, view: false };
                        }
                        return prev;
                      })
                    );
                    setCanViewSection(!prev && !finished);
                    setCurrentPage((prev) => [prev[0], 1]);
                  }}
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
