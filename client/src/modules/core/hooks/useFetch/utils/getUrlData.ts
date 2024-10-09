import { QueryKey } from "@tanstack/react-query";
import { RequestInitWithParams } from "./buildUrl";

export const getUrlData = <K extends keyof EndpointMap>(
  endpointConfig: K | [K, EndpointMap[K]["params"]],
  config?: RequestInitWithParams
) => {
  const endpoint: string = Array.isArray(endpointConfig)
    ? endpointConfig[0]
    : endpointConfig;
  const params = Array.isArray(endpointConfig) ? endpointConfig[1] : undefined;

  const queryKeys = [endpoint];

  const routeParams: Record<string, any> | undefined = params;
  if (routeParams) {
    queryKeys.push(
      ...Object.keys(routeParams).map((key) => `${key}:${routeParams[key]}`)
    );
  }
  const urlParams = config?.params;
  if (urlParams) {
    queryKeys.push(
      ...Object.keys(urlParams).map((key) => `${key}=${urlParams[key]}`)
    );
  }

  const queryKey: QueryKey = [...queryKeys];

  return { endpoint, params, queryKey };
};
