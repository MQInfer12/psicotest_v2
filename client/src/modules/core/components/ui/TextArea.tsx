import clsx from "clsx";
import { ForwardedRef, forwardRef, useId } from "react";
import Appear from "../utils/Appear";
import Icon, { ICON } from "../icons/Icon";

interface Props extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  inputSize?: "base" | "small";
  height?: number;
  containerClassName?: string;
  icon?: ICON;
}

const TextArea = forwardRef((props: Props, ref: ForwardedRef<any>) => {
  const id = useId();
  const {
    label,
    className,
    error,
    inputSize = "base",
    required,
    height = 192,
    containerClassName,
    icon,
    ...rest
  } = props;

  return (
    <div className={clsx("flex flex-col w-full", containerClassName)}>
      {label && (
        <div className="pb-2 flex justify-between gap-4">
          <label
            className={clsx(
              "text-xs font-semibold whitespace-nowrap text-alto-950 dark:text-alto-50",
              {
                "after:content-['_*'] after:text-primary-500 dark:after:text-primary-400":
                  required,
              }
            )}
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
      <div
        className={clsx("flex-col flex-1 relative isolate", {
          contents: !icon,
          flex: !!icon,
        })}
      >
        <textarea
          id={id}
          ref={ref}
          type="text"
          autoComplete="off"
          className={clsx(
            "w-full border border-alto-300/70 dark:border-alto-800 rounded-lg outline-none bg-white dark:bg-alto-1000 dark:[color-scheme:dark] peer",
            "ring-0 ring-inset ring-primary-400 focus:ring-1 transition-colors duration-300",
            "px-3",
            {
              "text-sm py-2": inputSize === "base",
              "text-xs py-2": inputSize === "small",
              "pl-[34px]": inputSize === "base" && icon,
              "pl-[30px]": inputSize === "small" && icon,
            },
            "disabled:bg-alto-200/60 dark:disabled:bg-alto-900 disabled:border-primary-200 dark:disabled:border-alto-800",
            "text-alto-950 dark:text-alto-50 placeholder-alto-400/80 dark:placeholder-alto-700",
            className
          )}
          style={{
            height,
          }}
          {...rest}
        />
        {icon && (
          <div
            className={clsx(
              "top-0 left-0 absolute z-10 aspect-square p-2 text-alto-400 peer-focus:text-primary-500 transition-all duration-300",
              {
                "h-[38px]": inputSize === "base",
                "h-[34px]": inputSize === "small",
              }
            )}
          >
            <Icon type={icon} />
          </div>
        )}
      </div>
    </div>
  );
});

export default TextArea;
