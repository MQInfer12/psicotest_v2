import LoginPage from "@/modules/features/auth/pages/LoginPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(root)/")({
  component: LoginPage,
});
