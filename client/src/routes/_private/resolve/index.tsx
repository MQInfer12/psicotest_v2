import ProtectedRoute from "@/modules/features/auth/components/wrapper/ProtectedRoute";
import { Permisos } from "@/modules/features/auth/types/Permisos";
import TestPage from "@/modules/features/tests/pages/TestPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/resolve/")({
  component: () => (
    <ProtectedRoute permisos={[Permisos.VER_TESTS_RESOLUCION]}>
      <TestPage respuestas />
    </ProtectedRoute>
  ),
});
