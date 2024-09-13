import { CANVAS_PADDING } from "./constants/CANVAS";
import Test from "./Test";
import { motion } from "framer-motion";

interface Props {
  children?: React.ReactNode;
}

interface TitleProps extends Props {
  subtitle?: string;
}

const Canvas = ({ children }: Props) => {
  return (
    <div className="flex flex-col items-center px-10 pb-10">
      <motion.div
        layoutId="card"
        className="flex h-full flex-col items-center w-[1140px] max-w-full gap-8 bg-alto-50 border-t-8 border-primary-700 rounded-lg p-10 shadow-xl"
      >
        {children}
      </motion.div>
    </div>
  );
};

const Title = ({ subtitle, children }: TitleProps) => {
  return (
    <div className="flex flex-col">
      <h2 className="text-3xl font-bold text-primary-900">{children}</h2>
      {subtitle && <h3 className="text-center font-semibold text-alto-600">{subtitle}</h3>}
    </div>
  );
};

const Subtitle = ({ children }: Props) => {
  return (
    <h3
      style={{
        paddingInline: CANVAS_PADDING,
      }}
      className="w-full text-xl font-medium text-primary-800 border-b-2 border-primary-200 pb-2"
    >
      {children}
    </h3>
  );
};

const Paragraph = ({ children }: Props) => {
  return (
    <p
      style={{
        paddingInline: CANVAS_PADDING,
      }}
      className="w-full leading-7 text-base text-alto-900"
    >
      {children}
    </p>
  );
};

Canvas.Title = Title;
Canvas.Subtitle = Subtitle;
Canvas.Paragraph = Paragraph;
Canvas.Test = Test;

export default Canvas;
