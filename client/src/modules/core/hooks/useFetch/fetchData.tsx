import { useQuery } from "@tanstack/react-query";
import { ApiSuccessResponse } from "../../types/ApiResponse";
import { useUserContext } from "@/modules/features/auth/context/UserContext";
import { fetchOptions } from "./utils/fetchFn";
import { getSetData } from "./getSetData";
import { RequestInitWithParams } from "./utils/buildUrl";

//* FETCHING IN COMPONENT RENDERING
export const fetchData = <K extends keyof EndpointMap>(
  endpointConfig: K | [K, EndpointMap[K]["params"]],
  config: RequestInitWithParams = {}
) => {
  type TResponse = EndpointMap[K]["response"];
  const { logout } = useUserContext();

  const returnValue = useQuery<ApiSuccessResponse<TResponse>>(
    fetchOptions(endpointConfig, {
      onUnauthorized: () => {
        logout();
      },
      config,
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
