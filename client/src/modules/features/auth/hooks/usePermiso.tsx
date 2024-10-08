import { useUserContext } from "../context/UserContext";
import { Permisos } from "../types/Permisos";

export const usePermiso = (permisos: Permisos[]) => {
  const { user } = useUserContext();
  return permisos.every((permission) => user?.permisos.includes(permission));
};
