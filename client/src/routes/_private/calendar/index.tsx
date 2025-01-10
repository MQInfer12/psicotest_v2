import ProtectedRoute from "@/modules/features/auth/components/wrapper/ProtectedRoute";
import { Permisos } from "@/modules/features/auth/types/Permisos";
import CalendarPage from "@/modules/features/calendar/pages/CalendarPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/calendar/")({
  component: () => (
    <ProtectedRoute permisos={[Permisos.VER_CALENDARIO]}>
      <CalendarPage />
    </ProtectedRoute>
  ),
});
