import Button from "@/modules/core/components/ui/Button";
import { useState } from "react";
import { getAIResponse } from "../../utils/AIResponse";
import { useAnswerContext } from "../../context/AnswerContext";

const Interpretation = () => {
  const { test, data, resultados } = useAnswerContext();
  const [interpretation, setInterpretation] = useState("");

  const handleInterpretation = () => {
    const rawName = data.user.nombre.split(" ")[0].toLocaleLowerCase();
    const [firstLetter, ...letters] = rawName;
    const name = firstLetter.toLocaleUpperCase() + letters.join("");

    let prompt =
      "Soy un psicólogo profesional que trabaja con pacientes en una clínica privada. Mi objetivo es evaluar y comprender la salud mental de mis pacientes mediante la aplicación de diversos tests psicológicos.\n";
    prompt += `Hoy necesito analizar el test psicológico ${data.nombre_test} con mi paciente, ${name}. ${data.nombre_autor ? `Este test fue desarrollado por el psicólogo ${data.nombre_autor_creador} y ` : ""}se utiliza para evaluar dimensiones de la personalidad de quienes lo resuelven.\n`;
    prompt += `Proporciono las preguntas del test junto con las respuestas de ${name} para que realices el análisis correspondiente:\n`;

    test.secciones[0].items.forEach((item, index) => {
      const resultado = resultados.find(
        (resultado) => resultado.idPregunta === item.id
      );
      const opcion = test.secciones[0].opciones.find(
        (opcion) => opcion.id === resultado?.idOpcion
      );
      prompt += `Pregunta ${index + 1}: ${item.descripcion}\n`;
      prompt += `Respuesta de ${name}: ${opcion?.descripcion ?? "NO TERMINÓ DE RESPONDER"}\n`;
    });

    prompt += `Necesito que me proporciones un análisis detallado pero de manera general del test que me proporcionó ${name}, para poder indicarle de manera correcta su situación y aconsejarle al respecto, no necesito que me parafrasees la descripción de las preguntas solamente necesito una inferencia de estas.`;
    /* const prompt =
      "Eres el asistente virtual de la Unifranz, te encargas de responder consultas de los usuarios que vengan dudosos de algún tema en específico acerca de la universidad." +
      "Las carreras disponibles actualmente en la universidad son las de: Ingeniería de sistemas, Arquitectura, Diseño gráfico y producción crossmedia, Publicidad y marketing, " +
      "Derecho, Periodismo, Psicología, Enfermería, Bioquímica y farmacia, Odontología, Medicina, Administración de empresas, Administración de hotelería y turismo, Contaduría pública, " +
      "Ingeniería comercial, Ingeniería económica y financiera, si el usuario te pregunta acerca de dónde encontrar más información le ofreces esta url 'https://unifranz.edu.bo/facultades/'. " +
      "Abstente de ayudar en otro tipo de temas que no sean de tu área de conocimiento."; */

    setInterpretation("");
    getAIResponse(prompt, (content) =>
      setInterpretation((prev) => prev + content)
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Button onClick={handleInterpretation}>Generar interpretación</Button>
      <div className="flex-1 overflow-auto">
        <p className="w-full whitespace-pre-line text-sm">{interpretation}</p>
      </div>
    </div>
  );
};

export default Interpretation;
