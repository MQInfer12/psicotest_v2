import { MutateOptions, useMutation } from "@tanstack/react-query";
import { ApiSuccessResponse } from "../../types/ApiResponse";
import { HttpMethod } from "../../types/HttpMethod";
import { API_URL } from "../../constants/ENVIRONMENT";
import { useUserContext } from "@/modules/features/auth/context/UserContext";
import { toastError } from "../../utils/toasts";
import { buildUrl, RequestInitWithParams } from "./utils/buildUrl";
import { BuildedError, handleResponse } from "./utils/handleResponse";
import { getTokens } from "@/modules/features/auth/utils/localStorageToken";
import { AUTHORIZATION_HEADER } from "../../constants/HEADERS";

//* FETCHING IN CODE
export const postData = <K extends keyof EndpointMap>(
  endpointConfig: K,
  config: RequestInitWithParams = {}
) => {
  type TResponse = EndpointMap[K]["response"];
  type TBody = EndpointMap[K]["request"];
  type TParams = EndpointMap[K]["params"];
  const paramsLocalStorageKey = "useFetchRequestParams";

  const endpoint: string = Array.isArray(endpointConfig)
    ? endpointConfig[0]
    : endpointConfig;
  const [method] = endpoint.split(" ") as [HttpMethod, string];

  const { logout } = useUserContext();

  const mutation = useMutation<ApiSuccessResponse<TResponse>, Error, TBody>({
    mutationFn: async (payload: TBody) => {
      const parameters = JSON.parse(
        sessionStorage.getItem(paramsLocalStorageKey) || "{}"
      );
      const urlBuild = buildUrl(endpoint, parameters, config.params);
      sessionStorage.removeItem(paramsLocalStorageKey);

      const tokens = getTokens();
      const response = await fetch(API_URL + urlBuild, {
        method: method,
        body:
          method === "GET" || method === "DELETE"
            ? undefined
            : JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          [AUTHORIZATION_HEADER]: `Bearer ${tokens?.token}`,
          ...config.headers,
        },
        ...config,
      });
      return handleResponse<ApiSuccessResponse<TResponse>>(response, () => {
        logout();
      });
    },
    onError: (error: Error) => {
      const buildedError: BuildedError = JSON.parse(error.message);
      console.log(buildedError.message);
      toastError(buildedError.message);
    },
  });

  interface CustomMutationOptions<T1, T2, T3, T4>
    extends MutateOptions<T1, T2, T3, T4> {
    params?: TParams extends never ? void : TParams;
  }

  const customMutation = (
    variables: TBody,
    options?: CustomMutationOptions<
      ApiSuccessResponse<TResponse>,
      Error,
      TBody,
      unknown
    >
  ) => {
    if (options?.params) {
      sessionStorage.setItem(
        paramsLocalStorageKey,
        JSON.stringify(options.params)
      );
    }
    mutation.mutate(variables, options);
  };

  return customMutation;
};
