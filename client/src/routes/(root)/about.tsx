import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(root)/about")({
  component: () => <div className="p-2">Hello from About!</div>,
});
