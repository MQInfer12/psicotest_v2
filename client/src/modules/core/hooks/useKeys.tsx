import { useEffect, useState } from "react";

interface Keys {
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
}

const initialState: Keys = {
  shiftKey: false,
  ctrlKey: false,
  metaKey: false,
  altKey: false,
};

const useKeys = () => {
  const [keys, setKeys] = useState<Keys>(initialState);

  useEffect(() => {
    const eventListener = (e: KeyboardEvent) => {
      setKeys({
        shiftKey: e.shiftKey,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        altKey: e.altKey,
      });
    };
    const windowListener = () => setKeys(initialState);

    document.addEventListener("keydown", eventListener);
    document.addEventListener("keyup", eventListener);
    window.addEventListener("blur", windowListener);
    return () => {
      document.removeEventListener("keydown", eventListener);
      document.removeEventListener("keyup", eventListener);
      window.removeEventListener("blur", windowListener);
    };
  }, []);

  return keys;
};

export default useKeys;
