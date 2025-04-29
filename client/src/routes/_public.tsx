import Public from "@/modules/features/_layout/pages/Public";
import { createFileRoute } from "@tanstack/react-router";

interface Params {
  redirect?: string;
  canBeClosed?: string;
}

export const Route = createFileRoute("/_public")({
  validateSearch: (params: Record<string, unknown>): Params => {
    return {
      redirect: params.redirect ? String(params.redirect) : undefined,
      canBeClosed: params.canBeClosed ? String(params.canBeClosed) : undefined,
    };
  },
  component: Public,
});
