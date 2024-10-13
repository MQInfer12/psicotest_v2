import { ApiSuccessResponse } from "@/modules/core/types/ApiResponse";
import { buildUrl, RequestInitWithParams } from "./buildUrl";
import { API_URL } from "@/modules/core/constants/ENVIRONMENT";
import { TOKEN_NAME } from "@/modules/core/constants/CONSTANTS";
import { handleResponse } from "./handleResponse";
import { QueryOptions, queryOptions } from "@tanstack/react-query";
import { getUrlData } from "./getUrlData";

//* FETCH DATA FN
const fetchFn = async <K extends keyof EndpointMap>(
  endpointConfig: K | [K, EndpointMap[K]["params"]],
  onUnauthorized: () => void = () => {},
  config: RequestInitWithParams = {}
) => {
  type TResponse = EndpointMap[K]["response"];

  const { endpoint, params } = getUrlData(endpointConfig, config);
  const urlBuild = buildUrl(endpoint, params, config.params);

  //? FETCHING
  const token = localStorage.getItem(TOKEN_NAME);
  const response = await fetch(API_URL + urlBuild, {
    ...config,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...config.headers,
    },
  });

  return handleResponse<ApiSuccessResponse<TResponse>>(
    response,
    onUnauthorized
  );
};

export const fetchOptions = <K extends keyof EndpointMap>(
  endpointConfig: K | [K, EndpointMap[K]["params"]],
  options: {
    onUnauthorized?: () => void;
    config?: RequestInitWithParams;
  } = {},
  qOptions?: QueryOptions<any>
) => {
  const { queryKey } = getUrlData(endpointConfig, options.config);
  return queryOptions({
    queryKey,
    queryFn: async () =>
      await fetchFn(endpointConfig, options.onUnauthorized, options.config),
    retry: false,
    ...qOptions,
  });
};
