import IconCheckAnimated from "./css/iconCheckAnimated";
import IconArrow from "./tabler/iconArrow";
import IconBell from "./tabler/iconBell";
import IconBrain from "./tabler/iconBrain";
import IconCalendar from "./tabler/iconCalendar";
import IconCaret from "./tabler/iconCaret";
import IconChat from "./tabler/iconChat";
import IconCheck from "./tabler/iconCheck";
import IconChevron from "./tabler/iconChevron";
import IconCircle from "./tabler/iconCircle";
import IconDots from "./tabler/iconDots";
import IconExcel from "./tabler/iconExcel";
import IconGender from "./tabler/iconGender";
import IconLogout from "./tabler/iconLogout";
import IconNotes from "./tabler/iconNotes";
import IconPDF from "./tabler/iconPDF";
import IconPencil from "./tabler/iconPencil";
import IconPersonActive from "./tabler/iconPersonActive";
import IconQR from "./tabler/iconQR";
import IconQuestion from "./tabler/iconQuestion";
import IconSad from "./tabler/iconSad";
import IconSchool from "./tabler/iconSchool";
import IconStarred from "./tabler/iconStarred";
import IconTrash from "./tabler/iconTrash";
import IconUser from "./tabler/iconUser";
import IconUsers from "./tabler/iconUsers";
import IconX from "./tabler/iconX";

export enum ICON {
  CHECK = "check",
  CHECK_ANIMATED = "check_animated",
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
  PENCIL = "pencil",
  TRASH = "trash",
  PERSON_ACTIVE = "person_active",
  PERSON_INACTIVE = "person_inactive",
  ARROW_RIGHT = "arrow_right",
  ARROW_LEFT = "arrow_left",
  CHEVRON_RIGHT = "chevron_right",
  CHEVRON_LEFT = "chevron_left",
  USER = "user",
  SCHOOL = "school",
  DOTS = "dots",
  BRAIN = "brain",
  QR = "QR",
  STARRED = "starred",
  PDF = "pdf",
  EXCEL = "excel",
  CARET_UP = "caret_up",
  CARET_DOWN = "caret_down",
  SAD = "sad",
}

interface Props {
  type: ICON;
}

const Icon = ({ type }: Props) => {
  const icons: Record<ICON, JSX.Element> = {
    [ICON.CHECK]: <IconCheck />,
    [ICON.CHECK_ANIMATED]: <IconCheckAnimated />,
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
    [ICON.PENCIL]: <IconPencil />,
    [ICON.TRASH]: <IconTrash />,
    [ICON.PERSON_ACTIVE]: <IconPersonActive />,
    [ICON.PERSON_INACTIVE]: <IconPersonActive x />,
    [ICON.ARROW_RIGHT]: <IconArrow type="right" />,
    [ICON.ARROW_LEFT]: <IconArrow type="left" />,
    [ICON.CHEVRON_RIGHT]: <IconChevron type="right" />,
    [ICON.CHEVRON_LEFT]: <IconChevron type="left" />,
    [ICON.USER]: <IconUser />,
    [ICON.SCHOOL]: <IconSchool />,
    [ICON.DOTS]: <IconDots />,
    [ICON.BRAIN]: <IconBrain />,
    [ICON.QR]: <IconQR />,
    [ICON.STARRED]: <IconStarred />,
    [ICON.PDF]: <IconPDF />,
    [ICON.EXCEL]: <IconExcel />,
    [ICON.CARET_UP]: <IconCaret type="up" />,
    [ICON.CARET_DOWN]: <IconCaret type="down" />,
    [ICON.SAD]: <IconSad />,
  };
  return icons[type];
};

Icon.Types = ICON;

export default Icon;
