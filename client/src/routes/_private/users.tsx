import ProtectedRoute from "@/modules/features/auth/components/wrapper/ProtectedRoute";
import { Permisos } from "@/modules/features/auth/types/Permisos";
import UserTablePage from "@/modules/features/users/pages/UserTablePage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/users")({
  component: () => (
    <ProtectedRoute permisos={[Permisos.VER_USUARIOS]}>
      <UserTablePage />
    </ProtectedRoute>
  ),
});
