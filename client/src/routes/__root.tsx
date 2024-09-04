import { UserContextState } from "@/modules/features/auth/context/UserContext";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

interface RouterContext {
  state: UserContextState;
}

const Root = () => {
  return <Outlet />;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Root,
});
