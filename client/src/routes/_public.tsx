import Public from "@/modules/features/_layout/pages/Public";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public")({
  component: Public,
});
