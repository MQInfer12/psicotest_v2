import Dashboard from "@/modules/features/dashboard/pages/Dashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(root)/dashboard")({
  component: Dashboard,
});
