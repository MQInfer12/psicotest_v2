import clsx from "clsx";
import Button from "./Button";
import { useEffect, useId, useState } from "react";
import Appear from "../utils/Appear";
import Placeholder from "@assets/images/placeholder.png";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  defaultSrc?: string;
  state: File | null;
  maxSize?: number;
  setState: React.Dispatch<React.SetStateAction<File | null>>;
  validFormats?: string[];
}

const InputFile = (props: Props) => {
  const id = useId();
  const {
    label,
    error,
    required,
    className,
    disabled,
    defaultSrc,
    maxSize = 2048,
    state,
    setState,
  } = props;

  const [preview, setPreview] = useState<null | string>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);

  const changeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    if (e.target.files[0].size > maxSize * 1024) {
      setSizeError(`Tamaño de la imagen supera ${maxSize / 1024}MB`);
      setState(null);
      return;
    }
    setSizeError(null);
    setState(e.target.files[0]);
  };

  useEffect(() => {
    if (state) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(state);
      fileReader.addEventListener("load", () => {
        setPreview(fileReader.result as string);
      });
    } else {
      setPreview(null);
    }
  }, [state]);

  const selectInput = () => document.getElementById(id)?.click();

  const hasImage = preview ?? defaultSrc;

  const realError = sizeError ?? error;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
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
          <Appear open={!!realError}>
            <p
              title={realError}
              className="text-xs font-semibold text-danger whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {realError}
            </p>
          </Appear>
        </div>
      )}
      <button
        type="button"
        onClick={selectInput}
        tabIndex={-1}
        disabled={disabled}
        className={clsx(
          "relative overflow-hidden flex-1 w-full border-dashed border-2 border-alto-300/70 dark:border-alto-800 rounded-lg outline-none bg-white dark:bg-alto-1000",
          "transition-all duration-300",
          "text-sm h-[38px]",
          "disabled:bg-alto-200/60 dark:disabled:bg-alto-900 disabled:border-primary-200 dark:disabled:border-alto-800",
          "text-alto-950 dark:text-alto-50",
          className
        )}
        style={{
          backgroundImage: `url(${Placeholder})`,
          backgroundPosition: "center",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      >
        {!disabled && hasImage && (
          <img
            className={
              "w-full h-full object-cover pointer-events-none border-0"
            }
            src={hasImage}
          />
        )}
        {!hasImage && (
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-40">
            Tamaño máximo {maxSize / 1024}MB
          </p>
        )}
      </button>
      <Button
        className="mt-4"
        type="button"
        onClick={selectInput}
        disabled={disabled}
      >
        Subir imagen
      </Button>
      <input
        id={id}
        onChange={changeFile}
        {...props}
        className="hidden"
        type="file"
      />
    </div>
  );
};

export default InputFile;
