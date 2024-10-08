import ErrorComponent from "@/modules/core/components/utils/ErrorComponent";
import { fetchOptions } from "@/modules/core/hooks/useFetch/utils/fetchFn";
import AnswerPage from "@/modules/features/answers/pages/AnswerPage";
import ProtectedRoute from "@/modules/features/auth/components/wrapper/ProtectedRoute";
import { Permisos } from "@/modules/features/auth/types/Permisos";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/answers/$id")({
  component: () => (
    <ProtectedRoute permisos={[Permisos.VER_RESULTADOS]}>
      <AnswerPage />
    </ProtectedRoute>
  ),
  beforeLoad: ({ context: { queryClient }, params: { id } }) => {
    return queryClient.ensureQueryData(
      fetchOptions([
        "GET /test/for/respuesta/:id",
        {
          id: Number(id),
        },
      ])
    );
  },
  errorComponent: (props) => <ErrorComponent {...props} to="/answers" />,
});
