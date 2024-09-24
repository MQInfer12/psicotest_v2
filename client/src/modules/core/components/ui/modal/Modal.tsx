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
          close();
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
        "bg-alto-950/60 fixed inset-0 flex items-center justify-center z-40 px-5",
        { "backdrop-blur-sm": blur }
      )}
      onClick={close}
    >
      <motion.section
        ref={modalRef}
        initial={{
          scale: 0,
        }}
        animate={{
          scale: 1,
        }}
        style={{
          width: width ?? 384,
        }}
        exit={{ scale: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          "max-w-full bg-alto-50 rounded-lg flex flex-col relative isolate",
          {
            "border-8 border-alto-100": onlyContent,
          }
        )}
      >
        <header
          className={clsx("flex justify-between items-center px-4 py-2 gap-4", {
            "border-b border-alto-300/70": !onlyContent && titleBar,
            "absolute top-0 z-10 w-full": onlyContent,
          })}
        >
          <strong className="whitespace-nowrap overflow-hidden text-ellipsis">
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
            "p-4": !onlyContent,
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
