import AnswersPage from "@/modules/features/answers/pages/AnswersPage";
import ProtectedRoute from "@/modules/features/auth/components/wrapper/ProtectedRoute";
import { Permisos } from "@/modules/features/auth/types/Permisos";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/answers/")({
  component: () => (
    <ProtectedRoute permisos={[Permisos.VER_RESULTADOS]}>
      <AnswersPage />
    </ProtectedRoute>
  ),
});
