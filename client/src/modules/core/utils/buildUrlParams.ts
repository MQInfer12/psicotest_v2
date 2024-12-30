export const buildUrlParams = (obj: Record<string, any>) => {
  const params = [];
  for (let key in obj) {
    const value = Array.isArray(obj[key]) ? JSON.stringify(obj[key]) : obj[key];
    params.push(`${key}=${value}`);
  }
  return "?" + params.join("&");
};
