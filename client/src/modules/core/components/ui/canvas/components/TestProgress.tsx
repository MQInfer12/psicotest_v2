import { COLORS } from "@/modules/core/constants/COLORS";
import { motion } from "framer-motion";

interface Props {
  totalPreguntas: number;
  preguntaIndex: number;
  finished: boolean;
}

const TestProgress = ({ preguntaIndex, totalPreguntas, finished }: Props) => {
  return (
    <div className="w-full flex items-center gap-4">
      <div className="w-20 flex justify-center">
        <small>
          P: {preguntaIndex + 1} / {totalPreguntas}
        </small>
      </div>
      <div className="flex-1 h-2 bg-alto-100 rounded-md overflow-hidden">
        <motion.span
          animate={{
            width: `${((preguntaIndex + 1) / totalPreguntas) * 100}%`,
            backgroundColor: !finished ? COLORS.primary[700] : COLORS.success,
          }}
          className="block h-full"
        />
      </div>
    </div>
  );
};

export default TestProgress;
