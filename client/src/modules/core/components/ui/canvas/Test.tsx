import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "../../icons/Icon";
import Button from "../Button";
import { useModal } from "../modal/useModal";
import { CANVAS_PADDING } from "./constants/CANVAS";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { FRASES } from "@/modules/core/data";
import { Item, TestType } from "@/modules/features/tests/types/TestType";
import { T_Test } from "@/modules/features/tests/api/responses";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { toastSuccess } from "@/modules/core/utils/toasts";
import IconMessage from "../../icons/IconMessage";
import { COLORS } from "@/modules/core/constants/COLORS";
import { useNavigate } from "@tanstack/react-router";
import Autofill from "./components/Autofill";

function obtenerFraseAleatoria() {
  const indiceAleatorio = Math.floor(Math.random() * FRASES.length);
  return FRASES[indiceAleatorio];
}

export interface TestForm {
  idPregunta: number;
  idOpcion: number;
}

interface Props {
  data: T_Test;
  test: TestType;
  idRespuesta?: number;
}

const Test = ({ data, test, idRespuesta }: Props) => {
  const { modal, setOpen } = useModal();

  const preguntas = useMemo(
    () =>
      test.secciones.reduce((total, seccion) => {
        seccion.items.forEach((i) => {
          total.push(i);
        });
        return total;
      }, [] as Item[]),
    [test]
  );

  const resultados: TestForm[] | null = data.resultados
    ? JSON.parse(data.resultados)
    : null;
  const [finished, setFinished] = useState(!!resultados);
  const [finishedPage, setFinishedPage] = useState(false);

  const [[preguntaIndex, direction], setCurrentPage] = useState([
    finished ? preguntas.length - 1 : 0,
    1,
  ]);
  const [form, setForm] = useState<TestForm[]>(resultados || []);

  const { getDataSetter, postData } = useFetch();
  const mutation = postData("PUT /respuesta/:id");
  const testsSetter = getDataSetter("GET /respuesta/for/resolve");
  const testSetter = getDataSetter([
    "GET /test/by/respuesta/:id",
    {
      id: Number(idRespuesta),
    },
  ]);
  const navigate = useNavigate();

  const prev = !idRespuesta;

  const frase = useMemo(() => obtenerFraseAleatoria(), []);
  const timerRef = useRef<any>();

  const pregunta = preguntas[preguntaIndex];
  const opciones =
    test.secciones.find((seccion) =>
      seccion.items.some((item) => item.id === pregunta.id)
    )?.opciones || [];

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

  const handleOption = (idOpcion: number) => {
    clearTimeout(timerRef.current);
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
  };

  const handleSend = async (body: TestForm[]) => {
    if (prev) return;
    mutation(
      {
        resultados: JSON.stringify(body),
      },
      {
        params: {
          id: idRespuesta,
        },
        onSuccess: (res) => {
          toastSuccess(res.message);
          setFinishedPage(true);
          setFinished(true);
          testsSetter((old) => {
            return old.map((v) => {
              if (v.id === res.data.id) return res.data;
              return v;
            });
          });
          testSetter((prev) => ({
            ...prev,
            resultados: JSON.stringify(form),
          }));
        },
      }
    );
  };

  const maxOpciones = test.secciones.reduce(
    (maximo, seccion) =>
      seccion.opciones.length > maximo ? seccion.opciones.length : maximo,
    0
  );

  let height = 80; //p-10
  height += 24; //h4
  height += 24; //gap-3 x2
  height += 160; //p
  height += 16; //opciones mt-4
  height += 16; //opciones gap-4
  height += maxOpciones * 40; //2 opciones h-10
  height -= -1; //!BORDE DE MRD

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

  return (
    <div className="w-full py-4 flex flex-col gap-2">
      <div className="w-full flex justify-between items-end pb-2 border-b-2 border-primary-200">
        <div
          style={{
            paddingInline: CANVAS_PADDING,
          }}
          className="flex flex-col gap-2"
        >
          <h3 className="text-[40px] leading-[40px] font-bold text-primary-900 after:content-['.'] after:text-primary-500">
            {data.nombre_test}
          </h3>
          <strong
            className={clsx({
              "text-success": finished,
              "text-alto-800": !finished,
            })}
          >
            {finished ? "¡Ya resolviste este test!" : "¡Inicia tu test ahora!"}
          </strong>
        </div>
        <Button onClick={() => setOpen(true)} icon={Icon.Types.ARROW_RIGHT}>
          {form.length > 0 ? "Continuar el test" : "¡Comienza tu test!"}
        </Button>
      </div>
      {modal(
        data.nombre_test,
        <>
          <Autofill
            finished={finished}
            form={form}
            prev={prev}
            setForm={setForm}
            setPreguntaIndex={setPreguntaIndex}
            test={test}
          />
          <div className="flex flex-col gap-2">
            <small className="text-alto-700 gap-2">
              <span className="italic text-xs">"{frase.frase}"</span>
              &nbsp;&nbsp;
              <span className="text-[10px] text-primary-400 whitespace-nowrap">
                ({frase.autor})
              </span>
            </small>
            <div className="w-full flex items-center gap-4">
              <div className="w-20 flex justify-center">
                <small>
                  P: {preguntaIndex + 1} / {preguntas.length}
                </small>
              </div>
              <div className="flex-1 h-2 bg-alto-100 rounded-md overflow-hidden">
                <motion.span
                  animate={{
                    width: `${((preguntaIndex + 1) / preguntas.length) * 100}%`,
                    backgroundColor: !finished
                      ? COLORS.primary[700]
                      : COLORS.success,
                  }}
                  className="block h-full"
                />
              </div>
            </div>
            <div
              style={{
                height,
              }}
              className="w-full bg-alto-100 border border-alto-200 rounded-lg flex relative overflow-hidden"
            >
              <AnimatePresence initial={false} custom={direction}>
                {finishedPage ? (
                  <motion.div
                    variants={variants}
                    custom={direction}
                    initial="enter"
                    animate="active"
                    exit="exit"
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <IconMessage
                      icon={Icon.Types.CHECK}
                      message="¡Muchas gracias por completar el test!"
                      textColor="success"
                      delay={0.5}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key={pregunta.id}
                    variants={variants}
                    custom={direction}
                    initial="enter"
                    animate="active"
                    exit="exit"
                    className="flex justify-center py-10 inset-0 absolute"
                  >
                    <div className="flex flex-col gap-3 w-[600px] max-w-full">
                      <h4 className="text-base text-alto-600 px-4">
                        Pregunta {preguntaIndex + 1}.
                      </h4>
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
                                  title={pregunta.descripcion}
                                  className="text-lg line-clamp-5 whitespace-pre-line"
                                >
                                  {pregunta.descripcion}
                                </p>
                              ),
                              image: (
                                <img
                                  className="object-cover max-h-36 rounded-md max-w-full border-2 border-alto-50 shadow-lg"
                                  src={pregunta.descripcion}
                                />
                              ),
                            }[pregunta.type ?? "text"]
                          }
                        </motion.div>
                      </div>
                      <div className="flex flex-col pt-2 px-4 gap-4">
                        {opciones.map((opcion) => (
                          <button
                            key={opcion.id}
                            onClick={() => handleOption(opcion.id)}
                            className={clsx(
                              "w-full flex items-center justify-between border border-alto-300 px-10 h-10 text-sm rounded-md transition-all duration-300 disabled:cursor-pointer",
                              {
                                "border-l-8 border-l-primary-500 bg-white -translate-y-1 shadow-sm":
                                  exist?.idOpcion === opcion.id,
                                "hover:-translate-y-1 hover:shadow-sm":
                                  !finished,
                              }
                            )}
                            disabled={finished || exist?.idOpcion === opcion.id}
                          >
                            <p>{opcion.descripcion}</p>
                            <div className="h-6 aspect-square text-alto-300 flex items-center justify-center">
                              <Icon
                                type={
                                  exist?.idOpcion === opcion.id
                                    ? Icon.Types.CHECK_ANIMATED
                                    : Icon.Types.CHECK
                                }
                              />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
              ) : inLastPregunta ? (
                finished ? (
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
                )
              ) : (
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
    </div>
  );
};

export default Test;
