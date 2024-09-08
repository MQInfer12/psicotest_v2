import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/tests")({
  component: () => <div>Hello /_private/tests!</div>,
});
