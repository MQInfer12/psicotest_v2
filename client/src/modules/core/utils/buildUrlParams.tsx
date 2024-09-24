export const buildUrlParams = (obj: Record<string, any>) => {
  const params = [];
  for (let key in obj) {
    params.push(`${key}=${obj[key]}`);
  }
  return "?" + params.join("&");
};
