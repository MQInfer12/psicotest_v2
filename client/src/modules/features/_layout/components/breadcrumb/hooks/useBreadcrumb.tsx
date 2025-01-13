import { useLocation } from "@tanstack/react-router";
import { getActiveBreadcrumb } from "../utils/getActiveBreadcrumb";
import { ICON } from "@/modules/core/components/icons/Icon";

interface Breadcrumb {
  name: string;
  path: string;
  icon?: ICON;
}

export const useBreadcrumb = (path?: string) => {
  const { pathname } = useLocation();

  const route_history = (path ?? pathname)
    .split("/")
    .filter((x) => x && x.length > 0);
  const breadcrumb_routes = route_history.reduce((acc: Breadcrumb[], route) => {
    const prev_path = acc[acc.length - 1]?.path ?? "";
    const path = `${prev_path}/${route}`;
    const activeBreadcrumb = getActiveBreadcrumb(path);
    acc.push({
      name: activeBreadcrumb?.name ?? "",
      path,
      icon: activeBreadcrumb?.icon,
    });
    return acc;
  }, []);

  return breadcrumb_routes.filter((v) => !!v.name);
};
