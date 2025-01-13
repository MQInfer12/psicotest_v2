import Icon, { ICON } from "@/modules/core/components/icons/Icon";
import { LinkOptions } from "@tanstack/react-router";

interface Breadcrumb {
  name: string;
  match: LinkOptions["to"];
  icon?: ICON;
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
  //? GABINETE
  {
    name: "Pacientes",
    match: "/patients",
  },
  {
    name: "Detalles del paciente",
    match: "/patients/$id",
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
    name: "Chat",
    match: "/chat",
  },
  {
    name: "Usuarios",
    match: "/users",
  },
  //? PROFILE
  {
    name: "Perfil",
    match: "/profile",
  },
];
