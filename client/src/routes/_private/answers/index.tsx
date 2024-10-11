import { LOCAL_ANSWERS_SEARCH } from "@/modules/core/constants/LOCALS";
import AnswersPage from "@/modules/features/answers/pages/AnswersPage";
import ProtectedRoute from "@/modules/features/auth/components/wrapper/ProtectedRoute";
import { Permisos } from "@/modules/features/auth/types/Permisos";
import { createFileRoute } from "@tanstack/react-router";
import * as yup from "yup";

const SearchSchema = yup.object({
  folders: yup
    .array()
    .of(yup.number().integer().required())
    .required()
    .default([0]),
});
type Search = yup.InferType<typeof SearchSchema>;

export const Route = createFileRoute("/_private/answers/")({
  validateSearch: (search: Record<string, unknown>): Search => {
    const local_search = localStorage.getItem(LOCAL_ANSWERS_SEARCH);
    search =
      Object.keys(search).length > 0
        ? search
        : local_search
          ? JSON.parse(local_search)
          : search;
    try {
      const validSearch = SearchSchema.validateSync(search, {
        stripUnknown: true,
      });
      return validSearch;
    } catch (e) {
      return {
        folders: [0],
      };
    }
  },
  component: () => (
    <ProtectedRoute permisos={[Permisos.VER_RESULTADOS]}>
      <AnswersPage />
    </ProtectedRoute>
  ),
});
