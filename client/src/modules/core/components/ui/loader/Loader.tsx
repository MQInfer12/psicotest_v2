import clsx from "clsx";
import "./loader.css";

interface Props {
  text?: string;
  scale?: string;
  white?: boolean;
}

const Loader = ({ text = "Cargando...", scale, white }: Props) => {
  return (
    <div
      style={{
        scale,
      }}
      className={clsx(
        "w-full h-full flex flex-col gap-20 justify-center items-center",
        {
          "text-primary-800": !white,
          "text-primary-300": white,
        }
      )}
    >
      <span className="loader" />
      {text && <p className="text-sm font-medium text-alto-800">{text}</p>}
    </div>
  );
};

export default Loader;
