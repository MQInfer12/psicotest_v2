import Psicotest from "@/assets/images/logo.png";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  showText?: boolean;
}

const Logo = ({ showText = true }: Props) => {
  return (
    <h1 className="text-xl font-light flex gap-2">
      <img className="w-14 h-auto" alt="psicotest-logo" src={Psicotest} />
      <AnimatePresence>
        {showText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col"
          >
            <div>
              <span className="font-semibold">Psico</span>test
            </div>
            <small className="text-[10px] self-end opacity-80 leading-none">
              v{APP_VERSION}
            </small>
          </motion.div>
        )}
      </AnimatePresence>
    </h1>
  );
};

export default Logo;
