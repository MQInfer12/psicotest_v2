import Icon from "@/modules/core/components/icons/Icon";
import { useThemeContext } from "@/modules/core/context/ThemeContext";
import clsx from "clsx";
import { motion } from "framer-motion";

interface Props {
  open: boolean;
}

const ThemeButton = ({ open }: Props) => {
  const { index, activateAuto, setTheme } = useThemeContext();

  const handleThemeChange = () => {
    switch (index) {
      case 0:
        setTheme({
          auto: false,
          theme: "light",
        });
        break;
      case 1:
        setTheme({
          auto: false,
          theme: "dark",
        });
        break;
      case 2:
        activateAuto();
        break;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center py-10 w-full">
      <motion.button
        key={index}
        layout="preserve-aspect"
        className="flex border border-alto-300/70 dark:border-alto-800 p-1 rounded-full gap-2 relative isolate"
        style={{
          justifyContent: ["flex-start", "center", "flex-end"][index],
        }}
        onClick={handleThemeChange}
      >
        <motion.span
          key={String(open)}
          layoutId={open ? "theme-button-selector" : undefined}
          className="absolute w-8 aspect-square bg-primary-800 -z-10 rounded-full"
        />
        {(open || index === 0) && (
          <span
            className={clsx("w-8 aspect-square rounded-full p-1", {
              "text-alto-50 dark:text-alto-50": index === 0,
              "dark:text-alto-300": index !== 0,
            })}
          >
            <Icon type={Icon.Types.COMPUTER} />
          </span>
        )}
        {(open || index === 1) && (
          <span
            className={clsx("w-8 aspect-square rounded-full p-1", {
              "text-alto-50 dark:text-alto-50": index === 1,
              "dark:text-alto-300": index !== 1,
            })}
          >
            <Icon type={Icon.Types.SUN} />
          </span>
        )}
        {(open || index === 2) && (
          <span
            className={clsx("w-8 aspect-square rounded-full p-1", {
              "text-alto-50 dark:text-alto-50": index === 2,
              "dark:text-alto-300": index !== 2,
            })}
          >
            <Icon type={Icon.Types.MOON} />
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default ThemeButton;
