import GptCanvas from "./interpretation/GptCanvas";
import { useAnswersHeaderContext } from "../context/AnswersHeaderContext";
import { useEffect } from "react";

const AnswersInterpretation = () => {
  const { selectedTests } = useAnswersHeaderContext();
  /* const [interpretation, setInterpretation] = useState(""); */

  useEffect(() => {
    if (!selectedTests) return;
    const rawName = selectedTests.user.nombre.split(" ")[0].toLocaleLowerCase();
    const [firstLetter, ...letters] = rawName;
    const name = firstLetter.toLocaleUpperCase() + letters.join("");

    let prompt =
      "Soy un psicólogo profesional que trabaja con pacientes en una clínica privada. Mi objetivo es evaluar y comprender la salud mental de mis pacientes mediante la aplicación de diversos tests psicológicos.\n";
    prompt += `Hoy necesito analizar los datos de mi paciente ${name} en distintos tests psicológicos y cruzar información de estos\n`;
  }, []);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex items-center h-10 bg-primary-100 border-b border-alto-200/80">
        <small className="text-[10px] font-semibold px-5 [&>span]:text-primary-700">
          Generando respuesta para <span>{selectedTests?.user.nombre}</span>{" "}
          según {selectedTests?.selecteds.length === 1 ? "el " : "los "}
          test{selectedTests?.selecteds.length === 1 ? ": " : "s: "}
          {selectedTests?.selecteds.map((s, i) => (
            <>
              <span>{s.nombre_test}</span>{" "}
              {i !== selectedTests?.selecteds.length - 1 ? " / " : ""}
            </>
          ))}
        </small>
      </div>
      <GptCanvas content="" />
    </div>
  );
};

export default AnswersInterpretation;
