import clsx from "clsx";
import Button from "./Button";
import { useEffect, useId, useState } from "react";
import Appear from "../utils/Appear";
import Placeholder from "@assets/images/placeholder.png";
import Icon, { ICON } from "../icons/Icon";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  defaultsrc?: string;
  state: File | null;
  maxsize?: number;
  setstate: (newState: File | null) => void;
  validFormats?: string[];
  row?: boolean;
  inputType?: "image" | "inline";
  icon?: ICON;
}

const InputFile = (props: Props) => {
  const id = useId();
  const {
    label,
    error,
    required,
    className,
    disabled,
    defaultsrc,
    maxsize = 2048,
    state,
    setstate,
    row,
    inputType = "image",
    icon,
  } = props;

  const [preview, setPreview] = useState<null | string>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);

  const changeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    if (e.target.files[0].size > maxsize * 1024) {
      setSizeError(`Tamaño supera ${maxsize / 1024}MB`);
      setstate(null);
      return;
    }
    setSizeError(null);
    setstate(e.target.files[0]);
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

  const hasImage = preview ?? defaultsrc;

  const realError = sizeError ?? error;

  const trueRow = row || inputType === "inline";

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {label && (
        <div
          className={clsx("pb-2 flex justify-between gap-2", {
            "w-64": row,
          })}
        >
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
      <div
        className={clsx("flex flex-1 overflow-hidden", {
          "flex-col": !trueRow,
          "gap-4": trueRow,
        })}
      >
        {inputType === "inline" ? (
          <div
            className={clsx("relative isolate flex-1 overflow-hidden", {
              contents: !icon,
            })}
          >
            <button
              className={clsx(
                "text-start w-full border-2 border-dashed border-alto-300/70 dark:border-alto-800 rounded-lg outline-none bg-white dark:bg-alto-1000 dark:[color-scheme:dark] peer",
                "ring-0 ring-inset ring-primary-400 focus:ring-1 transition-all duration-300",
                "px-3",
                "text-sm py-2 h-[38px]",
                {
                  "pl-[34px]": !!icon,
                },
                "disabled:bg-alto-200/60 dark:disabled:bg-alto-900 disabled:border-primary-200 dark:disabled:border-alto-800",
                "text-alto-950 dark:text-alto-50 placeholder-alto-500 dark:placeholder-alto-700",
                "whitespace-nowrap text-ellipsis overflow-hidden",
                className
              )}
              onClick={selectInput}
            >
              {state
                ? state.name
                : (defaultsrc?.split("/").pop() ??
                  `Seleccionar archivo (max. ${maxsize / 1024}MB)`)}
            </button>
            {icon && (
              <div
                className={clsx(
                  "h-[38px] top-0 left-0 absolute z-10 aspect-square p-2 text-alto-400 peer-focus:text-primary-500 transition-all duration-300"
                )}
              >
                <Icon type={icon} />
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={selectInput}
            tabIndex={-1}
            disabled={disabled}
            className={clsx(
              "relative overflow-hidden border-dashed border-2 border-alto-300/70 dark:border-alto-800 rounded-lg outline-none bg-white dark:bg-alto-1000",
              "transition-all duration-300",
              "h-[38px]",
              "disabled:bg-alto-200/60 dark:disabled:bg-alto-900 disabled:border-primary-200 dark:disabled:border-alto-800",
              "text-alto-950 dark:text-alto-50",
              {
                "flex-1 w-full": !row,
                "flex-1 min-h-32 max-h-32 max-w-64": row,
              },
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
              <p className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-40 text-xs whitespace-nowrap">
                Tamaño máximo: {maxsize / 1024}MB
              </p>
            )}
          </button>
        )}

        <div
          className={clsx("flex flex-col", {
            "self-end": row,
          })}
        >
          <Button
            className={clsx(!trueRow && "mt-4")}
            type="button"
            onClick={selectInput}
            disabled={disabled}
            btnType={hasImage ? "secondary" : "primary"}
          >
            {hasImage
              ? `Cambiar ${inputType === "inline" ? "archivo" : "imagen"}`
              : `Seleccionar ${inputType === "inline" ? "archivo" : "imagen"}`}
          </Button>
        </div>
        <input
          id={id}
          onChange={changeFile}
          {...{ ...props, setstate: undefined }}
          className="hidden"
          type="file"
        />
      </div>
    </div>
  );
};

export default InputFile;
