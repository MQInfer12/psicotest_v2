import clsx from "clsx";
import { ForwardedRef, forwardRef, useId } from "react";
import Appear from "../utils/Appear";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  type?: "select";
  error?: string;
}

type Props = InputProps | SelectProps;

const isSelect = (props: Props): props is SelectProps => {
  return props.type === "select";
};

const Input = forwardRef((props: Props, ref: ForwardedRef<any>) => {
  const id = useId();
  const { label, className, error } = props;

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
      {isSelect(props) ? (
        <select
          id={id}
          ref={ref}
          className={clsx(
            "w-full border border-alto-300/70 text-sm rounded-lg outline-none py-2 px-3 bg-white",
            "ring-0 ring-inset ring-primary-400 focus:ring-1 transition-all duration-300",
            className
          )}
          autoComplete="off"
          {...props}
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
            "w-full border border-alto-300/70 text-sm rounded-lg outline-none py-2 px-3 bg-white",
            "ring-0 ring-inset ring-primary-400 focus:ring-1 transition-all duration-300",
            className
          )}
          {...props}
        />
      )}
    </div>
  );
});

export default Input;
