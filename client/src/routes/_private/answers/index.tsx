import AnswersPage from "@/modules/features/answers/pages/AnswersPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/answers/")({
  component: AnswersPage,
});
