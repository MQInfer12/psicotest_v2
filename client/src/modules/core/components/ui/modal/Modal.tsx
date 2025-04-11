import { createPortal } from "react-dom";
import Appear from "../../utils/Appear";
import { motion } from "framer-motion";
import Button from "../Button";
import Icon from "../../icons/Icon";
import { useEffect, useRef } from "react";
import clsx from "clsx";

interface Props {
  open: boolean;
  title: string;
  children: React.ReactNode;
  close: () => void;
  blur?: boolean;
  width?: number;
  titleBar?: boolean;
  onlyContent?: boolean;
  type?: "default" | "floating";
  bodyPadding?: boolean;
}

const getFocusableElements = (
  element: HTMLDivElement | null,
  withPriority = false
) => {
  let elements: HTMLElement[] = [];
  if (withPriority) {
    const priority = Array.from(
      element?.querySelectorAll<HTMLElement>(
        "input:not([disabled]):not([tabindex='-1']), " +
          "select:not([disabled]):not([tabindex='-1']), " +
          "textarea:not([disabled]):not([tabindex='-1'])"
      ) || []
    );
    const secondary = Array.from(
      element?.querySelectorAll<HTMLElement>(
        "button:not([disabled]):not([tabindex='-1']), " +
          "[href]:not([tabindex='-1']), " +
          "[tabindex]:not([tabindex='-1']):not([disabled])"
      ) || []
    );
    elements = [...priority, ...secondary];
  } else {
    elements = Array.from(
      element?.querySelectorAll<HTMLElement>(
        "button:not([disabled]):not([tabindex='-1']), " +
          "[href]:not([tabindex='-1']), " +
          "input:not([disabled]):not([tabindex='-1']), " +
          "select:not([disabled]):not([tabindex='-1']), " +
          "textarea:not([disabled]):not([tabindex='-1']), " +
          "[tabindex]:not([tabindex='-1']):not([disabled])"
      ) || []
    );
  }
  return elements;
};

const Modal = ({
  open,
  title,
  children,
  close,
  blur,
  width,
  titleBar,
  onlyContent,
  type = "default",
  bodyPadding = true,
}: Props) => {
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      lastFocusedElement.current = document.activeElement as HTMLElement;

      const firstElementFocus = getFocusableElements(modalRef.current, true);
      firstElementFocus?.[0]?.focus();

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          const elements = document.querySelectorAll(".modal-close-button");
          if (elements.length > 0) {
            const lastElement = elements[elements.length - 1] as HTMLElement;
            lastElement.click();
          }
        }

        const focusableElements = getFocusableElements(modalRef.current);

        if (!modalRef.current || !focusableElements?.length) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.key === "Tab") {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      document.addEventListener("keydown", handleTabKey);

      return () => {
        document.removeEventListener("keydown", handleTabKey);
      };
    } else {
      lastFocusedElement.current?.focus();
    }
  }, [open]);

  return createPortal(
    <Appear
      open={open}
      className={clsx(
        "modal-close-button",
        "bg-alto-950/60 dark:bg-alto-50/30 fixed left-0 top-0 h-[100svh] w-full flex items-center z-40",
        {
          "backdrop-blur-sm": blur,
          "justify-center px-5 max-sm:px-2": type === "default",
          "justify-end p-5 max-sm:p-2": type === "floating",
        }
      )}
      onClick={close}
    >
      <motion.section
        ref={modalRef}
        initial={
          {
            default: { scale: 0 },
            floating: { x: "100%" },
          }[type]
        }
        animate={
          {
            default: { scale: 1 },
            floating: { x: 0 },
          }[type]
        }
        exit={
          {
            default: { scale: 0 },
            floating: { x: "100%" },
          }[type]
        }
        transition={
          type === "floating"
            ? {
                duration: 0.5,
              }
            : undefined
        }
        style={{
          width: width ?? 384,
        }}
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          "max-w-full bg-alto-50 dark:bg-alto-950 flex flex-col relative isolate",
          {
            "border-8 border-alto-100 dark:border-alto-950": onlyContent,
            "rounded-lg": type === "default",
            "h-full rounded-lg": type === "floating",
          }
        )}
      >
        <header
          className={clsx("flex justify-between items-center px-4 py-2 gap-4", {
            "border-b border-alto-300/70 dark:border-alto-800":
              !onlyContent && titleBar,
            "absolute top-0 z-10 w-full": onlyContent,
          })}
        >
          <strong className="whitespace-nowrap overflow-hidden text-ellipsis text-alto-950 dark:text-alto-50">
            {title}
          </strong>
          <Button
            className="!py-1"
            btnType="secondary"
            onClick={close}
            icon={Icon.Types.X}
          />
        </header>
        <main
          className={clsx({
            "pt-0": !titleBar,
            "flex-1 overflow-auto": !onlyContent,
            "p-4": bodyPadding && !onlyContent,
            "rounded-md overflow-hidden": onlyContent,
          })}
        >
          {children}
        </main>
      </motion.section>
    </Appear>,
    document.getElementById("modal") || document.body
  );
};

export default Modal;
