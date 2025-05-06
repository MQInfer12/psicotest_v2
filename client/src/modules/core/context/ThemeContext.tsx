import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  DEFAULT_COLORS,
  PRIMARY_COLORS_CLASSIC,
  PRIMARY_COLORS_UNIFRANZ,
} from "../constants/COLORS";

import LogoUnifranzDark from "@/assets/images/logo-orange-dark.png";
import LogoClassic from "@/assets/images/logo.png";
import TitleUnifranz from "@/assets/images/neurall-orange.png";
import TitleClassic from "@/assets/images/neurall.png";

type Theme = "light" | "dark";

interface ThemeState {
  auto: boolean;
  theme: Theme;
}

interface Ctx {
  index: number;
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<ThemeState>>;
  activateAuto: () => void;
  dark: boolean;
  COLORS: {
    primary: Record<number, string>;
    alto: Record<number, string>;
    danger: string;
    success: string;
    warning: string;
  };
  images: {
    logo: string;
    title: string;
  };
}

const ThemeContext = createContext<Ctx | null>(null);

interface Props {
  children: JSX.Element;
}

const mm = window.matchMedia("(prefers-color-scheme: dark)");

export const ThemeContextProvider = ({ children }: Props) => {
  const getLocalState = useCallback((): ThemeState => {
    const localState = localStorage.getItem("psicotest_theme");
    if (localState) {
      const { auto, theme } = JSON.parse(localState) as ThemeState;
      return {
        auto,
        theme: auto ? (mm.matches ? "dark" : "light") : theme,
      };
    } else {
      return {
        auto: true,
        theme: mm.matches ? "dark" : "light",
      };
    }
  }, []);

  const [state, setTheme] = useState<ThemeState>(getLocalState());
  const { auto, theme } = state;

  const activateAuto = () => {
    setTheme({
      auto: true,
      theme: mm.matches ? "dark" : "light",
    });
  };

  useEffect(() => {
    const listener = (e: MediaQueryListEvent) => {
      if (auto) {
        setTheme((prev) => ({
          ...prev,
          theme: e.matches ? "dark" : "light",
          primaryColor: e.matches ? "unifranz" : "classic",
        }));
      }
    };

    mm.addEventListener("change", listener);
    return () => {
      mm.removeEventListener("change", listener);
    };
  }, [auto]);

  useEffect(() => {
    localStorage.setItem("psicotest_theme", JSON.stringify(state));
  }, [state]);

  document.documentElement.classList.toggle("dark", theme === "dark");

  const dark = theme === "dark";

  const actualColor = dark ? PRIMARY_COLORS_UNIFRANZ : PRIMARY_COLORS_CLASSIC;

  const convertColorFormat = <T extends string>(
    format: "rgb" | "hsl",
    colorObject: Record<string, { [key in T]: string }>
  ): Record<string, string> => {
    return Object.entries(colorObject).reduce(
      (acc: Record<string, string>, [key, value]) => {
        acc[key] = value[format as T];
        return acc;
      },
      {}
    );
  };

  const actualColorRgb = convertColorFormat("rgb", actualColor);
  const actualColorHsl = convertColorFormat("hsl", actualColor);

  useLayoutEffect(() => {
    const changeColor = () => {
      const r = document.querySelector(":root") as HTMLElement;
      if (!r) return;
      Object.keys(actualColorHsl).forEach((num) => {
        r.style.setProperty(`--primary-${num}`, actualColorHsl[num]);
      });
    };
    changeColor();
  }, [dark]);

  return (
    <ThemeContext.Provider
      value={{
        index: auto ? 0 : theme === "light" ? 1 : 2,
        theme,
        setTheme,
        activateAuto,
        dark,
        COLORS: { ...DEFAULT_COLORS, primary: actualColorRgb },
        images: {
          logo: dark ? LogoUnifranzDark : LogoClassic,
          title: dark ? TitleUnifranz : TitleClassic,
        },
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("this contexts must be used whitin a ThemeContextProvider");
  }
  return context;
};
