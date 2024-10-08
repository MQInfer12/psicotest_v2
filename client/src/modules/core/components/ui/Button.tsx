import clsx from "clsx";
import { HTMLMotionProps, motion } from "framer-motion";
import { COLORS } from "../../constants/COLORS";
import Icon, { ICON } from "../icons/Icon";

interface Props extends HTMLMotionProps<"button"> {
  width?: string;
  textAlign?: "start" | "center";
  btnType?: "primary" | "secondary" | "tertiary";
  btnSize?: "base" | "small";
  danger?: boolean;
  icon?: ICON;
  reverse?: boolean;
  ring?: boolean;
  children?: React.ReactNode;
}

const Button = ({
  width,
  textAlign,
  btnType = "primary",
  btnSize = "base",
  danger,
  icon,
  children,
  className,
  disabled,
  reverse,
  ring,
  ...props
}: Props) => {
  const getColors = (hover: boolean) => {
    let colors: {
      backgroundColor?: string;
      borderColor?: string;
      color?: string;
    } = {};

    if (btnType === "primary") {
      if (disabled) {
        colors = {
          backgroundColor: COLORS.alto[100],
          borderColor: COLORS.primary[200],
          color: COLORS.primary[300],
        };
      } else if (hover) {
        colors = {
          backgroundColor: COLORS.primary[800],
          borderColor: COLORS.primary[800],
          color: undefined,
        };
      } else {
        colors = {
          backgroundColor: COLORS.primary[700],
          borderColor: COLORS.primary[700],
          color: COLORS.alto[50],
        };
      }
    }

    if (btnType === "secondary") {
      if (disabled) {
        colors = {
          backgroundColor: COLORS.alto[100],
          borderColor: COLORS.primary[200],
          color: COLORS.primary[300],
        };
      } else if (hover) {
        colors = {
          backgroundColor: COLORS.primary[500],
          borderColor: COLORS.primary[500],
          color: COLORS.primary[50],
        };
      } else {
        colors = {
          backgroundColor: COLORS.alto[50],
          borderColor: COLORS.alto[300],
          color: COLORS.alto[600],
        };
      }
    }

    if (btnType === "tertiary") {
      if (disabled) {
        colors = {
          backgroundColor: "transparent",
          borderColor: "transparent",
          color: COLORS.primary[300],
        };
      } else if (hover) {
        colors = {
          backgroundColor: "transparent",
          borderColor: "transparent",
          color: COLORS.primary[800],
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

    return colors;
  };

  return (
    <motion.button
      initial={getColors(false)}
      animate={getColors(false)}
      whileHover={getColors(true)}
      className={clsx(
        "h-fit rounded-lg border flex items-center cursor-pointer disabled:cursor-auto justify-center outline-none ring-0 ring-inset focus:ring-1 transition-[box-shadow]",
        {
          "ring-1": ring,
        },
        {
          "ring-primary-400": btnType === "secondary",
          "ring-white": btnType === "primary",
          "ring-transparent": btnType === "tertiary",
        },
        {
          "py-2 px-4 text-sm gap-3": btnSize === "base",
          "py-2 px-3 text-xs gap-2": btnSize === "small",
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
            "flex-1 overflow-hidden whitespace-nowrap text-ellipsis",
            {
              "text-start": textAlign === "start",
            }
          )}
        >
          {children}
        </p>
      )}
      {icon && (
        <div
          className={clsx("aspect-square", {
            "w-5": btnSize === "base",
            "w-4": btnSize === "small",
          })}
        >
          <Icon type={icon} />
        </div>
      )}
    </motion.button>
  );
};

export default Button;
