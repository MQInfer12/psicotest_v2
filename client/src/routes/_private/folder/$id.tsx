import ProtectedRoute from "@/modules/features/auth/components/wrapper/ProtectedRoute";
import { Permisos } from "@/modules/features/auth/types/Permisos";
import FolderSharePage from "@/modules/features/folders/pages/FolderSharePage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/folder/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute permisos={[Permisos.VER_RESULTADOS]}>
      <FolderSharePage />
    </ProtectedRoute>
  );
}
