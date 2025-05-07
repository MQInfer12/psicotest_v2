import ErrorComponent from "@/modules/core/components/utils/ErrorComponent";
import { fetchOptions } from "@/modules/core/hooks/useFetch/utils/fetchFn";
import ProtectedRoute from "@/modules/features/auth/components/wrapper/ProtectedRoute";
import { Permisos } from "@/modules/features/auth/types/Permisos";
import ResolvePage from "@/modules/features/tests/pages/ResolvePage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/resolve/$idRespuesta")({
  component: () => (
    <ProtectedRoute permisos={[Permisos.VER_TESTS_RESOLUCION]}>
      <ResolvePage />
    </ProtectedRoute>
  ),
  beforeLoad: async ({ context: { queryClient }, params: { idRespuesta } }) => {
    return queryClient.ensureQueryData(
      fetchOptions([
        "GET /test/by/respuesta/:id",
        {
          id: Number(idRespuesta),
        },
      ])
    );
  },
  errorComponent: (props) => <ErrorComponent {...props} to="/resolve" />,
});
