import { useLocation } from "@tanstack/react-router";
import { getActiveBreadcrumb } from "../utils/getActiveBreadcrumb";

interface Breadcrumb {
  name: string;
  path: string;
}

export const useBreadcrumb = () => {
  const { pathname } = useLocation();

  const route_history = pathname.split("/").filter((x) => x && x.length > 0);
  const breadcrumb_routes = route_history.reduce((acc: Breadcrumb[], route) => {
    const prev_path = acc[acc.length - 1]?.path ?? "";
    const path = `${prev_path}/${route}`;
    const activeBreadcrumb = getActiveBreadcrumb(path);
    acc.push({
      name: activeBreadcrumb?.name ?? "",
      path,
    });
    return acc;
  }, []);

  return breadcrumb_routes;
};
