import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "sonner";
import { UserContextProvider } from "./modules/features/auth/context/UserContext";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { toastError } from "./modules/core/utils/toasts";
import RouterSetup from "./RouterSetup";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      console.error(error.message);
      toastError(error.message);
    },
  }),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster position="top-right" />
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <RouterSetup />
      </UserContextProvider>
    </QueryClientProvider>
  </StrictMode>
);
