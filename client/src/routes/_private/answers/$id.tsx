import ErrorComponent from "@/modules/core/components/utils/ErrorComponent";
import { fetchOptions } from "@/modules/core/hooks/useFetch/utils/fetchFn";
import AnswerPage from "@/modules/features/answers/pages/AnswerPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/answers/$id")({
  component: AnswerPage,
  beforeLoad: ({ context: { queryClient }, params: { id } }) => {
    return queryClient.ensureQueryData(
      fetchOptions([
        "GET /test/by/respuesta/:id",
        {
          id: Number(id),
        },
      ])
    );
  },
  errorComponent: (props) => <ErrorComponent {...props} to="/answers" />,
});
