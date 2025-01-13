import clsx from "clsx";
import Appear from "../utils/Appear";
import { useId } from "react";

interface Option {
  label: string;
  value: number;
}

interface Props {
  label: string;
  value: number[];
  onChange: (value: number[]) => void;
  error?: string;
  className?: string;
  options: Option[];
  required?: boolean;
}

const Checkboxes = ({
  label,
  error,
  className,
  options,
  value,
  onChange,
  required,
}: Props) => {
  const id = useId();

  const handleChange = (option: Option) => {
    const newValue = value.includes(option.value)
      ? value.filter((v) => v !== option.value)
      : [...value, option.value];
    onChange(newValue);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="pb-2 flex justify-between gap-4">
        <small
          className={clsx(
            "text-xs font-semibold whitespace-nowrap text-alto-950 dark:text-alto-50",
            {
              "after:content-['_*'] after:text-primary-500 dark:after:text-primary-400":
                required,
            }
          )}
        >
          {label}
        </small>
        <Appear open={!!error}>
          <p
            title={error}
            className="text-xs font-semibold text-danger whitespace-nowrap overflow-hidden text-ellipsis"
          >
            {error}
          </p>
        </Appear>
      </div>
      <div
        className={clsx(
          "w-full border border-alto-300/70 dark:border-alto-900 rounded-lg outline-none bg-white dark:bg-alto-1000 h-20` overflow-auto px-3 py-2 accent-primary-500 dark:accent-primary-300",
          "ring-0 ring-inset ring-primary-400 focus:ring-1 transition-all duration-300",
          "disabled:bg-alto-200/60 disabled:border-primary-200",
          className
        )}
      >
        <div className="flex flex-wrap gap-3">
          {options.map((option) => (
            <div className="flex items-center">
              <input
                id={`${id}_${option.value}`}
                type="checkbox"
                checked={value.includes(option.value)}
                value={option.value}
                onChange={() => handleChange(option)}
              />
              <label
                htmlFor={`${id}_${option.value}`}
                className="text-sm px-2 text-alto-900 dark:text-alto-200"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Checkboxes;
