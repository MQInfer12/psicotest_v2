import { useMeasureContext } from "@/modules/features/_layout/context/MeasureContext";
import { CANVAS_PADDING } from "./constants/CANVAS";
import { motion } from "framer-motion";
import Test from "./components/Test";

interface Props {
  children?: React.ReactNode;
}

interface TitleProps extends Props {
  subtitle?: string;
}

interface CanvasProps extends Props {
  layoutId?: string;
}

const Canvas = ({ children, layoutId }: CanvasProps) => {
  const { PRIVATE_PADDING_INLINE } = useMeasureContext();
  return (
    <div
      style={{
        paddingInline: PRIVATE_PADDING_INLINE,
      }}
      className="flex flex-col items-center pb-10"
    >
      <motion.div
        layoutId={layoutId}
        className="flex h-full flex-col items-center w-[1140px] max-w-full max-sm:gap-4 gap-8 bg-alto-50 dark:bg-alto-1000 border-t-8 border-primary-700 dark:border-primary-400 rounded-lg shadow-xl p-10 max-sm:p-5"
      >
        {children}
      </motion.div>
    </div>
  );
};

const Title = ({ subtitle, children }: TitleProps) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-bold text-primary-900 dark:text-primary-400">
        {children}
      </h2>
      {subtitle && (
        <h3 className="text-center font-semibold text-alto-400">{subtitle}</h3>
      )}
    </div>
  );
};

const Subtitle = ({ children }: Props) => {
  return (
    <h3
      style={{
        paddingInline: CANVAS_PADDING,
      }}
      className="self-start w-full text-base font-medium text-primary-800 dark:text-primary-300 border-b border-primary-400/30 pb-2 max-sm:text-sm"
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
      className="w-full leading-loose text-sm max-sm:text-xs max-sm:leading-loose text-alto-950 dark:text-alto-50"
    >
      {children}
    </p>
  );
};

const Vignette = ({ subtitle, children }: TitleProps) => {
  return (
    <p className="pl-10 max-sm:pl-6 leading-loose text-sm max-sm:text-xs max-sm:leading-loose text-alto-950 dark:text-alto-50">
      <span className="font-medium whitespace-nowrap text-primary-800 dark:text-primary-300">
        • {subtitle}.- <span></span>
      </span>
      {children} Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam,
      eos.
    </p>
  );
};

Canvas.Title = Title;
Canvas.Subtitle = Subtitle;
Canvas.Paragraph = Paragraph;
Canvas.Test = Test;
Canvas.Vignette = Vignette;

export default Canvas;
