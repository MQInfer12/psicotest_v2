import Psicotest from "@/assets/images/logo.png";
import Appear from "@/modules/core/components/utils/Appear";

interface Props {
  showText?: boolean;
}

const Logo = ({ showText = true }: Props) => {
  return (
    <h1 className="text-xl font-light flex gap-2">
      <img className="w-14 h-auto" alt="psicotest-logo" src={Psicotest} />
      <Appear open={showText} className="flex flex-col dark:text-alto-50">
        <div>
          <span className="font-semibold">Psico</span>test
        </div>
        <small className="text-[10px] self-end opacity-80 leading-none">
          v{APP_VERSION}
        </small>
      </Appear>
    </h1>
  );
};

export default Logo;
