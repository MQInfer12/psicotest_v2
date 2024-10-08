import ProtectedRoute from "@/modules/features/auth/components/wrapper/ProtectedRoute";
import { Permisos } from "@/modules/features/auth/types/Permisos";
import UserPage from "@/modules/features/users/pages/UserPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/users")({
  component: () => (
    <ProtectedRoute permisos={[Permisos.VER_USUARIOS]}>
      <UserPage />
    </ProtectedRoute>
  ),
});
