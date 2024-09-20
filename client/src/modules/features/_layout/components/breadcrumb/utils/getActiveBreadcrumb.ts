import { BREADCRUMB } from "../constants/BREADCRUMB";

export const getActiveBreadcrumb = (pathname: string) =>
  BREADCRUMB.find((b) => {
    if (b.match?.includes("$")) {
      const dynamicMatch = b.match.replace(/\$[^/]+/g, "[^/]+");
      const regex = new RegExp(`^${dynamicMatch}$`);
      return regex.test(pathname);
    }
    return b.match === pathname;
  });
