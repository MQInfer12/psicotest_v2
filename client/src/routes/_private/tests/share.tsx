import ProtectedRoute from "@/modules/features/auth/components/wrapper/ProtectedRoute";
import { Permisos } from "@/modules/features/auth/types/Permisos";
import SharePage from "@/modules/features/tests/pages/SharePage";
import { createFileRoute } from "@tanstack/react-router";

interface Params {
  test: number;
  allocator: string;
}

export const Route = createFileRoute("/_private/tests/share")({
  validateSearch: (params: Record<string, unknown>): Params => ({
    test: Number(params.test),
    allocator: String(params.allocator),
  }),
  component: () => (
    <ProtectedRoute permisos={[Permisos.PUEDE_SER_ASIGNADO]}>
      <SharePage />
    </ProtectedRoute>
  ),
});
