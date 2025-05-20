import { toastError } from "@/modules/core/utils/toasts";
import OpenAI from "openai";
import { Stream } from "openai/streaming.mjs";
import AIRole from "@/assets/prompts/AIRole.txt?raw";

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
          content: options?.systemRole ?? AIRole,
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
