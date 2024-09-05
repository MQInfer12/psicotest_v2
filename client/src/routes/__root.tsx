import { UserContextProvider } from "@/modules/features/auth/context/UserContext";
import { createRootRoute, Navigate, Outlet } from "@tanstack/react-router";

const Root = () => {
  return (
    <UserContextProvider>
      <Outlet />
    </UserContextProvider>
  );
};

export const Route = createRootRoute({
  component: Root,
  notFoundComponent: () => <Navigate to="/login" />,
});
