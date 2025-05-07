import Icon, { ICON } from "@/modules/core/components/icons/Icon";
import { LinkOptions } from "@tanstack/react-router";

interface Breadcrumb {
  name: string;
  match: LinkOptions["to"];
  icon?: ICON;
}

export const BREADCRUMB: Breadcrumb[] = [
  {
    name: "Inicio",
    match: "/home",
    icon: Icon.Types.HOME,
  },
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
  //? DESCARGA
  {
    name: "Resultados",
    match: "/download/$id",
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
  //? PLANTILLAS
  {
    name: "Plantillas",
    match: "/templates",
  },
  {
    name: "Editor de plantilla",
    match: "/templates/create",
  },
  //? BLOGS
  {
    name: "Blogs",
    match: "/blogs",
  },
  {
    name: "Editor de blog",
    match: "/blogs/create",
  },
  {
    name: "Detalles del blog",
    match: "/blogs/$id",
  },
  //? GABINETE
  {
    name: "Pacientes",
    match: "/patients",
  },
  {
    name: "Detalles del paciente",
    match: "/patients/$id",
    icon: Icon.Types.PATIENT,
  },
  {
    name: "Gabinete",
    match: "/calendar",
  },
  {
    name: "Detalles de la cita",
    match: "/calendar/$id",
    icon: Icon.Types.CALENDAR,
  },
  //? SIDEBAR
  {
    name: "Usuarios",
    match: "/users",
  },
  //? REPORTEs
  {
    name: "Reportes",
    match: "/reports",
  },
  //? PROFILE
  {
    name: "Perfil",
    match: "/profile",
  },
];
