import Button from "@/modules/core/components/ui/Button";
import { useState } from "react";
import { getAIResponse, OpenAIModel } from "../../utils/AIResponse";
import { useAnswerContext } from "../../context/AnswerContext";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import GptCanvas from "../interpretation/GptCanvas";

const Interpretation = () => {
  const { test, data, resultados, interpretation, setInterpretation } =
    useAnswerContext();
  const [model, setModel] = useState<OpenAIModel>(OpenAIModel.GPT_3_5);
  const [loading, setLoading] = useState(false);
  const { postData, getDataSetter } = useFetch();
  const mutation = postData("PATCH /respuesta/patch/interpretation/:id");
  const setter = getDataSetter([
    "GET /test/for/respuesta/:id",
    {
      id: data.id_respuesta,
    },
  ]);

  const handleInterpretation = () => {
    const rawName = data.user.nombre.split(" ")[0].toLocaleLowerCase();
    const [firstLetter, ...letters] = rawName;
    const name = firstLetter.toLocaleUpperCase() + letters.join("");

    let prompt =
      "Soy un psicólogo profesional que trabaja con pacientes en una clínica privada. Mi objetivo es evaluar y comprender la salud mental de mis pacientes mediante la aplicación de diversos tests psicológicos.\n";
    prompt += `Hoy necesito analizar los datos de mi paciente ${name} en distintos tests psicológicos y cruzar información de estos\n`;

    prompt += `Proporciono las preguntas del test ${data.nombre_test} junto con las respuestas de ${name} para que realices el análisis correspondiente:\n`;
    test.secciones[0].items.forEach((item, index) => {
      const resultado = resultados.find(
        (resultado) => resultado.idPregunta === item.id
      );
      const opcion = test.secciones[0].opciones.find(
        (opcion) => opcion.id === resultado?.idOpcion
      );
      prompt += `Pregunta ${index + 1}: ${item.descripcion}\n`;
      prompt += `Respuesta de ${name}: ${opcion?.descripcion ?? "NO RESPONDIÓ"}\n`;
    });

    prompt += `Proporciono las preguntas del test PMA junto con las respuestas de ${name} para que realices el análisis correspondiente:\n`;
    test.secciones[0].items.forEach((item, index) => {
      const resultado = resultados.find(
        (resultado) => resultado.idPregunta === item.id
      );
      const opcion = test.secciones[0].opciones.find(
        (opcion) => opcion.id === resultado?.idOpcion
      );
      prompt += `Pregunta ${index + 1}: ${item.descripcion}\n`;
      prompt += `Respuesta de ${name}: ${opcion?.descripcion ?? "NO RESPONDIÓ"}\n`;
    });

    prompt +=
      "Necesito que generes una respuesta basada en el siguiente formato que te voy a proporcionar, solo escribe tus respuestas donde el texto esté encerrado entre corchetes [], le quitas los corchetes para escribir tu respuesta:\n";

    prompt += "<strong>RESULTADOS</strong>\n";
    prompt += "Intereses vocacionales (Resultados del test de kuder)\n";
    prompt +=
      "Áreas de intereses predominantes: [Descripción de las áreas más destacadas según los resultados del test de Kuder.]\n";
    prompt +=
      "Ranking de intereses: [Resumen del ranking de intereses, indicando las tres principales áreas.]\n";

    prompt += "Motivación Académica (Resultados del PMA)\n";
    prompt +=
      "Niveles de motivación: [Descripción de los niveles de motivación identificados, destacando las áreas de alta motivación y aquellas que requieren atención.]\n";
    prompt +=
      "Áreas de interés y compromiso: [Resumen de las áreas en las que el estudiante se muestra más comprometido y motivado.]\n";

    prompt += "Habilidades y Fortalezas\n";
    prompt +=
      "Habilidades identificadas: [Lista de habilidades destacadas en relación con los intereses del test de Kuder, la PMA y el MAPI.]\n";
    prompt +=
      "Fortalezas personales: [Breve descripción de las cualidades que destacan en el estudiante.]\n";

    prompt += "Áreas de mejora\n";
    prompt +=
      "[Descripción de áreas donde el estudiante podría beneficiarse de desarrollo adicional.]\n";

    prompt += "<strong>Recomendaciones Vocacionales</strong>\n";
    prompt +=
      "[Descripción breve de la opción, incluyendo posibles carreras y ámbitos laborales, intenta enfocar tu respuesta en carreras que tiene la Unifranz: Ingeniería en sistemas, psicólogia, derecho, ingenieria económica y financiera, ingenieria comercial, administración de empresas, medicina, bioquimica y farmacia, diseño gráfico, publicidad y marketing.]\n";

    prompt += "<strong>Conclusiones</strong>\n";
    prompt += `[Una conclusión acerca de los datos extraídos de los tests resueltos de ${name}]\n`;

    console.log(prompt);

    /* let prompt =
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
      prompt += `Respuesta de ${name}: ${opcion?.descripcion ?? "NO RESPONDIÓ"}\n`;
    });

    prompt += `Necesito que me proporciones un análisis detallado pero de manera general del test que me proporcionó ${name}, para poder indicarle de manera correcta su situación y aconsejarle al respecto, no necesito que me parafrasees la descripción de las preguntas solamente necesito una inferencia de estas.`; */

    let newInterpretation = "";
    setInterpretation(null);
    setLoading(true);
    getAIResponse(
      prompt,
      (content) => {
        newInterpretation += content;
        setInterpretation(newInterpretation);
      },
      {
        model,
        onFinally: () => {
          if (interpretation !== "") {
            mutation(
              {
                interpretacion: newInterpretation,
              },
              {
                params: {
                  id: data.id_respuesta,
                },
                onSuccess: (res) => {
                  setter(res.data);
                },
              }
            );
          }
          setLoading(false);
        },
      }
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-4 flex justify-between items-center gap-4 flex-wrap-reverse border-b border-alto-200/80">
        <div className="flex-1 flex justify-center">
          <Button disabled={loading} onClick={handleInterpretation}>
            Generar interpretación
          </Button>
        </div>
        <div className="flex-[9999_1_0] flex justify-end gap-2">
          {Object.values(OpenAIModel).map((m) => (
            <Button
              key={m}
              btnSize="small"
              btnType={model === m ? "primary" : "secondary"}
              onClick={() => setModel(m)}
            >
              {m}
            </Button>
          ))}
        </div>
      </div>
      <GptCanvas content={interpretation ?? ""} />
    </div>
  );
};

export default Interpretation;
