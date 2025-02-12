import ProtectedRoute from "@/modules/features/auth/components/wrapper/ProtectedRoute";
import { Permisos } from "@/modules/features/auth/types/Permisos";
import TemplateEditorPage from "@/modules/features/templates/pages/TemplateEditorPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/templates/create/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute permisos={[Permisos.VER_PLANTILLAS]}>
      <TemplateEditorPage />
    </ProtectedRoute>
  );
}
