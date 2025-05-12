import DefaultPhoto from "@/assets/images/defaultPhoto.jpg";
import Icon, { ICON } from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import dayjs from "dayjs";
import { stringFromDate } from "../../../utils/stringFromDate";
import { PropsWithChildren } from "react";
import clsx from "clsx";

const CalendarCardList = ({ children }: PropsWithChildren) => {
  return <div className="flex flex-col gap-4 pr-4 max-lg:px-0">{children}</div>;
};

const CalendarCard = ({
  title,
  onClick,
  children,
  responsive = true,
  shadowSuccess,
}: {
  title?: string;
  onClick?: () => void;
  children: React.ReactNode;
  responsive?: boolean;
  shadowSuccess?: boolean;
}) => {
  return (
    <div
      title={title}
      onClick={onClick}
      className={clsx(
        responsive && "max-sm:flex-col",
        "relative transition-all duration-200 flex bg-white dark:bg-alto-1000 rounded-lg shadow-md border border-alto-300/70 dark:border-alto-900 text-alto-950 dark:text-alto-50 overflow-hidden text-start",
        onClick &&
          "hover:-translate-y-1 hover:shadow-primary-200 dark:hover:shadow-primary-800/20 cursor-pointer",
        shadowSuccess && "shadow-success/20 dark:shadow-success/20"
      )}
    >
      {children}
    </div>
  );
};

const CalendarCardAside = ({
  date: dateProp,
  responsive = true,
}: {
  date: string;
  responsive?: boolean;
}) => {
  const { day, date } = stringFromDate(dayjs(dateProp));
  return (
    <aside
      className={clsx(
        responsive && "max-sm:flex-row max-sm:gap-2 max-sm:py-1 max-sm:h-auto",
        "flex flex-col justify-center items-center min-w-20 bg-primary-100 dark:bg-primary-1000 h-full"
      )}
    >
      <p className="text-xs opacity-80">
        {day.slice(0, 3).toLocaleLowerCase()}
      </p>
      <strong className={clsx(responsive && "max-sm:text-base", "text-2xl")}>
        {date}
      </strong>
    </aside>
  );
};

const CalendarCardBody = ({ children }: PropsWithChildren) => {
  return (
    <main className="py-4 px-6 flex flex-col gap-4 flex-1 overflow-hidden">
      {children}
    </main>
  );
};

interface HeaderTitle {
  text: string;
  onClick?: () => void;
}

interface HeaderText {
  text: string;
  icon: ICON;
}

const CalendarCardHeader = ({
  imageSrc,
  headerTexts,
  minWidth = "256px",
}: {
  imageSrc?: string;
  headerTexts: [(HeaderTitle | HeaderText)[], HeaderText[]];
  minWidth?: string;
}) => {
  return (
    <header className="flex items-center justify-between gap-4 flex-wrap overflow-hidden">
      <div
        className="flex-1 flex gap-4 items-center overflow-hidden"
        style={{ minWidth }}
      >
        {imageSrc && (
          <img
            className="h-12 w-12 object-cover rounded-md border-2 border-primary-200"
            src={imageSrc}
            onError={(event) => {
              event.currentTarget.src = DefaultPhoto;
            }}
          />
        )}
        <div className="flex flex-col flex-1 gap-1 justify-center overflow-hidden">
          {headerTexts[0].map((item, index) => {
            if ("icon" in item)
              return (
                <span
                  key={index}
                  className="flex items-center gap-2 text-xs opacity-80 overflow-hidden"
                >
                  <div className="min-w-3 h-3">
                    <Icon type={item.icon} />
                  </div>
                  <p className="overflow-hidden whitespace-nowrap text-ellipsis">
                    {item.text}
                  </p>
                </span>
              );
            return (
              <p
                key={index}
                onClick={item.onClick}
                className={clsx(
                  item.onClick && "cursor-pointer hover:underline",
                  "font-bold text-start whitespace-nowrap overflow-hidden text-ellipsis max-md:text-xs text-alto-950 dark:text-alto-50 max-w-max"
                )}
              >
                {item.text}
              </p>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {headerTexts[1].map((item, index) => (
          <span
            key={index}
            className="flex items-center gap-2 text-sm opacity-80"
          >
            <div className="w-4 h-4">
              <Icon type={item.icon} />
            </div>
            <p className="whitespace-nowrap">{item.text}</p>
          </span>
        ))}
      </div>
    </header>
  );
};

type CalendarFooterLabelColor = "alto" | "success" | "danger" | "warning";

const CalendarCardFooter = ({
  labels,
  buttons,
}: {
  labels?: {
    text: string;
    color: CalendarFooterLabelColor;
    icon?: ICON;
  }[];
  buttons?: {
    icon: ICON;
    subicon?: ICON;
    text?: string;
    type?: "primary" | "secondary";
    onClick: () => void;
    disabled?: boolean;
    title?: string;
  }[];
}) => {
  const getColorsByState = (color: CalendarFooterLabelColor) => {
    switch (color) {
      case "success":
        return "bg-success/10 text-success";
      case "alto":
        return "bg-alto-600/10 text-alto-600";
      case "warning":
        return "bg-warning/10 text-warning";
      case "danger":
        return "bg-danger/10 text-danger";
      default:
        return "";
    }
  };

  return (
    <footer className="flex items-center justify-between gap-4 flex-wrap">
      {labels ? (
        labels.map((label, index) => (
          <div key={index} className="flex gap-2 min-w-64">
            <small
              className={clsx(
                getColorsByState(label.color),
                "px-2 py-1 rounded-md text-xs flex items-center gap-2"
              )}
            >
              {label.text}
              {label.icon && (
                <div className="w-3 h-3">
                  <Icon type={label.icon} />
                </div>
              )}
            </small>
          </div>
        ))
      ) : (
        <span />
      )}
      {buttons && (
        <div className="flex gap-2">
          {buttons.map((button, index) => (
            <Button
              key={index}
              title={button.title}
              btnType={button.type ?? "primary"}
              btnSize="small"
              icon={button.icon}
              subicon={button.subicon}
              disabled={button.disabled}
              onClick={button.onClick}
            >
              {button.text}
            </Button>
          ))}
        </div>
      )}
    </footer>
  );
};

const CalendarCardDanger = ({ text }: { text: string }) => {
  return (
    <span className="absolute bottom-0 right-0 bg-danger text-xs px-2 text-white pt-[2px] rounded-tl-md">
      {text}
    </span>
  );
};

CalendarCard.List = CalendarCardList;
CalendarCard.Aside = CalendarCardAside;
CalendarCard.Body = CalendarCardBody;
CalendarCard.Header = CalendarCardHeader;
CalendarCard.Footer = CalendarCardFooter;
CalendarCard.Danger = CalendarCardDanger;

export default CalendarCard;
