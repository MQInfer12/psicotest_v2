import { LinkOptions } from "@tanstack/react-router";

interface Breadcrumb {
  name: string;
  match: LinkOptions["to"];
}

export const BREADCRUMB: Breadcrumb[] = [
  //? TESTS
  {
    name: "Tests",
    match: "/tests",
  },
  {
    name: "Asignación de test",
    match: "/tests/share",
  },
  {
    name: "Previsualizar test",
    match: "/tests/$idTest",
  },
  //? RESOLVER
  {
    name: "Tests",
    match: "/resolve",
  },
  {
    name: "Resolver test",
    match: "/resolve/$idRespuesta",
  },
  //? RESULTADOS
  {
    name: "Resultados",
    match: "/answers",
  },
  {
    name: "Detalles del resultado",
    match: "/answers/$id",
  },
  {
    name: "Compartir carpeta",
    match: "/folder/$id",
  },
  //? PLANTILLAS
  {
    name: "Plantillas",
    match: "/templates",
  },
  //? SIDEBAR
  {
    name: "Chat",
    match: "/chat",
  },
  {
    name: "Calendario",
    match: "/calendar",
  },
  {
    name: "Usuarios",
    match: "/users",
  },
];
