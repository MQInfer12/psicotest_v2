import ProtectedRoute from "@/modules/features/auth/components/wrapper/ProtectedRoute";
import { useCalendarAccess } from "@/modules/features/auth/hooks/usePermiso";
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
  const canAccessCalendar = useCalendarAccess();

  return (
    <ProtectedRoute
      key={id}
      permisos={[Permisos.VER_CITAS]}
      anotherConditionFn={() => canAccessCalendar}
    >
      <AppointmentPage />
    </ProtectedRoute>
  );
}
