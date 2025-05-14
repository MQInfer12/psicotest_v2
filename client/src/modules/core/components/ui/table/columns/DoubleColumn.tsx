import clsx from "clsx";
import Icon, { ICON } from "../../../icons/Icon";
import { motion } from "framer-motion";

interface Props {
  text: string;
  textTitleDetail?: string;
  textColor?: "alto" | "success" | "danger";
  small?: string;
  smallTitleDetail?: string;
  onClickSmall?: () => void;
  icon?: ICON;
  textLayoutId?: string;
}

const DoubleColumn = ({
  text,
  textTitleDetail,
  textColor,
  small,
  smallTitleDetail,
  icon,
  textLayoutId,
  onClickSmall,
}: Props) => {
  return (
    <div className="flex-1 flex flex-col gap-1 overflow-hidden">
      <motion.strong
        layoutId={textLayoutId}
        className={clsx(
          "font-medium whitespace-nowrap overflow-hidden text-ellipsis",
          {
            "text-success": textColor === "success",
            "text-danger": textColor === "danger",
          }
        )}
        title={`${text}${textTitleDetail ? ` (${textTitleDetail})` : ""}`}
      >
        {text}
      </motion.strong>
      {small && (
        <div
          onClick={onClickSmall}
          className={clsx(
            "text-[10px] text-alto-700 dark:text-alto-400 overflow-hidden whitespace-nowrap flex gap-1",
            onClickSmall && "hover:underline cursor-pointer"
          )}
          title={`${small}${smallTitleDetail ? ` (${smallTitleDetail})` : ""}`}
        >
          {icon && (
            <div className="w-3 aspect-square">
              <Icon type={icon} />
            </div>
          )}
          <p>{small}</p>
        </div>
      )}
    </div>
  );
};

export default DoubleColumn;
