import clsx from "clsx";
import { HTMLMotionProps, motion } from "framer-motion";
import { COLORS } from "../../constants/COLORS";
import Icon, { ICON } from "../icons/Icon";
import { useThemeContext } from "../../context/ThemeContext";

export type ButtonType = "primary" | "secondary" | "tertiary";

interface Props extends HTMLMotionProps<"button"> {
  width?: string;
  textAlign?: "start" | "center";
  btnType?: "primary" | "secondary" | "tertiary";
  btnSize?: "base" | "small" | "square";
  danger?: boolean;
  primary?: boolean;
  icon?: ICON;
  subicon?: ICON;
  reverse?: boolean;
  ring?: boolean;
  children?: React.ReactNode;
  textClassname?: string;
}

const Button = ({
  width,
  textAlign,
  btnType = "primary",
  btnSize = "base",
  danger,
  primary,
  icon,
  subicon,
  children,
  className,
  disabled,
  reverse,
  ring,
  textClassname,
  ...props
}: Props) => {
  const getColors = (hover: boolean) => {
    const { dark } = useThemeContext();

    let colors: {
      backgroundColor?: string;
      borderColor?: string;
      color?: string;
    } = {};

    if (btnType === "primary") {
      if (disabled) {
        colors = {
          backgroundColor: dark ? COLORS.alto[950] : COLORS.alto[100],
          borderColor: dark ? COLORS.alto[900] : COLORS.primary[200],
          color: dark ? COLORS.alto[900] : COLORS.primary[300],
        };
      } else if (hover) {
        colors = {
          backgroundColor: dark ? COLORS.primary[600] : COLORS.primary[800],
          borderColor: dark ? COLORS.primary[600] : COLORS.primary[800],
        };
      } else {
        colors = {
          backgroundColor: dark ? COLORS.primary[500] : COLORS.primary[700],
          borderColor: dark ? COLORS.primary[500] : COLORS.primary[700],
          color: COLORS.alto[50],
        };
      }
    }

    if (btnType === "secondary") {
      if (disabled) {
        colors = {
          backgroundColor: dark ? COLORS.alto[950] : COLORS.alto[100],
          borderColor: dark ? COLORS.alto[900] : COLORS.primary[200],
          color: dark ? COLORS.alto[900] : COLORS.primary[300],
        };
      } else if (hover) {
        colors = {
          backgroundColor: dark ? COLORS.primary[600] : COLORS.primary[500],
          borderColor: dark ? COLORS.primary[600] : COLORS.primary[500],
          color: COLORS.primary[50],
        };
      } else {
        colors = {
          backgroundColor: dark ? COLORS.alto[1000] : COLORS.alto[50],
          borderColor: dark ? COLORS.alto[800] : COLORS.alto[300],
          color: dark ? COLORS.alto[500] : COLORS.alto[600],
        };
      }
    }

    if (btnType === "tertiary") {
      if (disabled) {
        colors = {
          backgroundColor: "transparent",
          borderColor: "transparent",
          color: COLORS.primary[400],
        };
      } else if (hover) {
        colors = {
          backgroundColor: "transparent",
          borderColor: "transparent",
          color: dark ? COLORS.primary[400] : COLORS.primary[800],
        };
      } else {
        colors = {
          backgroundColor: "transparent",
          borderColor: "transparent",
          color: COLORS.alto[600],
        };
      }
    }

    if (danger && !disabled && !hover) {
      colors.color = COLORS.danger;
    }
    if (primary && !disabled && !hover) {
      colors.color = dark ? COLORS.primary[400] : COLORS.primary[500];
    }

    return colors;
  };

  return (
    <motion.button
      initial={getColors(false)}
      animate={getColors(false)}
      whileHover={getColors(true)}
      className={clsx(
        "rounded-lg border flex items-center cursor-pointer disabled:cursor-auto justify-center outline-none ring-0 ring-inset focus:ring-1 transition-[box-shadow]",
        {
          "ring-1": ring,
        },
        {
          "ring-primary-400": btnType === "secondary",
          "ring-white dark:ring-alto-1000": btnType === "primary",
          "ring-transparent": btnType === "tertiary",
        },
        {
          "py-2 px-4 text-sm gap-3": btnSize === "base",
          "py-2 px-3 text-xs gap-2": btnSize === "small",
          "py-1 px-1 text-[10px] gap-1": btnSize === "square",
        },
        {
          "h-fit": btnSize !== "square",
          "flex-col-reverse aspect-square max-w-20 overflow-hidden":
            btnSize === "square",
        },
        {
          "flex-row-reverse": reverse,
        },
        className
      )}
      style={{
        width,
      }}
      disabled={disabled}
      {...props}
    >
      {children && (
        <p
          className={clsx(
            "overflow-hidden text-ellipsis",
            {
              "text-start": textAlign === "start",
            },
            {
              "flex-1 whitespace-nowrap": btnSize !== "square",
              "w-full whitespace-normal line-clamp-2": btnSize === "square",
            },
            textClassname
          )}
        >
          {children}
        </p>
      )}
      {icon && (
        <div
          className={clsx("aspect-square relative bg-inherit", {
            "w-5": btnSize === "base",
            "w-4": btnSize === "small",
            "w-6": btnSize === "square",
          })}
        >
          <Icon type={icon} />
          {subicon && (
            <div className="absolute w-[9px] rounded-full bg-inherit aspect-square bottom-[1px] pt-[1px] pl-[1px] right-0 [&_svg]:!stroke-[4px]">
              <Icon type={subicon} />
            </div>
          )}
        </div>
      )}
    </motion.button>
  );
};

export default Button;
