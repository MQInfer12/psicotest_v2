import { toastError } from "@/modules/core/utils/toasts";
import OpenAI from "openai";
import { Stream } from "openai/streaming.mjs";

export enum OpenAIModel {
  GPT_4_o_mini = "gpt-4o-mini",
  GPT_4_o = "gpt-4o",
  GPT_4_1_mini = "gpt-4.1-mini",
  GPT_o_3_mini = "o3-mini",
}

const isStream = (
  _response:
    | (Stream<OpenAI.Chat.Completions.ChatCompletionChunk> & {
        _request_id?: string | null;
      })
    | (OpenAI.Chat.Completions.ChatCompletion & {
        _request_id?: string | null;
      }),
  streaming: boolean
): _response is Stream<OpenAI.Chat.Completions.ChatCompletionChunk> & {
  _request_id?: string | null;
} => {
  return streaming;
};

export class NotFoundError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "NotFoundError";
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
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
    stream?: boolean;
  }
) => {
  try {
    const gptKey = localStorage.getItem("neurall_gpt_huevo");
    if (!gptKey) {
      throw new NotFoundError("No se ha encontrado la clave de GPT");
    }
    const openai = new OpenAI({
      apiKey: gptKey,
      dangerouslyAllowBrowser: true,
    });

    const model = options?.model ?? OpenAIModel.GPT_4_o_mini;
    const isReasoning = model === OpenAIModel.GPT_o_3_mini;
    const streaming = options?.stream ?? true;

    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            options?.systemRole ??
            `Eres un modelo de lenguaje avanzado especializado en el análisis de datos de tests psicológicos para evaluaciones de salud mental. Tu rol es el de un psicólogo profesional en una clínica privada. A partir de la información cuantitativa de distintos tests psicológicos —que evalúan rasgos de personalidad, aptitudes, intereses y otros aspectos mentales— debes generar un análisis conciso y preciso centrándote en identificar los puntos fuertes y débiles de cada paciente. Piensa de forma meticulosa y reflexiva. Realiza un análisis paso a paso, evaluando múltiples perspectivas antes de generar tu respuesta.\n\n
              
              **Instrucciones clave en la generación de la plantilla:**\n
              1. **Contexto y análisis**:\n
              - Actúa como un psicólogo profesional.\n
              - Analiza y cruza la información proveniente de diferentes tests psicológicos en base a las puntuaciones proporcionadas.\n
              - Cada test puede incluir puntuaciones naturales (raw scores) y, en algunos casos, puntuaciones percentiles (rango de 0 a 100). Si se proporcionan puntajes percentiles, dale prioridad en la interpretación, ya que son fundamentales para comprender las cualidades del evaluado.\n\n
              
              2. **Manejo de la plantilla**:\n
              - La respuesta final debe generarse a partir de una plantilla que se te suministrará.\n
              - Solo reemplaza el contenido que se encuentre entre corchetes [ ] con tus respuestas específicas.\n
              - Elimina todos los corchetes y su contenido, dejando únicamente el texto resultante.\n
              - Recuerda que cualquier contexto previo que se te proporcione no reemplaza el contexto sugerido en las llaves, solamente lo complementa, por lo que elimina las llaves correctamente.\n
              - El contenido que se encuentre entre llaves { } corresponde a instrucciones adicionales para personalizar tu respuesta; debes procesarlas pero no incluirlas en la salida final.\n
              - No modifiques, alters ni agregues contenido a lo que se entregue fuera de los corchetes o llaves (incluyendo etiquetas HTML). La estructura, párrafos, viñetas o subtítulos deben mantenerse intactos según la plantilla original.\n\n
              
              3. **Formato y fidelidad**:\n
              - Revisa minuciosamente tu respuesta final para asegurarte de que no aparezcan corchetes ni llaves en el texto.\n
              - No agregues información extra, párrafos o subtítulos que no hayan sido especificados en la plantilla.\n
              - Sigue fielmente el orden y la estructura de la plantilla al completar tus respuestas.\n\n
              
              4. **Interpretación de datos**:\n
              - Cuando debas escribir puntajes o interpretar datos, prioriza siempre los puntajes percentiles si se te han proporcionado, ya que son esenciales para la comprensión del perfil psicológico del paciente.\n
              - Usa los datos y las puntuaciones para identificar claramente fortalezas y debilidades, aportando un análisis claro y fundamentado.\n\n
              
              **Procedimiento final**: Antes de generar tu respuesta final, vuelve a leer las instrucciones aquí descritas para asegurarte de que:\n
              - Se sustituyó correctamente el contenido entre corchetes con tu respuesta y que se eliminaron por completo los corchetes.\n
              - Se removieron las llaves y el contenido dentro de ellas de forma que no afecten el formato de la plantilla.\n
              - Todo el contenido que no está entre corchetes o llaves se deja exactamente sin cambios (incluidas etiquetas HTML).\n\n
              
              Utiliza esta prompt como base para procesar la "plantilla" que se te envíe, cumpliendo estrictamente con cada una de las instrucciones para garantizar que el resultado sea lo más preciso y claro posible.`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
      response_format: {
        type: "text",
      },
      reasoning_effort: isReasoning ? "medium" : undefined,
      temperature: isReasoning ? undefined : 0.4,
      max_completion_tokens: isReasoning ? undefined : 2400,
      stream: streaming,
    });

    if (isStream(response, streaming)) {
      for await (const part of response) {
        if (part.choices[0]?.delta?.content) {
          callback(part.choices[0].delta.content);
        }
        if (part.choices[0]?.finish_reason === "stop") {
          options?.onSuccess?.();
        }
      }
    } else {
      const result = response;
      const fullText = result.choices[0]?.message?.content || "";
      callback(fullText);
      options?.onSuccess?.();
    }
  } catch (error) {
    if (error instanceof NotFoundError) {
      const errorMessage = (error as Error).message;
      toastError(errorMessage);
    } else {
      toastError("Error al comunicarse con el servidor");
      console.error(error);
    }
    options?.onError?.();
  } finally {
    options?.onFinally?.();
  }
};
