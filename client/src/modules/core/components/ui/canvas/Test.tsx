import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "../../icons/Icon";
import Button from "../Button";
import { useModal } from "../modal/useModal";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { FRASES } from "@/modules/core/data";
import {
  Item,
  Requirements,
  TestType,
} from "@/modules/features/tests/types/TestType";
import {
  T_Test,
  T_Test_Respuesta,
} from "@/modules/features/tests/api/responses";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { toastSuccess } from "@/modules/core/utils/toasts";
import IconMessage from "../../icons/IconMessage";
import { COLORS } from "@/modules/core/constants/COLORS";
import { useNavigate } from "@tanstack/react-router";
import Autofill from "./components/Autofill";
import { TestForm } from "@/modules/features/tests/api/dtos";
import { isForResolveTest } from "@/modules/features/tests/utils/isForResolve";
import { useMeasureContext } from "@/modules/features/_layout/context/MeasureContext";
import { useUserContext } from "@/modules/features/auth/context/UserContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserRequiredDTOSchema } from "@/modules/features/users/validations/UserDTOSchema";
import { UserRequiredDTO } from "@/modules/features/users/api/dtos";
import Input from "../Input";
import { Genero } from "@/modules/features/users/types/Genero";
import { cleanOptionTags, getOptionText } from "./utils/dynamicOptions";
import { STORAGE_URL } from "@/modules/core/constants/ENVIRONMENT";

function obtenerFraseAleatoria() {
  const indiceAleatorio = Math.floor(Math.random() * FRASES.length);
  return FRASES[indiceAleatorio];
}

interface Props {
  data: T_Test | T_Test_Respuesta;
  test: TestType;
  idRespuesta?: number;
}

const Test = ({ data, test, idRespuesta }: Props) => {
  const { modal, setOpen } = useModal();

  const { size } = useMeasureContext();

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

  const resultados: TestForm[] | null = isForResolveTest(data)
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

  const { user, setUser } = useUserContext();
  const requirements = test.requerimientos.filter((r) => {
    switch (r) {
      case Requirements.EDAD:
        return !user?.fecha_nacimiento;
      case Requirements.GENERO:
        return !user?.genero;
      default:
        return true;
    }
  });
  const userMutation = postData("PUT /user/:id");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRequiredDTO>({
    defaultValues: {
      fecha_nacimiento: user?.fecha_nacimiento ?? undefined,
      genero: user?.genero ?? undefined,
    },
    resolver: yupResolver(UserRequiredDTOSchema),
  });

  const handleSaveUserData = (form: UserRequiredDTO) => {
    console.log(form);
    userMutation(form, {
      params: {
        id: String(user?.email),
      },
      onSuccess: (res) => {
        toastSuccess(res.message);
        setUser(res.data);
      },
    });
  };

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
              if (v.id_respuesta === res.data.id_respuesta) return res.data;
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

  let height = size !== "normal" ? 32 : 80; //py-10
  height += size !== "normal" ? 20 : 24; //h4
  height += 24; //gap-3 x2
  height += (size !== "normal" ? 20 : 28) * 5 + 20; //p
  height += 8; //opciones pt-2
  height += (maxOpciones - 1) * 16; //opciones gap-4
  height += maxOpciones * 40; //2 opciones h-10
  height -= -2; //!DIOSITO SABE POR QUE TUVE QUE AUMENTARLE UNO MÁS

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
    <div className="w-full py-4 flex flex-col gap-2">
      <div className="px-4 w-full flex flex-col gap-2 pb-2 border-b-2 border-primary-200">
        <h3 className="text-[40px] leading-[40px] font-bold text-primary-900 after:content-['.'] after:text-primary-500">
          {data.nombre_test}
        </h3>
        <div className="w-full flex flex-wrap gap-4 items-center justify-between">
          <strong
            className={clsx("min-w-52 flex-[9999_1_0]", {
              "text-success": finished,
              "text-alto-800": !finished,
            })}
          >
            {finished ? "¡Ya resolviste este test!" : "¡Inicia tu test ahora!"}
          </strong>
          <div className="flex-1 flex justify-center">
            <Button
              onClick={() => setOpen(true)}
              icon={Icon.Types.CHEVRON_RIGHT}
            >
              {finished
                ? "Ver mis respuestas"
                : form.length > 0
                  ? "Continuar el test"
                  : "¡Comienza tu test!"}
            </Button>
          </div>
        </div>
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
            <small className="text-alto-700 max-md:text-center max-md:flex max-md:flex-col max-md:gap-1">
              <span className="italic text-xs">
                "{frase.frase}"&nbsp;&nbsp;
              </span>
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
                {requirements.length > 0 ? (
                  <motion.div
                    variants={variants}
                    custom={direction}
                    initial="enter"
                    animate="active"
                    exit="exit"
                    className="absolute inset-0 flex flex-col items-center justify-center"
                  >
                    <form
                      id="userForm"
                      className="flex flex-col gap-4 px-2 w-72"
                      onSubmit={handleSubmit(handleSaveUserData)}
                    >
                      <h2 className="text-sm font-bold pb-4 text-center">
                        Por favor llena tus datos antes de comenzar
                      </h2>
                      {requirements.map((r) => {
                        switch (r) {
                          case Requirements.EDAD:
                            return (
                              <Input
                                label="Fecha de nacimiento"
                                type="date"
                                error={errors.fecha_nacimiento?.message}
                                {...register("fecha_nacimiento")}
                              />
                            );
                          case Requirements.GENERO:
                            return (
                              <Input
                                label="Género"
                                error={errors.genero?.message}
                                type="select"
                                {...register("genero")}
                              >
                                <option value="">Sin especificar</option>
                                {Object.values(Genero).map((genero) => (
                                  <option key={genero} value={genero}>
                                    {genero}
                                  </option>
                                ))}
                              </Input>
                            );
                        }
                      })}
                    </form>
                  </motion.div>
                ) : finishedPage ? (
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
                    className="flex justify-center py-10 max-md:py-4 inset-0 absolute"
                  >
                    <div className="flex flex-col gap-3 w-[600px] max-w-full">
                      <h4 className="text-base text-alto-600 px-4 max-md:text-sm">
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
                                  title={descripcion}
                                  className={clsx(
                                    "text-lg line-clamp-5 whitespace-pre-line max-md:text-sm max-md:text-center max-md:text-balance",
                                    {
                                      "text-center":
                                        pregunta.align === "center",
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
                        {opciones.map((opcion) => (
                          <button
                            key={opcion.id}
                            onClick={() => handleOption(opcion.id)}
                            className={clsx(
                              "w-full max-md:px-4 gap-2 flex items-center justify-between border border-alto-300 px-10 h-10 rounded-md transition-all duration-300 disabled:cursor-pointer",
                              {
                                "border-l-8 border-l-primary-500 bg-white -translate-y-1 shadow-sm":
                                  exist?.idOpcion === opcion.id,
                                "hover:-translate-y-1 hover:shadow-sm":
                                  !finished,
                              }
                            )}
                            disabled={finished || exist?.idOpcion === opcion.id}
                          >
                            <p className="text-sm max-md:text-xs text-start">
                              {opcion.descripcion}{" "}
                              {getOptionText(pregunta.descripcion, opcion.id)}
                            </p>
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
              {requirements.length > 0 ? (
                <Button
                  key="regresar"
                  btnType="primary"
                  icon={Icon.Types.CHEVRON_RIGHT}
                  form="userForm"
                  type="submit"
                >
                  Continuar
                </Button>
              ) : finishedPage ? (
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
