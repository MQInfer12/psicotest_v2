import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { API_URL } from "../constants/ENVIRONMENT";
import { ApiErrorResponse, ApiSuccessResponse } from "../types/ApiResponse";
import { toastError } from "@/utils/toasts";
import { TOKEN_NAME } from "@/constants/CONSTANTS";

const handleResponse = async <T,>(response: Response): Promise<T> => {
  if (!response.ok) {
    let msg = "Error del servidor";
    if (response.status === 401) {
      localStorage.removeItem(TOKEN_NAME);
    }
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
    const queryClient = useQueryClient();

    const returnValue = useQuery<ApiSuccessResponse<TResponse>>({
      queryKey: key,
      queryFn: async () => {
        const token = localStorage.getItem(TOKEN_NAME);
        const response = await fetch(API_URL + endpoint, {
          ...config,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...config.headers,
          },
        });
        return handleResponse<ApiSuccessResponse<TResponse>>(response);
      },
      retry: false,
    });

    const setData = (setter: (prev: TResponse) => TResponse) => {
      if (!returnValue.data) return;
      queryClient.setQueryData(key, (old: ApiSuccessResponse<TResponse>) => ({
        ...old,
        data: setter(old.data),
      }));
    };

    return {
      ...returnValue,
      res: returnValue.data,
      data: returnValue.data?.data,
      setData,
    };
  };

  const postData = <TResponse, TBody>(
    endpoint: string,
    config: RequestInit = {}
  ) => {
    return useMutation<ApiSuccessResponse<TResponse>, Error, TBody>({
      mutationFn: async (payload: TBody) => {
        const token = localStorage.getItem(TOKEN_NAME);
        const response = await fetch(API_URL + endpoint, {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
