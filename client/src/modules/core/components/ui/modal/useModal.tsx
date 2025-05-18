import { useState } from "react";
import Modal from "./Modal";

export interface ModalOptions {
  width?: number;
  blur?: boolean;
  titleBar?: boolean;
  onlyContent?: boolean;
  onClose?: () => void;
  type?: "default" | "floating";
  bodyPadding?: boolean;
  canBeClosed?: boolean;
}

export type Modal<T> = (
  title: ((item: T | null) => string) | string,
  children: ((item: T | null) => React.ReactNode) | React.ReactNode,
  options?: ModalOptions
) => JSX.Element;

export const useModal = <T,>() => {
  const [open, _setOpen] = useState(false);
  const [item, setItem] = useState<T | null>(null);

  const setOpen = (openOption: T | boolean) => {
    if (typeof openOption !== "boolean") {
      setItem(openOption);
    }
    if (openOption === false) {
      setItem(null);
    }
    _setOpen(!!openOption);
  };

  const modal: Modal<T> = (
    title: ((item: T | null) => string) | string,
    children: ((item: T | null) => React.ReactNode) | React.ReactNode,
    options?: ModalOptions
  ) => (
    <Modal
      title={typeof title === "function" ? title(item) : title}
      open={open}
      close={() => {
        options?.onClose?.();
        setOpen(false);
      }}
      blur={options?.blur}
      width={options?.width}
      titleBar={options?.titleBar ?? true}
      onlyContent={options?.onlyContent}
      type={options?.type}
      bodyPadding={options?.bodyPadding}
      canBeClosed={options?.canBeClosed}
    >
      {typeof children === "function" ? children(item) : children}
    </Modal>
  );

  return { modal, open, item, setOpen };
};
