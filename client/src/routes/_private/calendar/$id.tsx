import ProtectedRoute from "@/modules/features/auth/components/wrapper/ProtectedRoute";
import { Permisos } from "@/modules/features/auth/types/Permisos";
import AppointmentPage from "@/modules/features/calendar/pages/AppointmentPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/calendar/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute permisos={[Permisos.VER_CALENDARIO, Permisos.VER_CITAS]}>
      <AppointmentPage />
    </ProtectedRoute>
  );
}
