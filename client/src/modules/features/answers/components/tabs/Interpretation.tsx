import Button from "@/modules/core/components/ui/Button";
import { useState } from "react";
import { getAIResponse } from "../../utils/AIResponse";
import { useAnswerContext } from "../../context/AnswerContext";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import GptCanvas from "../interpretation/GptCanvas";
import { cleanOptionTags } from "@/modules/core/components/ui/canvas/utils/dynamicOptions";
import { measureAge } from "@/modules/core/utils/measureAge";

const Interpretation = () => {
  const { test, data, resultados, interpretation, setInterpretation } =
    useAnswerContext();
  const [loading, setLoading] = useState(false);
  const { postData, getDataSetter } = useFetch();
  const configMutation = postData("GET /configuracion");
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
    prompt += `Hoy necesito analizar los datos de mi paciente ${name} en un test psicológico y sacar conclusiones acerca de sus respuestas en este.\n`;

    prompt +=
      "Evita hacer las siguientes cosas: contar y decir cuantas preguntas respondió correctamente o erradamente, solamente hacer un análisis empírico de sus respuestas.\n";

    prompt += "Sin más dilación continúo con el test:\n";
    prompt += `Proporciono las preguntas del test ${data.nombre_test} junto con las respuestas de ${name} para que realices el análisis correspondiente:\n`;
    test.secciones.forEach((seccion, j) => {
      if (seccion.description) {
        prompt += `Instrucciones que se le dieron a ${name} para la sección ${j + 1} del test:\n`;
        seccion.description.forEach((d) => {
          prompt += `${d.type === "title" ? "\n" : ""}${d.content}\n`;
        });
        prompt += "\n";
      } else {
        prompt += `Sección ${j + 1} del test, se le puso las preguntas a ${name} sin ningún tipo de instrucción:\n\n`;
      }
      seccion.items.forEach((item, k) => {
        const resultado = resultados.find(
          (resultado) => resultado.idPregunta === item.id
        );
        const opcion = test.secciones[0].opciones.find(
          (opcion) => opcion.id === resultado?.idOpcion
        );
        prompt += `Pregunta ${k + 1}: ${cleanOptionTags(item.descripcion)}\n`;
        prompt += `Respuesta de ${name}: ${opcion?.descripcion ?? "[no respondió]"}\n`;
      });
      prompt += "\n";
    });

    let newInterpretation = "";
    setInterpretation(null);
    setLoading(true);

    configMutation(null, {
      onSuccess: ({ data: config }) => {
        getAIResponse(
          prompt,
          (content) => {
            newInterpretation += content;
            setInterpretation(newInterpretation);
          },
          {
            model: config.gpt_model,
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
      },
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-4 flex justify-between items-center gap-4 flex-wrap-reverse border-b border-alto-300/70 dark:border-alto-900">
        <Button disabled={loading} onClick={handleInterpretation}>
          Generar interpretación
        </Button>
        {/* <div className="flex-[9999_1_0] flex justify-end gap-2">
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
        </div> */}
      </div>
      <GptCanvas
        content={interpretation ?? ""}
        loaded={!loading}
        data={{
          name: data.user.nombre,
          age:
            data.user.fecha_nacimiento && data.fecha_enviado
              ? String(
                  measureAge(data.user.fecha_nacimiento, data.fecha_enviado)
                )
              : "No especificado",
          group: data.nombre_carpeta || "Sin clasificación",
        }}
      />
    </div>
  );
};

export default Interpretation;
