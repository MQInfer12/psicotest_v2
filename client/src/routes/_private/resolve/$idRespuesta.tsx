import ErrorComponent from "@/modules/core/components/utils/ErrorComponent";
import { fetchOptions } from "@/modules/core/hooks/useFetch/utils/fetchFn";
import ResolvePage from "@/modules/features/tests/pages/ResolvePage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/resolve/$idRespuesta")({
  component: ResolvePage,
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
  errorComponent: (props) => <ErrorComponent {...props} to="/tests" />,
});
