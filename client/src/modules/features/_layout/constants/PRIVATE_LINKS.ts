import { ICON } from "@/modules/core/components/icons/Icon";
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
    to: "/tests",
    icon: ICON.BRAIN,
    title: "Tests",
    permisos: [Permisos.VER_TESTS_ASIGNACION],
  },
  {
    to: "/resolve",
    icon: ICON.BRAIN,
    title: "Tests",
    permisos: [Permisos.VER_TESTS_RESOLUCION],
  },
  {
    to: "/answers",
    icon: ICON.NOTES,
    title: "Respuestas",
    permisos: [Permisos.VER_RESULTADOS],
  },
  {
    to: "/calendar",
    icon: ICON.CALENDAR,
    title: "Calendario",
    permisos: [Permisos.VER_CALENDARIO],
  },
  {
    to: "/chat",
    icon: ICON.CHAT,
    title: "Chat",
    permisos: [Permisos.VER_CHAT],
  },
  {
    to: "/users",
    icon: ICON.USERS,
    title: "Usuarios",
    permisos: [Permisos.VER_USUARIOS],
  },
];
