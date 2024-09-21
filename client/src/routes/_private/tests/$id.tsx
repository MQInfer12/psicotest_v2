import ErrorComponent from "@/modules/core/components/utils/ErrorComponent";
import { fetchOptions } from "@/modules/core/hooks/useFetch/utils/fetchFn";
import ResolvePage from "@/modules/features/tests/pages/ResolvePage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/tests/$id")({
  component: ResolvePage,
  beforeLoad: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(
      fetchOptions([
        "GET /test/:id",
        {
          id: 1,
        },
      ])
    );
  },
  errorComponent: ErrorComponent,
});
