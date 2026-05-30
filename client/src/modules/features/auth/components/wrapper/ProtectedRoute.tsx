import { toastError } from "@/modules/core/utils/toasts";
import { Navigate } from "@tanstack/react-router";
import { usePermiso } from "../../hooks/usePermiso";
import { Permisos } from "../../types/Permisos";

interface Props {
  permisos: Permisos[];
  children: React.ReactNode;
  errorMessage?: string;
  behavior?: "or" | "and";
  anotherConditionFn?: () => boolean;
}

const ProtectedRoute = ({
  permisos,
  children,
  errorMessage,
  behavior = "and",
  anotherConditionFn,
}: Props) => {
  const canAccessByPermisos = usePermiso(permisos, behavior);
  const canAccessByAnotherCondition = anotherConditionFn
    ? anotherConditionFn()
    : true;
  const canAccess = canAccessByPermisos && canAccessByAnotherCondition;

  const canViewHome = usePermiso([Permisos.VER_HOME]);
  const canViewTestAsignacion = usePermiso([Permisos.VER_TESTS_ASIGNACION]);
  const canViewTestResolucion = usePermiso([Permisos.VER_TESTS_RESOLUCION]);

  if (!canAccess) {
    if (errorMessage) toastError(errorMessage);
    return (
      <Navigate
        to={
          canViewHome
            ? "/home"
            : canViewTestResolucion
            ? "/resolve"
            : canViewTestAsignacion
            ? "/tests"
            : "/"
        }
      />
    );
  }
  return children;
};

export default ProtectedRoute;
