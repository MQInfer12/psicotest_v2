import { useState } from "react";
import Modal from "./Modal";

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
    children: ((item: T | null) => React.ReactNode) | React.ReactNode
  ) => (
    <Modal open={open} close={() => setOpen(false)}>
      {typeof children === "function" ? children(item) : children}
    </Modal>
  );

  return { modal, open, setOpen };
};
