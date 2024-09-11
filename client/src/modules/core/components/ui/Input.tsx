import clsx from "clsx";
import { ForwardedRef, forwardRef, useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  type?: "select";
}

type Props = InputProps | SelectProps;

const isSelect = (props: Props): props is SelectProps => {
  return props.type === "select";
};

const Input = forwardRef((props: Props, ref: ForwardedRef<any>) => {
  const id = useId();
  const { label, className } = props;

  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="text-xs font-semibold pb-2" htmlFor={id}>
          {label}
        </label>
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
