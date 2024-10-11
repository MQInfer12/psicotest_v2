export interface RequestInitWithParams extends RequestInit {
  params?: Record<string, string>;
}

//* BUILD URL WITH PARAMS
export const buildUrl = (
  endpoint: string,
  params?: Record<string, any>,
  urlParams?: Record<string, string>
): string => {
  let url = endpoint.split(" ")[1];
  if (params) {
    Object.keys(params).forEach((key) => {
      url = url.replace(`:${key}`, params[key as keyof typeof params]);
    });
  }
  if (urlParams) {
    const arr: string[] = [];
    Object.keys(urlParams).forEach((key) => {
      arr.push(`${key}=${urlParams[key]}`);
    });
    url += `?${arr.join("&")}`;
  }
  /* console.log(url); */
  return url;
};
