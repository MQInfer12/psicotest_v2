import { Navigate } from "@tanstack/react-router";
import { useUserContext } from "../../context/UserContext";
import { Permisos } from "../../types/Permisos";

interface Props {
  permisos: Permisos[];
  children: React.ReactNode;
}

const ProtectedRoute = ({ permisos, children }: Props) => {
  const { user } = useUserContext();
  if (!permisos.every((permission) => user?.permisos.includes(permission))) {
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
