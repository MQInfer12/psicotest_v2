import { useMeasureContext } from "@/modules/features/_layout/context/MeasureContext";
import { TestType } from "@/modules/features/tests/types/TestType";
import { AnimatePresence } from "framer-motion";
import React from "react";

interface Props {
  children: React.ReactNode;
  test: TestType;
}

const TestCarousel = ({ test, children }: Props) => {
  const { size } = useMeasureContext();

  const maxOpciones = test.secciones.reduce(
    (maximo, seccion) =>
      seccion.opciones.length > maximo ? seccion.opciones.length : maximo,
    0
  );

  let height = size !== "normal" && size !== "xl" ? 32 : 80; //py-10
  height += size !== "normal" && size !== "xl" ? 40 : 44; //h4
  height += 24; //gap-3 x2
  height += (size !== "normal" && size !== "xl" ? 20 : 28) * 5 + 20; //p
  height += 8; //opciones pt-2
  height += (maxOpciones - 1) * 16; //gap-4 entre opciones
  height += maxOpciones * 40; //cada opcion 40
  height -= -2; //!DIOSITO SABE POR QUE TUVE QUE AUMENTARLE UNO MÁS

  return (
    <div
      style={{
        height,
      }}
      className="w-full bg-alto-100 border border-alto-200 rounded-lg flex relative overflow-hidden"
    >
      <AnimatePresence initial={false}>{children}</AnimatePresence>
    </div>
  );
};

export default TestCarousel;
