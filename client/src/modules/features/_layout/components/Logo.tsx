import Appear from "@/modules/core/components/utils/Appear";
import { useThemeContext } from "@/modules/core/context/ThemeContext";
import clsx from "clsx";

interface Props {
  showText?: boolean;
  slogan?: boolean;
  autoHideText?: boolean;
}

const Logo = ({ showText = true, slogan = false, autoHideText }: Props) => {
  const { images } = useThemeContext();
  return (
    <div className="flex flex-col items-center gap-2">
      <h1 className="text-xl font-light flex gap-2 items-center">
        <img
          className={clsx("w-14 h-auto")}
          alt="neurall-isotipo"
          src={images.logo}
        />
        <Appear
          open={showText}
          className={clsx(
            "flex flex-col dark:text-alto-50 mt-2 gap-1",
            autoHideText && "max-sm:hidden"
          )}
        >
          <img src={images.title} alt="neurall-logo" className="h-5 w-auto" />
          <small className="text-[10px] self-end opacity-80 leading-none">
            v{APP_VERSION}
          </small>
        </Appear>
      </h1>
      {slogan && (
        <small className="text-[10px] text-primary-950 dark:text-primary-50 font-light">
          Psicología e Innovación
        </small>
      )}
    </div>
  );
};

export default Logo;
