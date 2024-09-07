import Psicotest from "@/assets/images/logo.png";

const Logo = () => {
  return (
    <h1 className="text-xl font-light flex gap-2">
      <img className="h-10 w-auto" alt="psicotest-logo" src={Psicotest} />
      <div className="flex flex-col">
        <div>
          <span className="font-semibold">Psico</span>test
        </div>
        <small className="text-[10px] -mt-3 self-end opacity-80">v2.0</small>
      </div>
    </h1>
  );
};

export default Logo;
