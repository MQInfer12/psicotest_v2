import { LinkOptions } from "@tanstack/react-router";

export const validateRoute = (
  route: LinkOptions["to"],
  params?: Record<string, string>
) => {
  let newRoute = route as string;
  const paramsObj = params || {};
  Object.keys(paramsObj).forEach((key) => {
    newRoute = newRoute.replace(`$${key}`, paramsObj[key]);
  });
  return newRoute;
};
