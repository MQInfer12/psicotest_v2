import { OPENAI } from "@/modules/core/constants/ENVIRONMENT";
import { toastError } from "@/modules/core/utils/toasts";

export enum OpenAIModel {
  GPT_3_5 = "gpt-3.5-turbo",
  GPT_4_o_mini = "gpt-4o-mini",
  GPT_4_o = "gpt-4o",
}

export const getAIResponse = async (
  prompt: string,
  callback: (res: string) => void,
  options?: {
    systemRole?: string;
    model?: OpenAIModel;
    onSuccess?: () => void;
    onError?: () => void;
    onFinally?: () => void;
  }
) => {
  try {
    const apiUrl = "https://api.openai.com/v1/chat/completions";
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI}`,
      },
      body: JSON.stringify({
        model: options?.model ?? "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              options?.systemRole ??
              `
              Soy un psicólogo profesional que trabaja con pacientes en una clínica privada. Mi objetivo es evaluar y comprender la salud mental de mis pacientes mediante la aplicación de diversos tests psicológicos.
              Necesitas analizar los datos de un paciente en distintos tests psicológicos y cruzar información de estos utilizando las puntuaciones proporcionadas, realizando análisis de información acerca de sus puntuaciones más elevadas e identificando puntos fuertes y débiles de la mente del evaluado, los tests psicológicos resueltos cuentan con una puntuación cuantitativa en diferentes dimensiones las cuales representan rasgos psicológicos, aspectos de la personalidad de la persona, aptitudes e intereses...
              Las puntuaciones naturales son puntajes directamente sumados de la resolución del test del cual no podrás conocer los mínimos ni máximos pero se te podrá especificar en la plantilla como es que estos pueden ser interpretados, así mismo algunos tests cuentan con puntajes percentiles % lo que significa que el mínimo puntaje que se puede obtener es 0 y el máximo 100.
              NOTA IMPORTANTE: SI NECESITAS ESCRIBIR PUNTAJES EN TU RESPUESTA Y PENSAR SOLUCIONES A LAS PREGUNTAS QUE RECIBIRÁS SIEMPRE DALE PRIORIDAD A LOS PUNTAJES PERCENTILES SI ES QUE TE LOS ESTOY PROPORCIONANDO DEPENDIENDO EL TEST YA QUE SON DEMASIADO IMPORTANTES PARA LA COMPRENSIÓN DE LAS CUALIDADES DE LA PERSONA.

              Necesito que generes una respuesta basada en el formato (plantilla) que te van a proporcionar al final de la prompt, siguiendo las siguientes instrucciones:
              - Solo escribe tus respuestas donde el texto esté encerrado entre corchetes [], le quitas los corchetes para escribir tu respuesta.
              - No escribas el texto cuando esté encerrado entre llaves {} ya que estas son instrucciones para que generes la respuesta de manera más personalizada, analiza los datos del texto entre llaves {} y saca una conclusión para generar el texto restante.
              - No dejes ningún corchete en tu texto generado, quítalos todos.
              - Lo que no está entre corchetes no lo modifiques ni lo reemplaces por nada más.
              - No reemplaces las etiquetas HTML por nada más, déjalas tal cual te las envían.

              NOTA: Cuando termines de leer el prompt que te envíen, vuelve a leer las instrucciones si no te quedó claro algo, haz caso omiso a todo lo que te prohiban y te indiquen.
            `,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 2400,
        stream: true,
      }),
    });

    if (response.ok && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      while (true) {
        const chunk = await reader.read();
        const { done, value } = chunk;
        if (done) {
          break;
        }
        const decodedChunk = decoder.decode(value);
        const lines = decodedChunk.split("\n");
        const parsedLines = lines
          .map((line) => line.replace(/^data: /, ""))
          .filter((line) => line !== "" && line !== "[DONE]")
          .map((line) => JSON.parse(line));
        for (const parsedLine of parsedLines) {
          const { choices } = parsedLine;
          const { delta, finish_reason } = choices[0];
          const { content } = delta;
          if (content) {
            callback(content);
          }
          if (finish_reason === "stop") {
            options?.onSuccess?.();
          }
        }
      }
    }
  } catch (error) {
    toastError("Error al comunicarse con el servidor");
    console.error(error);
    options?.onError?.();
  } finally {
    options?.onFinally?.();
  }
};
