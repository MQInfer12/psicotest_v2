import { createContext, useContext, useEffect, useState } from "react";

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
}

const ThemeContext = createContext<Ctx | null>(null);

interface Props {
  children: JSX.Element;
}

const mm = window.matchMedia("(prefers-color-scheme: dark)");

export const ThemeContextProvider = ({ children }: Props) => {
  const localState = localStorage.getItem("psicotest_theme");
  const [state, setTheme] = useState<ThemeState>(
    localState
      ? JSON.parse(localState)
      : {
          auto: true,
          theme: mm.matches ? "dark" : "light",
        }
  );
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

  return (
    <ThemeContext.Provider
      value={{
        index: auto ? 0 : theme === "light" ? 1 : 2,
        theme,
        setTheme,
        activateAuto,
        dark: theme === "dark",
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
