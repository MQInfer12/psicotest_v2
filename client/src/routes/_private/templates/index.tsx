import ProtectedRoute from "@/modules/features/auth/components/wrapper/ProtectedRoute";
import { Permisos } from "@/modules/features/auth/types/Permisos";
import TemplatePage from "@/modules/features/templates/pages/TemplatePage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/templates/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute permisos={[Permisos.VER_PLANTILLAS]}>
      <TemplatePage />
    </ProtectedRoute>
  );
}
