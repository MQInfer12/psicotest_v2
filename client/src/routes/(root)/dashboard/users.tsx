import UserPage from "@/modules/features/users/pages/UserPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(root)/dashboard/users")({
  component: UserPage,
});
