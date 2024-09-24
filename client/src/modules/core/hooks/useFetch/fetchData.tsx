import { useQuery } from "@tanstack/react-query";
import { ApiSuccessResponse } from "../../types/ApiResponse";
import { useUserContext } from "@/modules/features/auth/context/UserContext";
import { fetchOptions } from "./utils/fetchFn";
import { getSetData } from "./getSetData";

//* FETCHING IN COMPONENT RENDERING
export const fetchData = <K extends keyof EndpointMap>(
  endpointConfig: K | [K, EndpointMap[K]["params"]],
  config: RequestInit = {}
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

  const setData = getSetData(endpointConfig, !!returnValue.data);

  return {
    ...returnValue,
    res: returnValue.data,
    data: returnValue.data?.data,
    setData,
  };
};
