import clsx from "clsx";
import { ForwardedRef, forwardRef, useId } from "react";
import Appear from "../utils/Appear";
import Icon, { ICON } from "../icons/Icon";

interface GeneralProps {
  label?: string;
  error?: string;
  inputSize?: "base" | "small";
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: "text" | "date" | "number" | "email" | "time";
  icon?: ICON;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  type?: "select";
}

type Props = (InputProps | SelectProps) & GeneralProps;

const isSelect = (props: InputProps | SelectProps): props is SelectProps => {
  return props.type === "select";
};

const Input = forwardRef((props: Props, ref: ForwardedRef<any>) => {
  const id = useId();
  const {
    label,
    className,
    error,
    inputSize = "base",
    required,
    ...rest
  } = props;
  const forwardProps = rest as InputProps | SelectProps;

  return (
    <div className="flex flex-col w-full">
      {label && (
        <div className="pb-2 flex justify-between gap-2">
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
      {isSelect(forwardProps) ? (
        <select
          id={id}
          ref={ref}
          className={clsx(
            "w-full border border-alto-300/70 dark:border-alto-800 rounded-lg outline-none bg-white dark:bg-alto-1000",
            "ring-0 ring-inset ring-primary-400 focus:ring-1 transition-all duration-300",
            {
              "text-sm h-[38px] px-2": inputSize === "base",
              "text-xs h-[34px] px-2": inputSize === "small",
            },
            "disabled:bg-alto-200/60 dark:disabled:bg-alto-900 disabled:border-primary-200 dark:disabled:border-alto-800",
            "text-alto-950 dark:text-alto-50",
            className
          )}
          autoComplete="off"
          {...forwardProps}
        >
          {props.children}
        </select>
      ) : (
        <div
          className={clsx("relative isolate", {
            contents: !forwardProps.icon,
          })}
        >
          <input
            id={id}
            ref={ref}
            type="text"
            autoComplete="off"
            className={clsx(
              "w-full border border-alto-300/70 dark:border-alto-800 rounded-lg outline-none bg-white dark:bg-alto-1000 dark:[color-scheme:dark] peer",
              "ring-0 ring-inset ring-primary-400 focus:ring-1 transition-all duration-300",
              "px-3",
              {
                "text-sm py-2 h-[38px]": inputSize === "base",
                "text-xs py-2 px-3 h-[34px]": inputSize === "small",
                "pl-[34px]": inputSize === "base" && forwardProps.icon,
                "pl-[30px]": inputSize === "small" && forwardProps.icon,
              },
              "disabled:bg-alto-200/60 dark:disabled:bg-alto-900 disabled:border-primary-200 dark:disabled:border-alto-800",
              "text-alto-950 dark:text-alto-50 placeholder-alto-500 dark:placeholder-alto-700",
              className
            )}
            {...forwardProps}
          />
          {forwardProps.icon && (
            <div
              className={clsx(
                "top-0 left-0 absolute z-10 aspect-square p-2 text-alto-400 peer-focus:text-primary-500 transition-all duration-300",
                {
                  "h-[38px]": inputSize === "base",
                  "h-[34px]": inputSize === "small",
                }
              )}
            >
              <Icon type={forwardProps.icon} />
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default Input;
