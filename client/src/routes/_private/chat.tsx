import ProtectedRoute from "@/modules/features/auth/components/wrapper/ProtectedRoute";
import { Permisos } from "@/modules/features/auth/types/Permisos";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/chat")({
  component: () => (
    <ProtectedRoute permisos={[Permisos.VER_CHAT]}>
      <div>Hello /_private/chat!</div>
    </ProtectedRoute>
  ),
});
