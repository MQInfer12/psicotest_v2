import Button from "@/modules/core/components/ui/Button";
import { useState } from "react";
import { getAIResponse, OpenAIModel } from "../../utils/AIResponse";
import { useAnswerContext } from "../../context/AnswerContext";
import GPT from "@/assets/images/gpt.png";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";

const Interpretation = () => {
  const { test, data, resultados, interpretation, setInterpretation } =
    useAnswerContext();
  const [model, setModel] = useState<OpenAIModel>(OpenAIModel.GPT_3_5);
  const [loading, setLoading] = useState(false);
  const { postData, getDataSetter } = useFetch();
  const mutation = postData("PATCH /respuesta/patch/interpretation/:id");
  const setter = getDataSetter([
    "GET /test/by/respuesta/:id",
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

    prompt += `Necesito que me proporciones un análisis detallado pero de manera general del test que me proporcionó ${name}, para poder indicarle de manera correcta su situación y aconsejarle al respecto, no necesito que me parafrasees la descripción de las preguntas solamente necesito una inferencia de estas.`;

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
          if (interpretation !== null) {
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
      <div className="p-4 flex justify-between items-center gap-4 flex-wrap-reverse">
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
      <div className="flex-1 overflow-x-hidden overflow-y-scroll border-t border-alto-200/80 relative isolate">
        <div className="sticky h-0 w-full top-1/2 flex items-center justify-center -z-10 pointer-events-none overflow-visible">
          <img src={GPT} className="min-w-[540px] h-auto opacity-5" />
        </div>
        <p className="w-full whitespace-pre-line text-sm leading-loose p-4">
          {interpretation}
        </p>
      </div>
    </div>
  );
};

export default Interpretation;
