import { motion } from "framer-motion";
import IconMessage from "../../../icons/IconMessage";
import Icon from "../../../icons/Icon";
import { TEST_CAROUSEL_VARIANT } from "../constants/TEST_CAROUSEL_VARIANT";

interface Props {
  direction: number;
  text: string;
}

const TestTimeout = ({ direction, text }: Props) => {
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
        icon={Icon.Types.CLOCK}
        message={text}
        textColor="primary"
        delay={0.5}
      />
    </motion.div>
  );
};

export default TestTimeout;
