import AppointmentPage from "@/modules/features/calendar/pages/AppointmentPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/calendar/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AppointmentPage />;
}
