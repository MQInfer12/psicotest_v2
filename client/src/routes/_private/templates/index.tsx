import TemplatePage from "@/modules/features/templates/pages/TemplatePage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/templates/")({
  component: TemplatePage,
});
