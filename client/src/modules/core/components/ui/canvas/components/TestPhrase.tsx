import { FRASES } from "@/modules/core/data";
import { useMemo } from "react";

function obtenerFraseAleatoria() {
  const indiceAleatorio = Math.floor(Math.random() * FRASES.length);
  return FRASES[indiceAleatorio];
}

const TestPhrase = () => {
  const frase = useMemo(() => obtenerFraseAleatoria(), []);

  return (
    <small className="text-alto-700 max-md:text-center max-md:flex max-md:flex-col max-md:gap-1">
      <span className="italic text-xs">"{frase.frase}"&nbsp;&nbsp;</span>
      <span className="text-[10px] text-primary-400 whitespace-nowrap">
        ({frase.autor})
      </span>
    </small>
  );
};

export default TestPhrase;
