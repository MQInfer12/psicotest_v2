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
    name: "Asignación de test",
    match: "/tests/share",
    breadcrumb: ["/tests", "/tests/share"],
  },
  {
    name: "Previsualizar test",
    match: "/tests/$idTest",
    breadcrumb: ["/tests", "/tests/$idTest"],
  },
  //? RESOLVER
  {
    name: "Tests",
    match: "/resolve",
    breadcrumb: ["/resolve"],
  },
  {
    name: "Resolver test",
    match: "/resolve/$idRespuesta",
    breadcrumb: ["/resolve", "/resolve/$idRespuesta"],
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
