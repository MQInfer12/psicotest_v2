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
}

const Checkboxes = ({
  label,
  error,
  className,
  options,
  value,
  onChange,
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
        <small className="text-xs font-semibold whitespace-nowrap">
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
          "w-full border border-alto-300/70 rounded-lg outline-none bg-white h-20` overflow-auto px-3 py-2 accent-primary-500",
          "ring-0 ring-inset ring-primary-400 focus:ring-1 transition-all duration-300",
          "disabled:bg-alto-100 disabled:border-primary-200",
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
                className="text-sm px-2 text-alto-900"
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
