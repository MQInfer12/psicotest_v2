import DefaultPhoto from "@/assets/images/defaultPhoto.jpg";
import Placeholder from "@/assets/images/placeholder.png";
import { useMeasureContext } from "@/modules/features/_layout/context/MeasureContext";
import { useNavigate } from "@tanstack/react-router";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Icon from "../../icons/Icon";
import Button from "../Button";
import Test from "./components/Test";
import { CANVAS_PADDING } from "./constants/CANVAS";
import { useUserContext } from "@/modules/features/auth/context/UserContext";
import ShareCanvas from "./components/ShareCanvas";

interface Props {
  children?: React.ReactNode;
}

interface TitleProps extends Props {
  subtitle?: string;
  photoSrc?: string | null;
  coverSrc?: string;
  description?: string | null;
  showCover?: boolean;
  coverJsx?: React.ReactNode;
  shareLink?: string;
}

interface VigetteProps extends Props {
  subtitle?: string;
}

interface CanvasProps extends Props {
  layoutId?: string;
  withFooter?: boolean;
  type: "test" | "blog" | "privacy";
  shareLink?: string;
}

interface FooterProps {
  shareLink?: string;
}

interface ImageProps {
  src: string;
  alt: string;
  description?: string;
}

const Canvas = ({
  children,
  withFooter = false,
  layoutId,
  type,
  shareLink,
}: CanvasProps) => {
  const { PRIVATE_PADDING_INLINE } = useMeasureContext();
  const canvasDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasDivRef.current) return;

    const allLi = canvasDivRef.current.querySelectorAll("li");
    allLi.forEach((li) => {
      if (!li.nextElementSibling || li.nextElementSibling.tagName !== "LI") {
        li.classList.add("mb-8");
      }
    });
  }, []);

  return (
    <div
      style={{
        paddingInline: PRIVATE_PADDING_INLINE,
      }}
      className="flex flex-col items-center pb-10 max-sm:!p-0 tracking-[.1px]"
    >
      <motion.div
        ref={canvasDivRef}
        layoutId={layoutId}
        className="flex h-full flex-col max-sm:border-b-2 items-center w-[1140px] max-w-full bg-alto-50 dark:bg-alto-1000 border-t-8 border-primary-700 dark:border-primary-400 rounded-lg shadow-xl shadow-alto-950/20 dark:shadow-alto-50/10 p-10 max-sm:p-4 max-sm:py-8 max-sm:rounded-none relative overflow-hidden isolate"
      >
        {children}
        {withFooter && <Footer shareLink={shareLink} />}
        <div className="w-40 h-40 absolute -top-10 -right-10 text-primary-200 opacity-40 -z-10 dark:text-primary-700 dark:opacity-20">
          <Icon
            type={
              {
                test: Icon.Types.BRAIN,
                blog: Icon.Types.BLOG,
                privacy: Icon.Types.LOCK,
              }[type]
            }
          />
        </div>
      </motion.div>
    </div>
  );
};

const Title = ({
  subtitle,
  children,
  photoSrc,
  coverSrc,
  description,
  showCover,
  coverJsx,
  shareLink,
}: TitleProps) => {
  return (
    <div className="flex flex-col items-center pb-8 w-full">
      <h2 className="max-sm:text-xl text-3xl font-bold text-primary-900 dark:text-primary-400 text-center leading-[1.3]">
        {children}
      </h2>
      {subtitle && (
        <h3 className="max-sm:text-sm text-center font-semibold text-alto-400 flex gap-4 items-center mt-2">
          {photoSrc && (
            <img
              className="w-8 h-8 border border-alto-800/20 dark:border-alto-300/90 rounded-md"
              src={photoSrc ?? DefaultPhoto}
              onError={(event) => {
                event.currentTarget.src = DefaultPhoto;
              }}
            />
          )}
          {subtitle}
        </h3>
      )}
      {description && (
        <small className="text-center pt-4 text-alto-950 dark:text-alto-50 leading-loose text-sm max-sm:text-xs max-sm:leading-loose font-light">
          {description}
        </small>
      )}
      {showCover && (
        <div className="relative isolate w-full h-[560px] my-8 rounded-xl overflow-hidden shadow-md shadow-alto-950/20 dark:shadow-alto-50/10 border-2 border-alto-800/20 dark:border-alto-300/90 flex items-end">
          <img
            src={coverSrc}
            className="w-full h-full object-cover -z-20 absolute top-0 left-0"
            onError={(event) => {
              event.currentTarget.src = Placeholder;
            }}
          />
          <span className="-z-10 h-[100%] w-full absolute bottom-0 left-0 bg-gradient-to-b from-transparent to-primary-1000/80" />
          {coverJsx}
        </div>
      )}
      {shareLink && <ShareCanvas shareLink={shareLink} />}
    </div>
  );
};

const Subtitle = ({ children }: Props) => {
  return (
    <h3
      style={{
        marginInline: CANVAS_PADDING,
      }}
      className="self-start text-base text-primary-800 dark:text-primary-300 border-primary-400/30 max-sm:text-sm mb-4 mt-4"
    >
      {children}
    </h3>
  );
};

const Paragraph = ({ children }: Props) => {
  return (
    <p
      style={{
        paddingInline: CANVAS_PADDING,
      }}
      className="w-full leading-loose text-sm max-sm:text-xs max-sm:leading-loose text-alto-950 font-light dark:text-alto-50 mb-4"
    >
      {children}
    </p>
  );
};

const Vignette = ({ subtitle, children }: VigetteProps) => {
  return (
    <li className="list-none canvas-vignette self-start pl-12 max-sm:pl-6 leading-loose text-sm font-light max-sm:text-xs max-sm:leading-loose text-alto-950 dark:text-alto-50 mb-2">
      <span className="font-normal whitespace-nowrap text-primary-800 dark:text-primary-300">
        • {subtitle ? `${subtitle} •` : ""}{" "}
      </span>
      {children}
    </li>
  );
};

const Image = ({ src, alt, description }: ImageProps) => {
  return (
    <div className="my-8 relative max-w-[80%] max-sm:max-w-full max-h-[440px] rounded-xl overflow-hidden shadow-md shadow-alto-950/20 dark:shadow-alto-50/10 border-2 border-alto-800/20 dark:border-alto-300/90">
      <img src={src} alt={alt} className="w-full h-full object-contain -z-10" />
      <span className="h-[100%] w-full absolute bottom-0 left-0 bg-gradient-to-b from-transparent to-primary-1000/80" />
      {description && (
        <small className="absolute left-0 bottom-0 text-alto-50 z-10 p-10 leading-relaxed max-sm:p-6">
          {description}
        </small>
      )}
    </div>
  );
};

const Pdf = ({ src }: { src: string }) => {
  const [see, setSee] = useState(false);

  return (
    <div
      className={clsx(
        "relative bg-alto-100/20 dark:bg-alto-950/20 flex flex-col gap-4 items-center justify-center border h-[40svh] w-[80%] max-sm:w-full my-8 rounded-lg overflow-hidden shadow-md shadow-alto-950/20 dark:shadow-alto-50/10 max-h-[80svh] min-h-[40svh]",
        see && "resize-y"
      )}
    >
      {see ? (
        <iframe src={src} className="w-full h-full border-0" title="pdf" />
      ) : (
        <>
          <Button onClick={() => setSee(true)} icon={Icon.Types.PDF}>
            Ver documento
          </Button>
        </>
      )}
      <motion.div
        layout="position"
        className={clsx(
          "flex justify-end w-[262px] pointer-events-none",
          !see && "",
          see && "absolute bottom-4 right-8"
        )}
      >
        <Button
          className={clsx("pointer-events-auto", {
            "w-full": !see,
          })}
          btnType="secondary"
          onClick={() => {
            window.open(src, "_blank");
          }}
          icon={Icon.Types.EXTERNAL}
        >
          {!see ? "Abrir en una pestaña nueva" : ""}
        </Button>
      </motion.div>
    </div>
  );
};

const Footer = ({ shareLink }: FooterProps) => {
  const { state } = useUserContext();
  const isUnlogged = state === "unlogged";

  const navigate = useNavigate();

  return (
    <footer className="w-full flex items-start gap-4 justify-between mt-10">
      <Button
        onClick={() =>
          navigate({
            to: isUnlogged ? "/daily" : "/blogs",
          })
        }
        icon={Icon.Types.CHEVRON_LEFT}
        reverse
        btnType="secondary"
      >
        Leer más blogs
      </Button>
      {shareLink && <ShareCanvas shareLink={shareLink} onFooter />}
    </footer>
  );
};

Canvas.Title = Title;
Canvas.Subtitle = Subtitle;
Canvas.Paragraph = Paragraph;
Canvas.Test = Test;
Canvas.Vignette = Vignette;
Canvas.Image = Image;
Canvas.Pdf = Pdf;

export default Canvas;
