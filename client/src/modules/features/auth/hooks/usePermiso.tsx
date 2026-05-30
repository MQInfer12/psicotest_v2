import { useUserContext } from "../context/UserContext";
import { Permisos } from "../types/Permisos";

const UNIFRANZ_DOMAIN = "@unifranz.edu.bo";

export const usePermiso = (
  permisos: Permisos[],
  behavior: "or" | "and" = "and"
) => {
  const { user } = useUserContext();
  if (behavior === "and") {
    return permisos.every((permission) => user?.permisos.includes(permission));
  } else {
    return permisos.some((permission) => user?.permisos.includes(permission));
  }
};

export const useCalendarAccess = () => {
  const { user } = useUserContext();

  if (!user) return false;

  const hasCalendarPermission = user.permisos.includes(Permisos.VER_CALENDARIO);
  if (hasCalendarPermission) return true;

  const hasUnifranzPermission = user.permisos.includes(
    Permisos.VER_CALENDARIO_UNIFRANZ
  );
  const isUnifranzEmail = user.email
    .toLowerCase()
    .endsWith(UNIFRANZ_DOMAIN);

  return hasUnifranzPermission && isUnifranzEmail;
};
