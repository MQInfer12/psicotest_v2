import { motion } from "framer-motion";
import IconMessage from "../../../icons/IconMessage";
import Icon from "../../../icons/Icon";
import { TEST_CAROUSEL_VARIANT } from "../constants/TEST_CAROUSEL_VARIANT";

interface Props {
  direction: number;
}

const TestFinishPage = ({ direction }: Props) => {
  return (
    <motion.div
      variants={TEST_CAROUSEL_VARIANT}
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
