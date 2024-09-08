import { ICON } from "@/modules/core/components/icons/Icon";
import { LinkOptions } from "@tanstack/react-router";

interface PrivateLink {
  to: LinkOptions["to"];
  icon: ICON;
  title: string;
}

export const PRIVATE_LINKS: PrivateLink[] = [
  {
    to: "/tests",
    icon: ICON.NOTES,
    title: "Tests",
  },
  {
    to: "/calendar",
    icon: ICON.CALENDAR,
    title: "Calendario",
  },
  {
    to: "/chat",
    icon: ICON.CHAT,
    title: "Chat",
  },
  {
    to: "/users",
    icon: ICON.USERS,
    title: "Usuarios",
  },
];
