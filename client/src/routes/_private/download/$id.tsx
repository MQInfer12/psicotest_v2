import Loader from "@/modules/core/components/ui/loader/Loader";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import ProtectedRoute from "@/modules/features/auth/components/wrapper/ProtectedRoute";
import { Permisos } from "@/modules/features/auth/types/Permisos";
import DownloadPage from "@/modules/features/tests/pages/DownloadPage";
import { createFileRoute, Navigate, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/download/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({
    from: "/_private/download/$id",
  });

  const { fetchData } = useFetch();
  const { data, error } = fetchData(
    [
      "GET /test/for/respuesta/:id",
      {
        id: Number(id),
      },
    ],
    {
      queryOptions: {
        queryKey: ["Descargar respuesta"],
        gcTime: 0,
      },
    }
  );

  if (error) {
    return <Navigate to="/resolve" />;
  }
  if (!data) {
    return <Loader />;
  }
  return (
    <ProtectedRoute permisos={[Permisos.VER_TESTS_RESOLUCION]}>
      <DownloadPage data={data} />
    </ProtectedRoute>
  );
}
