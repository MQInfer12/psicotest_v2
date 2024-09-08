import { AnimatePresence, motion } from "framer-motion";

interface Props {
  open: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
}

const Appear = ({ open, className, children, onClick }: Props) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={className}
          onClick={onClick}
        >
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  );
};

export default Appear;
