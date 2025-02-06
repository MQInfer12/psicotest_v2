import Loader from "@/modules/core/components/ui/loader/Loader";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import ProtectedRoute from "@/modules/features/auth/components/wrapper/ProtectedRoute";
import { Permisos } from "@/modules/features/auth/types/Permisos";
import CreateBlogPage from "@/modules/features/blogs/pages/CreateBlogPage";
import { createFileRoute, Navigate, useParams } from "@tanstack/react-router";
import * as yup from "yup";
import { BlogsView } from "..";

const SearchSchema = yup.object({
  view: yup.string().oneOf(Object.values(BlogsView)),
});
type Search = yup.InferType<typeof SearchSchema>;

export const Route = createFileRoute("/_private/blogs/create/$id")({
  validateSearch: (search: Record<string, unknown>): Search => {
    try {
      const validSearch = SearchSchema.validateSync(search, {
        stripUnknown: true,
      });
      return validSearch;
    } catch (e) {
      return {
        view: BlogsView.ALL,
      };
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({
    from: "/_private/blogs/create/$id",
  });

  if (isNaN(Number(id))) {
    return <Navigate to="/blogs" />;
  }

  const { fetchData } = useFetch();
  const { data } = fetchData([
    "GET /blog/:id",
    {
      id: Number(id),
    },
  ]);

  if (!data) {
    return <Loader />;
  }
  return (
    <ProtectedRoute permisos={[Permisos.CREAR_BLOGS]}>
      <CreateBlogPage blog={data} />
    </ProtectedRoute>
  );
}
