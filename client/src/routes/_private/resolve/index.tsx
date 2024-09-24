import TestPage from "@/modules/features/tests/pages/TestPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/resolve/")({
  component: () => <TestPage respuestas />,
});
