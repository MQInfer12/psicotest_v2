import { toastError } from "@/modules/core/utils/toasts";

export enum OpenAIModel {
  GPT_4_o_mini = "gpt-4o-mini",
  GPT_4_o = "gpt-4o",
  GPT_o_3_mini = "o3-mini",
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
    const response = await fetch("http://localhost:8000/api/openai-stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: options?.model,
        role: options?.systemRole,
        prompt,
      }),
    });

    if (!response.ok || !response.body) {
      throw new Error("Error al comunicarse con el servidor");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let done = false;
    let fullText = "";
    let buffer = "";

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;

      const chunk = decoder.decode(value || new Uint8Array(), { stream: true });
      buffer += chunk;

      const lines = buffer.split("\n");

      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;

        const jsonStr = trimmed.replace("data: ", "");

        try {
          const json = JSON.parse(jsonStr);
          const content = json.choices?.[0]?.delta?.content;
          if (content) {
            fullText += content;
            callback(content);
          }
        } catch (e) {}

        if (jsonStr === "[DONE]") {
          done = true;
          break;
        }
      }
    }

    options?.onSuccess?.();
  } catch (error) {
    toastError((error as Error).message);
    options?.onError?.();
  } finally {
    options?.onFinally?.();
  }
};
