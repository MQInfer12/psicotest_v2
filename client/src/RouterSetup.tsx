import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { useUserContext } from "./modules/features/auth/context/UserContext";

const router = createRouter({ routeTree, context: { state: undefined! } });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const RouterSetup = () => {
  const { state } = useUserContext();
  return <RouterProvider router={router} context={{ state }} />;
};

export default RouterSetup;
