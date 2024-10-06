import { createContext, useContext, useEffect, useState } from "react";
import {
  PRIVATE_ASIDE_WIDTH_THIN,
  PRIVATE_HEADER_HEIGHT,
  PRIVATE_HEADER_HEIGHT_MD,
  PRIVATE_PADDING_INLINE,
  PRIVATE_PADDING_INLINE_MD,
} from "../constants/LAYOUT_SIZES";

type Size = "normal" | "xl" | "sm" | "md";

interface Ctx {
  size: Size;
  PRIVATE_PADDING_INLINE: number;
  PRIVATE_HEADER_HEIGHT: number;
  PRIVATE_ASIDE_WIDTH_THIN: number;
}

const MeasureContext = createContext<Ctx | null>(null);

interface Props {
  children: JSX.Element;
}

const SM_BREAKPOINT = 640;
const MD_BREAKPOINT = 768;
const XL_BREAKPOINT = 1024;

export const MeasureContextProvider = ({ children }: Props) => {
  const [size, setSize] = useState<Size>(
    window.innerWidth <= MD_BREAKPOINT
      ? window.innerWidth <= SM_BREAKPOINT
        ? "sm"
        : "md"
      : "normal"
  );
  const [privatePaddingInline, setPrivatePaddingInline] = useState(
    window.innerWidth >= SM_BREAKPOINT
      ? PRIVATE_PADDING_INLINE
      : PRIVATE_PADDING_INLINE_MD
  );
  const [privateHeaderHeight, setPrivateHeaderHeight] = useState(
    window.innerWidth >= SM_BREAKPOINT
      ? PRIVATE_HEADER_HEIGHT
      : PRIVATE_HEADER_HEIGHT_MD
  );
  const [privateAsideWidthThin, setPrivateWidthThin] = useState(
    window.innerWidth >= MD_BREAKPOINT ? PRIVATE_ASIDE_WIDTH_THIN : 0
  );

  useEffect(() => {
    const resizeHandler = () => {
      setSize(
        window.innerWidth <= XL_BREAKPOINT
          ? window.innerWidth <= MD_BREAKPOINT
            ? window.innerWidth <= SM_BREAKPOINT
              ? "sm"
              : "md"
            : "xl"
          : "normal"
      );
      setPrivatePaddingInline(
        window.innerWidth >= SM_BREAKPOINT
          ? PRIVATE_PADDING_INLINE
          : PRIVATE_PADDING_INLINE_MD
      );
      setPrivateHeaderHeight(
        window.innerWidth >= SM_BREAKPOINT
          ? PRIVATE_HEADER_HEIGHT
          : PRIVATE_HEADER_HEIGHT_MD
      );
      setPrivateWidthThin(
        window.innerWidth >= MD_BREAKPOINT ? PRIVATE_ASIDE_WIDTH_THIN : 0
      );
    };

    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  return (
    <MeasureContext.Provider
      value={{
        size,
        PRIVATE_PADDING_INLINE: privatePaddingInline,
        PRIVATE_HEADER_HEIGHT: privateHeaderHeight,
        PRIVATE_ASIDE_WIDTH_THIN: privateAsideWidthThin,
      }}
    >
      {children}
    </MeasureContext.Provider>
  );
};

export const useMeasureContext = () => {
  const context = useContext(MeasureContext);
  if (!context) {
    throw new Error(
      "this contexts must be used whitin a MeasureContextProvider"
    );
  }
  return context;
};
