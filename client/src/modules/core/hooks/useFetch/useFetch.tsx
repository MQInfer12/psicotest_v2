import fetchData from "./fetchData";
import { postData } from "./postData";

const useFetch = () => {
  return { fetchData, postData };
};

export default useFetch;
