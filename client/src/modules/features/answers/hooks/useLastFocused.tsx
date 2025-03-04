import { useEffect, useMemo } from "react";
import { SESSION_STORAGE_TABLE_ANSWERS_LAST_FOCUSED_KEY } from "../constants/storage";

export const useLastFocused = () => {
  const saveLastFocused = (data: number[] | undefined) => {
    useEffect(() => {
      if (data) {
        sessionStorage.setItem(
          SESSION_STORAGE_TABLE_ANSWERS_LAST_FOCUSED_KEY,
          JSON.stringify(data)
        );
      }
    }, [data]);
  };

  const getLastFocused = (reload?: boolean) => {
    const lastFocused = useMemo(() => {
      const lastFocusedStorage = sessionStorage.getItem(
        SESSION_STORAGE_TABLE_ANSWERS_LAST_FOCUSED_KEY
      );
      return lastFocusedStorage
        ? (JSON.parse(lastFocusedStorage) as number[])
        : null;
    }, [reload]);

    useEffect(() => {
      sessionStorage.removeItem(SESSION_STORAGE_TABLE_ANSWERS_LAST_FOCUSED_KEY);
    }, [reload]);

    return lastFocused;
  };

  return {
    saveLastFocused,
    getLastFocused,
  };
};
