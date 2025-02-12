import Loader from "@/modules/core/components/ui/loader/Loader";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import ProtectedRoute from "@/modules/features/auth/components/wrapper/ProtectedRoute";
import { Permisos } from "@/modules/features/auth/types/Permisos";
import TemplateEditorPage from "@/modules/features/templates/pages/TemplateEditorPage";
import { createFileRoute, Navigate, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/templates/create/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({
    from: "/_private/templates/create/$id",
  });

  if (isNaN(Number(id))) {
    return <Navigate to="/templates" />;
  }

  const { fetchData } = useFetch();
  const { data } = fetchData(
    [
      "GET /plantilla/:id",
      {
        id: Number(id),
      },
    ],
    {
      queryOptions: {
        queryKey: ["Editar plantilla"],
        gcTime: 0,
      },
    }
  );

  if (!data) {
    return <Loader />;
  }

  return (
    <ProtectedRoute permisos={[Permisos.VER_PLANTILLAS]}>
      <TemplateEditorPage template={data} />
    </ProtectedRoute>
  );
}
