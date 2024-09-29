import { motion, Variants } from "framer-motion";
import IconMessage from "../../../icons/IconMessage";
import Icon from "../../../icons/Icon";

interface Props {
  variants: Variants;
  direction: number;
}

const TestFinishPage = ({ variants, direction }: Props) => {
  return (
    <motion.div
      variants={variants}
      custom={direction}
      initial="enter"
      animate="active"
      exit="exit"
      className="absolute inset-0 flex items-center justify-center"
    >
      <IconMessage
        icon={Icon.Types.CHECK}
        message="¡Muchas gracias por completar el test!"
        textColor="success"
        delay={0.5}
      />
    </motion.div>
  );
};

export default TestFinishPage;
