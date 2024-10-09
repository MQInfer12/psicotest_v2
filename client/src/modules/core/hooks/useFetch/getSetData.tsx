import { useQueryClient } from "@tanstack/react-query";
import { getUrlData } from "./utils/getUrlData";
import { ApiSuccessResponse } from "../../types/ApiResponse";

export type SetData<T> = (setter: T | ((prev: T) => T)) => void;

export const getSetData = <K extends keyof EndpointMap>(
  endpointConfig: K | [K, EndpointMap[K]["params"]],
  existData: boolean,
  params?: Record<string, string>
) => {
  type TResponse = EndpointMap[K]["response"];
  const queryClient = useQueryClient();
  const { queryKey } = getUrlData(endpointConfig, {
    params,
  });
  const setData: SetData<TResponse> = (setter) => {
    if (!existData) return;
    queryClient.setQueryData(
      queryKey,
      (old: ApiSuccessResponse<TResponse>) => ({
        ...old,
        data:
          typeof setter === "function" ? setter(old.data as TResponse) : setter,
      })
    );
  };

  return setData;
};
