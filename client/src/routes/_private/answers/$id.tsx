import AnswerPage from "@/modules/features/answers/pages/AnswerPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/answers/$id")({
  component: AnswerPage,
});
