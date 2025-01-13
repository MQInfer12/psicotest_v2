import ProtectedRoute from "@/modules/features/auth/components/wrapper/ProtectedRoute";
import { Permisos } from "@/modules/features/auth/types/Permisos";
import Profile from "@/modules/features/users/pages/Profile";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/patients/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({
    from: "/_private/patients/$id",
  });

  return (
    <ProtectedRoute permisos={[Permisos.VER_CALENDARIO, Permisos.VER_CITAS]}>
      <Profile email={id} />
    </ProtectedRoute>
  );
}
