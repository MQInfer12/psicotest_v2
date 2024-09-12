import clsx from "clsx";
import { HTMLMotionProps, motion } from "framer-motion";
import { COLORS } from "../../constants/COLORS";
import Icon, { ICON } from "../icons/Icon";

interface Props extends HTMLMotionProps<"button"> {
  btnType?: "primary" | "secondary";
  danger?: boolean;
  icon?: ICON;
  reverse?: boolean;
  children?: React.ReactNode;
}

const Button = ({
  btnType = "primary",
  danger,
  icon,
  children,
  className,
  disabled,
  reverse,
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

    if (danger && !disabled && !hover) {
      colors.color = COLORS.danger;
    }

    return colors;
  };

  return (
    <motion.button
      animate={getColors(false)}
      whileHover={getColors(true)}
      className={clsx(
        "py-2 h-fit px-4 rounded-lg border text-sm flex items-center gap-3 cursor-pointer disabled:cursor-auto justify-center outline-none ring-0 ring-inset focus:ring-1 transition-[box-shadow]",
        {
          "ring-primary-400": btnType === "secondary",
          "ring-white": btnType === "primary",
        },
        {
          "flex-row-reverse": reverse,
        },
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
      {icon && (
        <div className="w-5 aspect-square">
          <Icon type={icon} />
        </div>
      )}
    </motion.button>
  );
};

export default Button;
