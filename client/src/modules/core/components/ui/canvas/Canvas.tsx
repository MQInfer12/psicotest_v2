import { CANVAS_PADDING } from "./constants/CANVAS";
import Test from "./Test";

interface Props {
  children?: React.ReactNode;
}

const Canvas = ({ children }: Props) => {
  return (
    <div className="flex flex-col items-center px-10 pb-10">
      <div className="flex flex-col items-center w-[1140px] max-w-full gap-8 bg-alto-50 rounded-xl p-10 shadow-xl">
        {children}
      </div>
    </div>
  );
};

const Title = ({ children }: Props) => {
  return (
    <h2 className="text-3xl font-bold text-primary-900">{children}</h2>
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
