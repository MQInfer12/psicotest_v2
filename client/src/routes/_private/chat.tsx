import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/chat")({
  component: () => <div>Hello /_private/chat!</div>,
});
