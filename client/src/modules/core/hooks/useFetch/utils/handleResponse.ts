import { ApiErrorResponse } from "@/modules/core/types/ApiResponse";

export interface BuildedError {
  status: number;
  message: string;
}

//* FETCH ERROR HANDLER
export const handleResponse = async <T>(
  response: Response,
  onUnauthorized: () => void
): Promise<T> => {
  if (!response.ok) {
    let msg = "Error del servidor";
    if (response.status === 401) {
      onUnauthorized();
    }
    if (response.status !== 500) {
      const error = (await response.json()) as ApiErrorResponse;
      msg = error.message;
    }
    const buildedError = {
      status: response.status,
      message: `${response.status}: ` + msg || "Algo salió mal",
    };
    throw new Error(JSON.stringify(buildedError));
  }
  return response.json();
};
