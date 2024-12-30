import { decyptherUrl } from "@/modules/core/utils/crypto";
import ProtectedRoute from "@/modules/features/auth/components/wrapper/ProtectedRoute";
import { Permisos } from "@/modules/features/auth/types/Permisos";
import SharePage from "@/modules/features/tests/pages/SharePage";
import { createFileRoute } from "@tanstack/react-router";

interface Params {
  cparams?: string;
  test?: number[];
  allocator?: string;
  folder?: number;
}

export const Route = createFileRoute("/_private/tests/share")({
  validateSearch: (params: Record<string, unknown>): Params => {
    if (!params.cparams) return params as any;

    const decryptedParams = decyptherUrl(params.cparams as string);
    const paramsFromString = new URLSearchParams(decryptedParams);

    const test = JSON.parse(paramsFromString.get("test") ?? "[]") as number[];
    const allocator = paramsFromString.get("allocator") ?? "";
    const folder = paramsFromString.get("folder");

    return {
      cparams: undefined,
      test: test,
      allocator: allocator,
      folder: folder ? Number(folder) : undefined,
    };
  },
  component: () => (
    <ProtectedRoute
      permisos={[Permisos.PUEDE_SER_ASIGNADO]}
      errorMessage="No tienes permisos para asignarte tests."
    >
      <SharePage />
    </ProtectedRoute>
  ),
});
