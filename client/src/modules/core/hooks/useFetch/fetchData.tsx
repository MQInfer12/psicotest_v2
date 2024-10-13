import { QueryOptions, useQuery } from "@tanstack/react-query";
import { ApiSuccessResponse } from "../../types/ApiResponse";
import { useUserContext } from "@/modules/features/auth/context/UserContext";
import { getSetData } from "./getSetData";
import { fetchOptions } from "./utils/fetchFn";

interface FetchDataOptions {
  params?: Record<string, string>;
  fetchOptions?: RequestInit;
  queryOptions?: QueryOptions<unknown>;
}

//* FETCHING IN COMPONENT RENDERING
export const fetchData = <K extends keyof EndpointMap>(
  endpointConfig: K | [K, EndpointMap[K]["params"]],
  config: FetchDataOptions = {}
) => {
  type TResponse = EndpointMap[K]["response"];
  const { logout } = useUserContext();
  const fetchOpt = config.fetchOptions ?? {};

  const returnValue = useQuery<ApiSuccessResponse<TResponse>>(
    fetchOptions(endpointConfig, {
      onUnauthorized: () => {
        logout();
      },
      config: { ...fetchOpt, params: config.params },
    })
  );

  const setData = getSetData(endpointConfig, !!returnValue.data, config.params);

  return {
    ...returnValue,
    res: returnValue.data,
    data: returnValue.data?.data,
    setData,
  };
};
