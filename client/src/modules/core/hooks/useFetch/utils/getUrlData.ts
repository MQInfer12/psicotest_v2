import { QueryKey } from "@tanstack/react-query";

export const getUrlData = <K extends keyof EndpointMap>(
  endpointConfig: K | [K, EndpointMap[K]["params"]]
) => {
  const endpoint: string = Array.isArray(endpointConfig)
    ? endpointConfig[0]
    : endpointConfig;
  const params = Array.isArray(endpointConfig) ? endpointConfig[1] : undefined;
  const queryKey: QueryKey = params
    ? [endpoint, ...Object.values(params)]
    : [endpoint];
  return { endpoint, params, queryKey };
};
