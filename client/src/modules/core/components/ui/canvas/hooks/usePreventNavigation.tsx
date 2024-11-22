import { useEffect } from "react";

const usePreventNavigation = (active: boolean = false) => {
  useEffect(() => {
    if (!active) return;

    function beforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }

    window.addEventListener("beforeunload", beforeUnload);

    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
    };
  }, [active]);
};

export default usePreventNavigation;
