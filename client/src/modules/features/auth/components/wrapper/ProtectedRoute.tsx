import { Navigate } from "@tanstack/react-router";
import { useUserContext } from "../../context/UserContext";
import { Permisos } from "../../types/Permisos";
import { toastError } from "@/modules/core/utils/toasts";

interface Props {
  permisos: Permisos[];
  children: React.ReactNode;
  errorMessage?: string;
}

const ProtectedRoute = ({ permisos, children, errorMessage }: Props) => {
  const { user } = useUserContext();
  if (!permisos.every((permission) => user?.permisos.includes(permission))) {
    if (errorMessage) toastError(errorMessage);
    return (
      <Navigate
        to={
          user?.permisos.includes(Permisos.VER_TESTS_ASIGNACION)
            ? "/tests"
            : "/resolve"
        }
      />
    );
  }
  return children;
};

export default ProtectedRoute;
