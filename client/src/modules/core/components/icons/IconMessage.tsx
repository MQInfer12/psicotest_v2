import clsx from "clsx";
import Icon, { ICON } from "./Icon";
import { motion } from "framer-motion";

interface Props {
  icon: ICON;
  message: string;
  textColor?: "primary" | "danger" | "success";
  delay?: number;
}

const IconMessage = ({
  icon,
  message,
  textColor = "primary",
  delay,
}: Props) => {
  return (
    <div className="flex flex-col items-center gap-5">
      <motion.div
        initial={{ opacity: 0, y: "-50%" }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className={clsx("w-40 aspect-square", {
          "text-primary-800": textColor === "primary",
          "text-danger": textColor === "danger",
          "text-success": textColor === "success",
        })}
      >
        <Icon type={icon} />
      </motion.div>
      <p className="text-sm font-medium text-alto-800">{message}</p>
    </div>
  );
};

export default IconMessage;
