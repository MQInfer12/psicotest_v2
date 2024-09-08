import Icon, { ICON } from "@/modules/core/components/icons/Icon";
import Appear from "@/modules/core/components/utils/Appear";
import { Link, LinkOptions } from "@tanstack/react-router";
import clsx from "clsx";

interface Props extends LinkOptions {
  icon: ICON;
  title: string;
  type: "link" | "button";
  showText?: boolean;
  onClick?: (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.MouseEvent<"a", MouseEvent>
  ) => void;
}

const ASIDE_LINK_CLASSES = () => {
  return clsx(
    "flex h-10 p-2 px-4 rounded-lg items-center gap-4 transition-all duration-300",
    "bg-transparent text-alto-400 ",
    "hover:bg-primary-600 hover:text-alto-100",
    "active:bg-primary-800 active:text-alto-100",
    "[&.active]:bg-primary-800 [&.active]:text-alto-100"
  );
};

const AsideLink = ({
  icon,
  title,
  onClick,
  type,
  showText = true,
  ...props
}: Props) => {
  const child = (
    <>
      <div className="h-full aspect-square">
        <Icon type={icon} />
      </div>
      <Appear open={showText} className="font-normal whitespace-nowrap">
        {title}
      </Appear>
    </>
  );

  if (type === "button")
    return (
      <button className={ASIDE_LINK_CLASSES()} onClick={onClick}>
        {child}
      </button>
    );
  if (type === "link")
    return (
      <Link {...props} className={ASIDE_LINK_CLASSES()} onClick={onClick}>
        {child}
      </Link>
    );
};

export default AsideLink;
