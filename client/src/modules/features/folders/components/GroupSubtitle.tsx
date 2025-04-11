import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import { motion } from "framer-motion";

interface Props {
  title: string;
  onClick?: () => void;
  loading?: boolean;
}

const GroupSubtitle = ({ title, onClick, loading }: Props) => {
  return (
    <div className="h-9 flex items-center justify-between relative">
      <strong className="dark:text-alto-100">{title}</strong>
      {onClick && (
        <Button
          btnType="tertiary"
          btnSize="small"
          title="Añadir carpeta"
          icon={Icon.Types.FOLDER_ADD}
          onClick={onClick}
        />
      )}
      {loading && (
        <motion.span
          animate={{
            opacity: [0.2, 1],
            width: ["10%", "100%"],
          }}
          transition={{
            opacity: {
              duration: 1,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            },
            width: {
              duration: 1,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            },
          }}
          className="block absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] bg-primary-700"
        />
      )}
    </div>
  );
};

export default GroupSubtitle;
