import { UserContextProvider } from "@/modules/features/auth/context/UserContext";
import { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Navigate,
  Outlet,
} from "@tanstack/react-router";

const Root = () => {
  return (
    <UserContextProvider>
      <Outlet />
    </UserContextProvider>
  );
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: Root,
    notFoundComponent: () => <Navigate to="/" />,
  }
);
