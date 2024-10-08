import ErrorComponent from "@/modules/core/components/utils/ErrorComponent";
import { fetchOptions } from "@/modules/core/hooks/useFetch/utils/fetchFn";
import ProtectedRoute from "@/modules/features/auth/components/wrapper/ProtectedRoute";
import { Permisos } from "@/modules/features/auth/types/Permisos";
import ResolvePage from "@/modules/features/tests/pages/ResolvePage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/tests/$idTest")({
  component: () => (
    <ProtectedRoute permisos={[Permisos.VER_TESTS_ASIGNACION]}>
      <ResolvePage />
    </ProtectedRoute>
  ),
  beforeLoad: ({ context: { queryClient }, params: { idTest } }) => {
    return queryClient.ensureQueryData(
      fetchOptions([
        "GET /test/:id",
        {
          id: Number(idTest),
        },
      ])
    );
  },
  errorComponent: (props) => <ErrorComponent {...props} to="/tests" />,
});
