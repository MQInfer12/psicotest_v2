import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "../../icons/Icon";
import Button from "../Button";
import { useModal } from "../modal/useModal";
import { CANVAS_PADDING } from "./constants/CANVAS";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { FRASES } from "@/modules/core/data";
import { Item, TestType } from "@/modules/features/tests/types/TestType";

interface TestForm {
  idPregunta: number;
  idOpcion: number;
}

function obtenerFraseAleatoria() {
  const indiceAleatorio = Math.floor(Math.random() * FRASES.length);
  return FRASES[indiceAleatorio];
}

interface Props {
  test: TestType;
}

const Test = ({ test }: Props) => {
  const { modal, setOpen } = useModal();
  const [[preguntaIndex, direction], setCurrentPage] = useState([0, 1]);
  const [form, setForm] = useState<TestForm[]>([]);
  const frase = useMemo(() => obtenerFraseAleatoria(), []);
  const timerRef = useRef<any>();

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
    if (nextCondition) {
      timerRef.current = setTimeout(() => {
        setPreguntaIndex(preguntaIndex + 1, 1);
        setFinalizedAnimation(true);
      }, 1500);
    }
  };

  const maxOpciones = test.secciones.reduce(
    (maximo, seccion) =>
      seccion.opciones.length > maximo ? seccion.opciones.length : maximo,
    0
  );

  let height = 80; //p-10
  height += 24; //h4
  height += 24; //gap-3 x2
  height += 128; //p
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
            MAPI
          </h3>
          <strong className="text-alto-800">¡Inicia tu test ahora!</strong>
        </div>
        <Button onClick={() => setOpen(true)} icon={Icon.Types.ARROW_RIGHT}>
          {form.length > 0 ? "Continuar el test" : "¡Comienza tu test!"}
        </Button>
      </div>
      {modal(
        "Test MAPI",
        <div className="flex flex-col gap-2">
          <small className="text-alto-700 flex gap-2">
            <span className="italic text-xs">"{frase.frase}"</span>
            <span className="text-[10px] text-primary-400">
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
                }}
                className="block h-full bg-primary-600"
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
                  <div className="border-b border-alto-200 px-4 h-32 flex items-center">
                    <motion.p
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
                      title={pregunta.descripcion}
                      className="rounded-md text-lg line-clamp-4"
                    >
                      {pregunta.descripcion}
                    </motion.p>
                  </div>
                  <div className="flex flex-col pt-2 px-4 gap-4">
                    {opciones.map((opcion) => (
                      <button
                        key={opcion.id}
                        onClick={() => handleOption(opcion.id)}
                        className={clsx(
                          "w-full flex items-center justify-between border border-alto-300 px-10 h-10 text-sm rounded-md transition-all duration-300 hover:-translate-y-1 hover:shadow-sm disabled:cursor-pointer",
                          {
                            "border-l-8 border-l-primary-500 bg-white -translate-y-1 shadow-sm":
                              exist?.idOpcion === opcion.id,
                          }
                        )}
                        disabled={exist?.idOpcion === opcion.id}
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
            </AnimatePresence>
          </div>
          <div className="self-center flex gap-4">
            <Button
              disabled={preguntaIndex === 0}
              onClick={() => {
                setPreguntaIndex(preguntaIndex - 1, -1);
              }}
              reverse
              btnType="secondary"
              icon={Icon.Types.ARROW_LEFT}
            >
              Anterior
            </Button>
            <Button
              disabled={nextCondition}
              onClick={() => {
                setPreguntaIndex(preguntaIndex + 1, 1);
              }}
              btnType="secondary"
              icon={Icon.Types.ARROW_RIGHT}
            >
              Siguiente
            </Button>
          </div>
        </div>,
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
