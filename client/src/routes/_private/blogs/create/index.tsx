import ProtectedRoute from "@/modules/features/auth/components/wrapper/ProtectedRoute";
import { Permisos } from "@/modules/features/auth/types/Permisos";
import CreateBlogPage from "@/modules/features/blogs/pages/CreateBlogPage";
import { createFileRoute } from "@tanstack/react-router";
import * as yup from "yup";
import { BlogsView } from "..";

const SearchSchema = yup.object({
  view: yup.string().oneOf(Object.values(BlogsView)),
});
type Search = yup.InferType<typeof SearchSchema>;

export const Route = createFileRoute("/_private/blogs/create/")({
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
  return (
    <ProtectedRoute permisos={[Permisos.CREAR_BLOGS]}>
      <CreateBlogPage />
    </ProtectedRoute>
  );
}
