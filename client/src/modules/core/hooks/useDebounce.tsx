import { useEffect, useRef, useState } from "react";

export const useDebounce = (
  value: string,
  options?: {
    delay?: number;
    returnFirstRender?: boolean;
  }
) => {
  const [debouncedValue, setDebouncedValue] = useState<string | null>(null);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const timerRef = useRef<any>();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (options?.returnFirstRender ?? false) return;
    }

    setIsDebouncing(true);
    timerRef.current = setTimeout(() => {
      setIsDebouncing(false);
      setDebouncedValue(value);
    }, options?.delay ?? 500);

    return () => clearTimeout(timerRef.current);
  }, [value]);

  return { debouncedValue, isDebouncing, isFirstRender: isFirstRender.current };
};
