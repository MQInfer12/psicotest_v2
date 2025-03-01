import ProtectedRoute from "@/modules/features/auth/components/wrapper/ProtectedRoute";
import { Permisos } from "@/modules/features/auth/types/Permisos";
import BlogPage from "@/modules/features/blogs/pages/BlogPage";
import { createFileRoute, Navigate, useParams } from "@tanstack/react-router";
import * as yup from "yup";
import { BlogsView } from ".";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import Loader from "@/modules/core/components/ui/loader/Loader";

const SearchSchema = yup.object({
  view: yup.string().oneOf(Object.values(BlogsView)),
});
type Search = yup.InferType<typeof SearchSchema>;

export const Route = createFileRoute("/_private/blogs/$id")({
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
    from: "/_private/blogs/$id",
  });
  if (isNaN(Number(id))) return <Navigate to="/blogs" />;

  const { fetchData } = useFetch();
  const { data, setData, isError } = fetchData(
    [
      `GET /blog/:id`,
      {
        id: Number(id),
      },
    ],
    {
      params: {
        count: "true",
      },
    }
  );
  const { getDataSetter } = useFetch();
  const dataSetter = getDataSetter("GET /blog/:id", {
    id,
  });

  if (isError) return <Navigate to="/blogs" />;
  if (!data) return <Loader text="Cargando blog..." />;
  return (
    <ProtectedRoute permisos={[Permisos.VER_BLOGS]}>
      <BlogPage
        blog={data}
        onSuccessAssist={(newBlog) => {
          setData(newBlog);
          dataSetter(newBlog);
        }}
      />
    </ProtectedRoute>
  );
}
