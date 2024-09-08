import IconCalendar from "./tabler/iconCalendar";
import IconChat from "./tabler/iconChat";
import IconCheck from "./tabler/iconCheck";
import IconLogout from "./tabler/iconLogout";
import IconNotes from "./tabler/iconNotes";
import IconQuestion from "./tabler/iconQuestion";
import IconUsers from "./tabler/iconUsers";
import IconX from "./tabler/iconX";

export enum ICON {
  CHECK = "check",
  X = "x",
  QUESTION = "question",
  USERS = "users",
  LOGOUT = "logout",
  NOTES = "notes",
  CALENDAR = "calendar",
  CHAT = "chat",
}

interface Props {
  type: ICON;
}

const Icon = ({ type }: Props) => {
  const icons: Record<ICON, JSX.Element> = {
    [ICON.CHECK]: <IconCheck />,
    [ICON.X]: <IconX />,
    [ICON.QUESTION]: <IconQuestion />,
    [ICON.USERS]: <IconUsers />,
    [ICON.LOGOUT]: <IconLogout />,
    [ICON.NOTES]: <IconNotes />,
    [ICON.CALENDAR]: <IconCalendar />,
    [ICON.CHAT]: <IconChat />,
  };
  return icons[type];
};

Icon.Types = ICON;

export default Icon;
