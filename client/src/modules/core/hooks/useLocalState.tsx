import { useEffect, useState } from "react";

export const useLocalState = <T,>(name: string | undefined | null, initialValue: T) => {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined" || !name) return initialValue;
    const saved = localStorage.getItem(name);
    return saved ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    if (!name) return;
    localStorage.setItem(name, JSON.stringify(state));
  }, [name, state]);

  return [state, setState] as const;
};
