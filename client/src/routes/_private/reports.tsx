import ProtectedRoute from "@/modules/features/auth/components/wrapper/ProtectedRoute";
import { Permisos } from "@/modules/features/auth/types/Permisos";
import ReportsPage from "@/modules/features/reports/pages/ReportsPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/reports")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute permisos={[Permisos.VER_REPORTES]}>
      <ReportsPage />
    </ProtectedRoute>
  );
}
