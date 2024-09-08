import { createPortal } from "react-dom";
import Appear from "../../utils/Appear";
import { motion } from "framer-motion";

interface Props {
  open: boolean;
  children: React.ReactNode;
  close: () => void;
}

const Modal = ({ open, children, close }: Props) => {
  return createPortal(
    <Appear
      open={open}
      className="bg-black/40 fixed inset-0 flex items-center justify-center"
      onClick={close}
    >
      <motion.section
        initial={{
          scale: 0,
        }}
        animate={{
          scale: 1,
        }}
        onClick={(e) => e.stopPropagation()}
        className="w-96 max-w-full bg-alto-50 rounded-lg"
      >
        <header className="flex justify-between">
          <strong>Título del modal</strong>
          <button onClick={close}>X</button>
        </header>
        <main>{children}</main>
      </motion.section>
    </Appear>,
    document.getElementById("modal") || document.body
  );
};

export default Modal;
