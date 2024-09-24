import "./loader.css";

interface Props {
  text?: string;
  scale?: string;
}

const Loader = ({ text = "Cargando...", scale }: Props) => {
  return (
    <div
      style={{
        scale,
      }}
      className="w-full h-full flex flex-col gap-20 justify-center items-center"
    >
      <span className="loader" />
      {text && <p className="text-sm font-medium text-alto-800">{text}</p>}
    </div>
  );
};

export default Loader;
