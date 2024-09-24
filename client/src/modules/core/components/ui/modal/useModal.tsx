import { useState } from "react";
import Modal from "./Modal";

interface Options {
  width?: number;
  blur?: boolean;
  titleBar?: boolean;
  onlyContent?: boolean;
}

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

  const modal = (
    title: string,
    children: ((item: T | null) => React.ReactNode) | React.ReactNode,
    options?: Options
  ) => (
    <Modal
      title={title}
      open={open}
      close={() => setOpen(false)}
      blur={options?.blur}
      width={options?.width}
      titleBar={options?.titleBar ?? true}
      onlyContent={options?.onlyContent}
    >
      {typeof children === "function" ? children(item) : children}
    </Modal>
  );

  return { modal, open, setOpen };
};
