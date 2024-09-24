import { fetchData } from "./fetchData";
import { getSetData } from "./getSetData";
import { postData } from "./postData";

const useFetch = () => {
  const getDataSetter = <K extends keyof EndpointMap>(
    endpointConfig: K | [K, EndpointMap[K]["params"]]
  ) => getSetData(endpointConfig, true);

  return { getDataSetter, fetchData, postData };
};

export default useFetch;
