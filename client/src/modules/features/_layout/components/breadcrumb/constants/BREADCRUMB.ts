import { LinkOptions } from "@tanstack/react-router";

interface Breadcrumb {
  name: string;
  match: LinkOptions["to"];
  breadcrumb: LinkOptions["to"][];
}

export const BREADCRUMB: Breadcrumb[] = [
  //? TESTS
  {
    name: "Tests",
    match: "/tests",
    breadcrumb: ["/tests"],
  },
  {
    name: "Resolver test",
    match: "/tests/$id",
    breadcrumb: ["/tests", "/tests/$id"],
  },
  //? RESULTADOS
  {
    name: "Resultados",
    match: "/answers",
    breadcrumb: ["/answers"],
  },
  {
    name: "Detalles del resultado",
    match: "/answers/$id",
    breadcrumb: ["/answers", "/answers/$id"],
  },
  //? SIDEBAR
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
