import "./loader.css";

interface Props {
  text?: string;
}

const Loader = ({ text }: Props) => {
  return (
    <div className="w-full h-full flex flex-col gap-20 justify-center items-center">
      <span className="loader" />
      <p className="text-sm font-medium text-alto-800">
        {text || "Cargando..."}
      </p>
    </div>
  );
};

export default Loader;
