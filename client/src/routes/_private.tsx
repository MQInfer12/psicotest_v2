import { MeasureContextProvider } from "@/modules/features/_layout/context/MeasureContext";
import Dashboard from "@/modules/features/_layout/pages/Private";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private")({
  component: () => (
    <MeasureContextProvider>
      <Dashboard />
    </MeasureContextProvider>
  ),
});
