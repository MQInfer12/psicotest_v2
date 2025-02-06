import ProtectedRoute from "@/modules/features/auth/components/wrapper/ProtectedRoute";
import { Permisos } from "@/modules/features/auth/types/Permisos";
import BlogsPage from "@/modules/features/blogs/pages/BlogsPage";
import { createFileRoute } from "@tanstack/react-router";
import * as yup from "yup";

export enum BlogsView {
  OWN = "own",
  ALL = "all",
}

const SearchSchema = yup.object({
  view: yup.string().oneOf(Object.values(BlogsView)),
});
type Search = yup.InferType<typeof SearchSchema>;

export const Route = createFileRoute("/_private/blogs/")({
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
    <ProtectedRoute permisos={[Permisos.VER_BLOGS]}>
      <BlogsPage />
    </ProtectedRoute>
  );
}
