import { useMeasureContext } from "@/modules/features/_layout/context/MeasureContext";
import { TestType } from "@/modules/features/tests/types/TestType";
import { AnimatePresence } from "framer-motion";
import React, { useEffect } from "react";

interface Props {
  children: React.ReactNode;
  test: TestType;
}

const TestCarousel = ({ test, children }: Props) => {
  const { size } = useMeasureContext();

  const [chikito, setChikito] = React.useState(window.innerHeight <= 720);
  useEffect(() => {
    window.addEventListener("resize", () => {
      setChikito(window.innerHeight <= 720);
    });
    return () => {
      window.removeEventListener("resize", () => {
        setChikito(window.innerHeight <= 720);
      });
    };
  }, []);

  const maxOpciones = test.secciones.reduce(
    (maximo, seccion) =>
      seccion.opciones.length > maximo ? seccion.opciones.length : maximo,
    0
  );

  let height = (size !== "normal" && size !== "xl") || chikito ? 32 : 48; //py-6
  height += (size !== "normal" && size !== "xl") || chikito ? 40 : 44; //h4
  height += 24; //gap-3 x2
  height += (size !== "normal" && size !== "xl") || chikito ? 96 : 128; //p
  height += 8; //opciones pt-2
  height += (maxOpciones - 1) * (chikito ? 12 : 16); //gap-4 entre opciones
  height += maxOpciones * (chikito ? 32 : 40); //cada opcion 40
  height -= -2; //!DIOSITO SABE POR QUE TUVE QUE AUMENTARLE UNO MÁS

  return (
    <div
      style={{
        height,
        minHeight: height,
        maxHeight: height,
      }}
      className="w-full bg-alto-100 dark:bg-alto-900 border border-alto-300/70 dark:border-alto-800 rounded-lg flex relative overflow-hidden"
    >
      <AnimatePresence initial={false}>{children}</AnimatePresence>
    </div>
  );
};

export default TestCarousel;
