import clsx from "clsx";
import Icon, { ICON } from "./Icon";
import { motion } from "framer-motion";

interface Props {
  icon: ICON;
  message: string;
  small?: string;
  textColor?: "primary" | "danger" | "success";
  delay?: number;
  children?: React.ReactNode;
}

const IconMessage = ({
  icon,
  message,
  textColor = "primary",
  delay,
  small,
  children,
}: Props) => {
  return (
    <div className="flex flex-col items-center gap-5 px-6">
      <motion.div
        initial={{ opacity: 0, y: "-50%" }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className={clsx("w-40 aspect-square", {
          "text-primary-800 dark:text-primary-400": textColor === "primary",
          "text-danger": textColor === "danger",
          "text-success": textColor === "success",
        })}
      >
        <Icon type={icon} />
      </motion.div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-md leading-normal text-center font-medium text-alto-800 dark:text-alto-200 text-balance">
          {message}
        </p>
        {small && (
          <small className="text-xs text-alto-700 dark:text-alto-300">
            {small}
          </small>
        )}
        {children}
      </div>
    </div>
  );
};

export default IconMessage;
