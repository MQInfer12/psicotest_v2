import ProtectedRoute from "@/modules/features/auth/components/wrapper/ProtectedRoute";
import { useCalendarAccess } from "@/modules/features/auth/hooks/usePermiso";
import { Permisos } from "@/modules/features/auth/types/Permisos";
import CalendarPage from "@/modules/features/calendar/pages/CalendarPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/calendar/")({
  component: RouteComponent,
});

function RouteComponent() {
  const canAccessCalendar = useCalendarAccess();

  return (
    <ProtectedRoute
      permisos={[Permisos.VER_CALENDARIO, Permisos.VER_CALENDARIO_UNIFRANZ]}
      behavior="or"
      anotherConditionFn={() => canAccessCalendar}
    >
      <CalendarPage />
    </ProtectedRoute>
  );
}
