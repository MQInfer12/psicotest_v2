import { COLORS } from "@/modules/core/constants/COLORS";
import { STORAGE_URL } from "@/modules/core/constants/ENVIRONMENT";
import { useThemeContext } from "@/modules/core/context/ThemeContext";
import { formatTime } from "@/modules/core/utils/formatTime";
import { TestForm } from "@/modules/features/tests/api/dtos";
import {
  T_Test,
  T_Test_Respuesta,
} from "@/modules/features/tests/api/responses";
import { TestType } from "@/modules/features/tests/types/TestType";
import { isForResolveTest } from "@/modules/features/tests/utils/isForResolve";
import { useBlocker, useNavigate } from "@tanstack/react-router";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Icon from "../../../icons/Icon";
import Button from "../../Button";
import { useModal } from "../../modal/useModal";
import { TEST_CAROUSEL_VARIANT } from "../constants/TEST_CAROUSEL_VARIANT";
import { useTestActual } from "../hooks/useTestActual";
import { useTestSender } from "../hooks/useTestSender";
import { useTestTimer } from "../hooks/useTestTimer";
import { cleanOptionTags, getOptionText } from "../utils/dynamicOptions";
import TestAutofill from "./TestAutofill";
import TestCarousel from "./TestCarousel";
import TestFinishPage from "./TestFinishPage";
import TestOutside from "./TestOutside";
import TestPhrase from "./TestPhrase";
import TestProgress from "./TestProgress";
import TestRequirements from "./TestRequirements";
import TestSection from "./TestSection";
import TestTextSection from "./TestTextSection";
import TestTextSectionForm from "./TestTextSectionForm";
import TestTimeout from "./TestTimeout";

interface Props {
  data: T_Test | T_Test_Respuesta;
  test: TestType;
  idRespuesta?: number;
}

const Test = ({ data, test, idRespuesta }: Props) => {
  const { dark } = useThemeContext();

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

  const [autoNext, setAutoNext] = useState(true);
  const nextCondition =
    (seccion?.required ?? true) ? !exist || !finalizedAnimation : false;

  const inLastPregunta = preguntaIndex === preguntas.length - 1;

  const allPreguntasChecked = secciones.every((s) =>
    (s.required ?? true)
      ? s.items.every((i) => form.map((f) => f.idPregunta).includes(i.id))
      : true
  );

  const timerRef = useRef<any>();
  const handleOption = (idOpcion: number) => {
    clearTimeout(timerRef.current);
    switch (seccion?.type ?? "single") {
      case "multi":
        setFinalizedAnimation(true);
        setForm((prev) => {
          //? PREGUNTA TODAVÍA NO EXISTE EN EL ARRAY DEL FORMULARIO
          if (!exist)
            return [
              ...prev,
              {
                idPregunta: pregunta.id,
                idOpcion: [idOpcion],
              },
            ];
          //? ESTA OPCION TODAVÍA NO SE CHECKEO, AÑADIR AL ARRAY
          const ids = exist.idOpcion as number[];
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
        break;
      case "single":
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
        if (autoNext) {
          if ((seccion?.required ?? true) ? nextCondition : !exist) {
            if (!prev && !inLastPregunta) {
              timerRef.current = setTimeout(() => {
                setCurrentPage((prev) => {
                  if (prev[0] === preguntaIndex) {
                    return [prev[0] + 1, 1];
                  }
                  return prev;
                });
                setFinalizedAnimation(true);
              }, 1200);
            }
          }
        } else {
          setFinalizedAnimation(true);
        }
        break;
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
    prev,
    finished
  );

  useBlocker({
    blockerFn: () => {
      const shouldLeave = confirm(
        "¿Estás seguro de que quieres salir? Tus cambios no se guardarán."
      );
      return shouldLeave;
    },
    condition: !prev && !finished && form.length > 0,
  });

  const showTextSection = seccion?.type === "text";
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
            preguntas={preguntas}
            setSectionViews={setSectionViews}
          />
          <div className="flex flex-col gap-2">
            <div className="petizo:hidden">
              <TestPhrase />
            </div>
            {seccion && pregunta && (
              <TestProgress
                secciones={secciones}
                seccion={seccion}
                pregunta={pregunta}
                finished={finished}
                paused={requirements.length > 0 || timer === 0 || viewSection}
              />
            )}
            <TestCarousel test={test}>
              {finishedPage ? (
                <TestFinishPage direction={direction} setOpen={setOpen} />
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
                  className="flex justify-center py-6 max-md:py-4 inset-0 absolute"
                >
                  <div className="flex flex-col gap-3 w-[600px] max-w-full relative">
                    <div className="absolute top-0 right-4 flex gap-2">
                      {timer !== null && (
                        <div
                          className={clsx(
                            "text-center select-none group h-8 hover:w-20 ring-0 hover:ring-1 ring-inset ring-primary-400 overflow-hidden transition-all duration-300 w-8 gap-1 rounded-md flex items-center justify-between border border-alto-300/70 dark:border-alto-700 text-alto-500 dark:text-alto-400 p-1",
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
                                      dark
                                        ? COLORS.alto[400]
                                        : COLORS.alto[500],
                                      dark
                                        ? COLORS.primary[400]
                                        : COLORS.primary[500],
                                      dark
                                        ? COLORS.alto[400]
                                        : COLORS.alto[500],
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
                          title="Ver instrucciones de la sección"
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
                          className="w-8 rounded-md aspect-square flex items-center justify-between border border-alto-300/70 dark:border-alto-700 text-alto-500 dark:text-alto-400 p-1"
                        >
                          <Icon type={Icon.Types.QUESTION} />
                        </button>
                      )}
                      {!finished &&
                        !prev &&
                        (seccion?.type ?? "single") === "single" && (
                          <button
                            onClick={() => setAutoNext(!autoNext)}
                            title="Pasar automáticamente"
                            disabled={!!exist}
                            className={clsx(
                              "w-8 rounded-md aspect-square flex items-center justify-between border border-alto-300/70 dark:border-alto-700 p-1 transition-all duration-300",
                              {
                                "text-primary-500 dark:text-primary-400":
                                  autoNext,
                              },
                              "text-alto-500 dark:text-alto-400",
                              "disabled:bg-alto-100 dark:disabled:bg-alto-900 disabled:text-primary-200 dark:disabled:text-alto-800 disabled:border-primary-200 dark:disabled:border-alto-800"
                            )}
                          >
                            <Icon type={Icon.Types.SWIPE} />
                          </button>
                        )}
                    </div>
                    <div className="flex flex-col px-4 gap-1">
                      <h4 className="text-base text-alto-700 dark:text-alto-400 max-md:text-sm">
                        Pregunta {preguntaIndex + 1}.
                      </h4>
                      <h3 className="text-xs text-alto-500">
                        {
                          {
                            single: "Selecciona una opción",
                            multi: "Selecciona varias opciones",
                            text: "Escribe tu respuesta",
                          }[seccion?.type ?? "single"]
                        }
                      </h3>
                    </div>
                    <div className="border-b border-alto-300/70 dark:border-alto-700 px-4 h-32 flex items-center">
                      <motion.div
                        className={clsx(
                          "w-full h-full flex flex-col justify-center",
                          {
                            "items-center": pregunta.type === "image",
                          }
                        )}
                        initial={{
                          opacity: !exist ? 0 : 1,
                          y: !exist ? "-60%" : 0,
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
                        {showTextSection ? (
                          <TestTextSection form={form} pregunta={pregunta} />
                        ) : (
                          {
                            text: (
                              <p
                                title={descripcion}
                                className={clsx(
                                  "text-lg line-clamp-4 whitespace-pre-line max-md:text-sm max-md:text-center max-md:text-balance text-alto-950 dark:text-alto-50",
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
                                className="object-cover max-h-36 rounded-md max-w-full border-2 border-alto-50 dark:border-alto-700 shadow-lg"
                                src={STORAGE_URL + pregunta.descripcion}
                              />
                            ),
                          }[pregunta.type ?? "text"]
                        )}
                      </motion.div>
                    </div>
                    <div className="flex flex-col pt-2 px-4 gap-4">
                      {showTextSection ? (
                        <TestTextSectionForm
                          finished={finished}
                          form={form}
                          pregunta={pregunta}
                          setForm={setForm}
                          seccion={seccion}
                        />
                      ) : (
                        opciones.map((opcion) => {
                          const checked =
                            seccion?.type === "multi"
                              ? (
                                  exist?.idOpcion as number[] | undefined
                                )?.includes(opcion.id)
                              : exist?.idOpcion === opcion.id;
                          return (
                            <button
                              key={opcion.id}
                              onClick={() => handleOption(opcion.id)}
                              className={clsx(
                                "w-full max-md:px-4 gap-2 flex items-center disabled:hover:shadow-none shadow-alto-950/20 dark:shadow-alto-50/10 justify-between border border-alto-300/70 dark:border-alto-700 px-10 h-10 rounded-md transition-all duration-300 disabled:cursor-default",
                                {
                                  "border-l-8 !border-l-primary-500 bg-white dark:bg-alto-950 shadow-sm":
                                    checked,
                                  "hover:shadow-md": !finished,
                                }
                              )}
                              disabled={
                                finished ||
                                timer === 0 ||
                                (seccion?.type === "multi" ? false : checked)
                              }
                            >
                              <p className="text-sm max-md:text-xs text-start text-alto-950 dark:text-alto-50">
                                {getOptionText(
                                  pregunta.descripcion,
                                  opcion.id
                                ) || opcion.descripcion}
                              </p>
                              <div className="h-6 aspect-square text-alto-400 flex items-center justify-center">
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
                        })
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </TestCarousel>
            <div className={clsx("w-full flex gap-4", "justify-between")}>
              {preguntaIndex !== 0 ? (
                <Button
                  key="anterior"
                  disabled={firstOfSection || viewSection || timer === 0}
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
              ) : (
                <span />
              )}
              {finishedPage ? (
                <Button
                  key="regresar_a_tests"
                  btnType="secondary"
                  icon={Icon.Types.BRAIN}
                  onClick={() => navigate({ to: "/resolve" })}
                >
                  Regresar a tests
                </Button>
              ) : requirements.length > 0 ? (
                <Button
                  key="continuar_al_test"
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
                    key="terminar_test_por_tiempo"
                    btnType="primary"
                    icon={Icon.Types.CHEVRON_RIGHT}
                    onClick={() => handleSend(form)}
                  >
                    Terminar
                  </Button>
                ) : (
                  <Button
                    key="continuar_siguiente_seccion"
                    btnType="primary"
                    icon={Icon.Types.CHEVRON_RIGHT}
                    onClick={goToNextSection}
                  >
                    Continuar
                  </Button>
                )
              ) : viewSection ? (
                <Button
                  key="continuar_a_preguntas"
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
                  disabled={finished || prev ? false : nextCondition}
                  onClick={() => {
                    setPreguntaIndex(preguntaIndex + 1, 1);
                  }}
                  btnType="secondary"
                  icon={Icon.Types.ARROW_RIGHT}
                >
                  Siguiente
                </Button>
              ) : (
                !finished && (
                  <Button
                    key="terminar_test"
                    disabled={!allPreguntasChecked || prev}
                    btnType="primary"
                    icon={Icon.Types.ARROW_RIGHT}
                    onClick={() => handleSend(form)}
                  >
                    Terminar
                  </Button>
                )
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
