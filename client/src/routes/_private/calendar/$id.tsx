import ProtectedRoute from "@/modules/features/auth/components/wrapper/ProtectedRoute";
import { Permisos } from "@/modules/features/auth/types/Permisos";
import AppointmentPage from "@/modules/features/calendar/pages/AppointmentPage";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/calendar/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({
    from: "/_private/calendar/$id",
  });

  return (
    <ProtectedRoute
      key={id}
      permisos={[Permisos.VER_CALENDARIO, Permisos.VER_CITAS]}
    >
      <AppointmentPage />
    </ProtectedRoute>
  );
}
