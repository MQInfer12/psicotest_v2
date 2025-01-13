import { AnimatePresence, motion } from "framer-motion";

interface Props {
  open: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  onMouseEnter?: () => void;
  disabled?: boolean;
}

const Appear = ({ open, className, children, onClick, disabled }: Props) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.span
          initial={{ opacity: disabled ? 1 : 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: disabled ? 1 : 0 }}
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
