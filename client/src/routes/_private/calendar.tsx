import ProtectedRoute from "@/modules/features/auth/components/wrapper/ProtectedRoute";
import { Permisos } from "@/modules/features/auth/types/Permisos";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/calendar")({
  component: () => (
    <ProtectedRoute permisos={[Permisos.VER_CALENDARIO]}>
      <div>Hello /_private/calendar!</div>
    </ProtectedRoute>
  ),
});
