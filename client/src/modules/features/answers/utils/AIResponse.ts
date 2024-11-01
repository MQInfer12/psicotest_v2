import { OPENAI } from "@/modules/core/constants/ENVIRONMENT";
import { toastError } from "@/modules/core/utils/toasts";

export enum OpenAIModel {
  GPT_3_5 = "gpt-3.5-turbo",
  GPT_4_o = "gpt-4o",
}

export const getAIResponse = async (
  prompt: string,
  callback: (res: string) => void,
  options?: {
    model?: OpenAIModel;
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
              "Analizas test psicológicos y elaboras informes según la especificación del usuario, reemplazas los datos entre [] por texto generado y tomas los datos entre {} como instrucciones y especificaciones.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.6,
        max_tokens: 1800,
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
          const { delta } = choices[0];
          const { content } = delta;
          if (content) {
            callback(content);
          }
        }
      }
    }
  } catch (error) {
    toastError("Error al comunicarse con el servidor");
    console.error(error);
  } finally {
    options?.onFinally?.();
  }
};
