import Icon, { ICON } from "@/modules/core/components/icons/Icon";
import { LinkOptions } from "@tanstack/react-router";
import { Permisos } from "../../auth/types/Permisos";

interface PrivateLink {
  to: LinkOptions["to"];
  icon: ICON;
  title: string;
  permisos: Permisos[];
}

export const PRIVATE_LINKS: PrivateLink[] = [
  {
    to: "/home",
    icon: Icon.Types.HOME,
    title: "Inicio",
    permisos: [Permisos.VER_HOME],
  },
  {
    to: "/tests",
    icon: Icon.Types.BRAIN,
    title: "Tests",
    permisos: [Permisos.VER_TESTS_ASIGNACION],
  },
  {
    to: "/resolve",
    icon: Icon.Types.BRAIN,
    title: "Tests",
    permisos: [Permisos.VER_TESTS_RESOLUCION],
  },
  {
    to: "/answers",
    icon: Icon.Types.NOTES,
    title: "Respuestas",
    permisos: [Permisos.VER_RESULTADOS],
  },
  {
    to: "/templates",
    icon: Icon.Types.TEMPLATE,
    title: "Plantillas",
    permisos: [Permisos.VER_PLANTILLAS],
  },
  {
    to: "/calendar",
    icon: Icon.Types.CALENDAR,
    title: "Gabinete",
    permisos: [Permisos.VER_CALENDARIO],
  },
  {
    to: "/patients",
    icon: Icon.Types.HISTORY,
    title: "Historiales",
    permisos: [Permisos.VER_CALENDARIO, Permisos.VER_CITAS],
  },
  {
    to: "/blogs",
    icon: Icon.Types.BLOG,
    title: "Blogs",
    permisos: [Permisos.VER_BLOGS],
  },
  /* {
    to: "/chat",
    icon: Icon.Types.CHAT,
    title: "Chat",
    permisos: [Permisos.VER_CHAT],
  }, */
  {
    to: "/users",
    icon: Icon.Types.USERS,
    title: "Usuarios",
    permisos: [Permisos.VER_USUARIOS],
  },
  {
    to: "/reports",
    icon: Icon.Types.PDF,
    title: "Reportes",
    permisos: [Permisos.VER_REPORTES],
  },
];
