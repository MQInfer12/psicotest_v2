import ResolvePage from "@/modules/features/tests/modules/MAPI/pages/ResolvePage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/tests/mapi")({
  component: ResolvePage,
});
