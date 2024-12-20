import clsx from "clsx";
import { ForwardedRef, forwardRef, useId } from "react";
import Appear from "../utils/Appear";

interface GeneralProps {
  label?: string;
  error?: string;
  inputSize?: "base" | "small";
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: "text" | "date" | "number" | "email" | "time";
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
  const { label, className, error, inputSize = "base", ...rest } = props;
  const forwardProps = rest as InputProps | SelectProps;

  return (
    <div className="flex flex-col w-full">
      {label && (
        <div className="pb-2 flex justify-between gap-4">
          <label
            className="text-xs font-semibold whitespace-nowrap"
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
            "w-full border border-alto-300/70 rounded-lg outline-none bg-white",
            "ring-0 ring-inset ring-primary-400 focus:ring-1 transition-all duration-300",
            {
              "text-sm h-[38px] px-3": inputSize === "base",
              "text-xs h-[34px] px-2": inputSize === "small",
            },
            "disabled:bg-alto-100 disabled:border-primary-200",
            className
          )}
          autoComplete="off"
          {...forwardProps}
        >
          {props.children}
        </select>
      ) : (
        <input
          id={id}
          ref={ref}
          type="text"
          autoComplete="off"
          className={clsx(
            "w-full border border-alto-300/70 rounded-lg outline-none bg-white",
            "ring-0 ring-inset ring-primary-400 focus:ring-1 transition-all duration-300",
            {
              "text-sm py-2 px-3": inputSize === "base",
              "text-xs py-2 px-3": inputSize === "small",
            },
            "disabled:bg-alto-100 disabled:border-primary-200",
            className
          )}
          {...forwardProps}
        />
      )}
    </div>
  );
});

export default Input;
