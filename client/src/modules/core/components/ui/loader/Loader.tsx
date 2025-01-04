import clsx from "clsx";
import "./loader.css";

interface Props {
  text?: string;
  scale?: string;
  white?: boolean;
  whiteOnResponsive?: boolean;
  delay?: boolean;
}

const Loader = ({
  text = "Cargando...",
  scale,
  white,
  whiteOnResponsive,
  delay,
}: Props) => {
  return (
    <div
      style={{
        scale,
      }}
      className={clsx(
        "w-full h-full flex flex-col gap-20 justify-center items-center",
        {
          "text-primary-800 dark:text-primary-400": !white,
          "text-primary-300 dark:text-primary-700": white,
          "max-sm:text-primary-400": whiteOnResponsive,
        },
        {
          "animate-[appear_2s]": delay,
        }
      )}
    >
      <span className="loader" />
      {text && (
        <p
          className={clsx(
            "text-sm font-medium text-alto-800 dark:text-alto-200",
            {
              "max-sm:text-alto-50":
                whiteOnResponsive,
            }
          )}
        >
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;
