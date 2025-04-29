import { useUserContext } from "../context/UserContext";
import { Permisos } from "../types/Permisos";

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
