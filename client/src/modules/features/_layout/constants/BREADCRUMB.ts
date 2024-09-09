import { LinkOptions } from "@tanstack/react-router";

interface Breadcrumb {
  name: string;
  match: LinkOptions["to"];
  breadcrumb: LinkOptions["to"][];
}

export const BREADCRUMB: Breadcrumb[] = [
  {
    name: "Tests",
    match: "/tests",
    breadcrumb: ["/tests"],
  },
  {
    name: "Chat",
    match: "/chat",
    breadcrumb: ["/chat"],
  },
  {
    name: "Calendario",
    match: "/calendar",
    breadcrumb: ["/calendar"],
  },
  {
    name: "Usuarios",
    match: "/users",
    breadcrumb: ["/users"],
  },
];
