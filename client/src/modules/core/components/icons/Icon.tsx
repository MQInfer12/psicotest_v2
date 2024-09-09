import IconBell from "./tabler/iconBell";
import IconCalendar from "./tabler/iconCalendar";
import IconChat from "./tabler/iconChat";
import IconCheck from "./tabler/iconCheck";
import IconCircle from "./tabler/iconCircle";
import IconGender from "./tabler/iconGender";
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
  BELL = "bell",
  GENDER_MALE = "gender_male",
  GENDER_FEMALE = "gender_female",
  GENDER_NONE = "gender_none",
  CIRCLE = "circle",
  CIRCLE_ACTIVE = "circle_active",
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
    [ICON.BELL]: <IconBell />,
    [ICON.GENDER_MALE]: <IconGender type="male" />,
    [ICON.GENDER_FEMALE]: <IconGender type="female" />,
    [ICON.GENDER_NONE]: <IconGender type="none" />,
    [ICON.CIRCLE]: <IconCircle />,
    [ICON.CIRCLE_ACTIVE]: <IconCircle active />,
  };
  return icons[type];
};

Icon.Types = ICON;

export default Icon;
