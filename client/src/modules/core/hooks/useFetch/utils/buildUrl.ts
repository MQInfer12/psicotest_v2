//* BUILD URL WITH PARAMS
export const buildUrl = (
  endpoint: string,
  params?: Record<string, any>
): string => {
  let url = endpoint.split(" ")[1];
  if (params) {
    Object.keys(params).forEach((key) => {
      url = url.replace(`:${key}`, params[key as keyof typeof params]);
    });
  }
  return url;
};
