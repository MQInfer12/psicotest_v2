import PrivacyPage from "@/modules/features/landing/pages/PrivacyPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/privacy")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PrivacyPage />;
}
