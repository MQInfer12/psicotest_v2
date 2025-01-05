import clsx from "clsx";
import Appear from "../utils/Appear";
import { ForwardedRef, forwardRef, useId } from "react";

interface Props extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  inputSize?: "base" | "small";
}

const TextArea = forwardRef((props: Props, ref: ForwardedRef<any>) => {
  const id = useId();
  const { label, className, error, inputSize = "base", ...rest } = props;

  return (
    <div className="flex flex-col w-full">
      {label && (
        <div className="pb-2 flex justify-between gap-4">
          <label
            className="text-xs font-semibold whitespace-nowrap text-alto-950 dark:text-alto-50"
            htmlFor={id}
          >
            {label}
          </label>
          <Appear open={!!error}>
            <p
              title={error}
              className="text-xs font-semibold text-danger whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {error}
            </p>
          </Appear>
        </div>
      )}
      <textarea
        id={id}
        ref={ref}
        type="text"
        autoComplete="off"
        className={clsx(
          "w-full h-56 border border-alto-300/70 dark:border-alto-800 rounded-lg outline-none bg-white dark:bg-alto-1000 dark:[color-scheme:dark]",
          "ring-0 ring-inset ring-primary-400 focus:ring-1 transition-colors duration-300",
          {
            "text-sm py-2 px-3": inputSize === "base",
            "text-xs py-2 px-3": inputSize === "small",
          },
          "disabled:bg-alto-100 dark:disabled:bg-alto-900 disabled:border-primary-200 dark:disabled:border-alto-800",
          "text-alto-950 dark:text-alto-50 placeholder-alto-500 dark:placeholder-alto-700",
          className
        )}
        {...rest}
      />
    </div>
  );
});

export default TextArea;
