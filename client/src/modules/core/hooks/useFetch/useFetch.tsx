import { fetchData } from "./fetchData";
import { getSetData } from "./getSetData";
import { postData } from "./postData";

const useFetch = () => {
  const getDataSetter = <K extends keyof EndpointMap>(
    endpointConfig: K | [K, EndpointMap[K]["params"]],
    params?: Record<string, string>
  ) => getSetData(endpointConfig, true, params);

  return { getDataSetter, fetchData, postData };
};

export default useFetch;
