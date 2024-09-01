import { QueryKey, useMutation, useQuery } from "@tanstack/react-query";
import { API_URL } from "../constants/ENVIRONMENT";
import { ApiErrorResponse, ApiSuccessResponse } from "../types/ApiResponse";
import { toastError } from "@/utils/toasts";

const handleResponse = async <T,>(response: Response): Promise<T> => {
  if (!response.ok) {
    let msg = "Error del servidor";
    if (response.status !== 500) {
      const error = (await response.json()) as ApiErrorResponse;
      msg = error.message;
    }
    throw new Error(`${response.status}: ` + msg || "Algo salió mal");
  }
  return response.json();
};

const useFetch = () => {
  const fetchData = <TResponse,>(
    key: QueryKey,
    endpoint: string,
    config: RequestInit = {}
  ) => {
    return useQuery<ApiSuccessResponse<TResponse>>({
      queryKey: key,
      queryFn: async () => {
        const response = await fetch(API_URL + endpoint, {
          ...config,
          headers: {
            "Content-Type": "application/json",
            ...config.headers,
          },
        });
        return handleResponse<ApiSuccessResponse<TResponse>>(response);
      },
    });
  };

  const postData = <TResponse, TBody>(
    endpoint: string,
    config: RequestInit = {}
  ) => {
    return useMutation<ApiSuccessResponse<TResponse>, Error, TBody>({
      mutationFn: async (payload: TBody) => {
        const response = await fetch(API_URL + endpoint, {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
            ...config.headers,
          },
          ...config,
        });
        return handleResponse<ApiSuccessResponse<TResponse>>(response);
      },
      onError: (error: Error) => {
        console.error(error.message);
        toastError(error.message);
      },
    });
  };

  return { fetchData, postData };
};

export default useFetch;
