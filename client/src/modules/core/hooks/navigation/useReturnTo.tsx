import { useLocation, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";

export const useReturnTo = () => {
  const { search } = useLocation();
  const navigate = useNavigate();

  const returnToAll: string[] | null = useMemo(() => {
    const params = new URLSearchParams(search as Record<string, string>);
    const returnToAllStr = params.get("returnTo");
    if (returnToAllStr) {
      const returnToAll = returnToAllStr.split(",");
      if (returnToAll.length === 0) {
        throw new Error("returnTo is empty");
      }
      return returnToAll;
    }
    return null;
  }, [search]);

  const returnTo = returnToAll ? returnToAll[returnToAll.length - 1] : null;

  const goWithReturnTo = (routeToReturn: string) => {
    return returnToAll ? [...returnToAll, routeToReturn] : [routeToReturn];
  };

  const goBackWithReturnTo = () => {
    if (returnTo) {
      const nextReturnTo = returnToAll?.slice(0, -1);
      if (nextReturnTo?.length === 0) {
        navigate({ to: returnTo });
        return;
      }
      navigate({
        to: returnTo,
        //@ts-ignore
        search: { returnTo: nextReturnTo },
      });
    }
  };

  return {
    returnTo,
    goWithReturnTo,
    goBackWithReturnTo,
  };
};
