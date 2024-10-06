import { Link, useLocation } from "@tanstack/react-router";
import clsx from "clsx";
import { Fragment } from "react/jsx-runtime";
import { getActiveBreadcrumb } from "./utils/getActiveBreadcrumb";
import { BREADCRUMB } from "./constants/BREADCRUMB";
import { useEffect } from "react";

const Breadcrumb = () => {
  const { pathname } = useLocation();
  const activeBreadcrumb = getActiveBreadcrumb(pathname);

  useEffect(() => {
    document.title = `Psicotest | ${activeBreadcrumb?.name}`;
    return () => {
      document.title = "Psicotest";
    };
  }, [activeBreadcrumb]);

  if (!activeBreadcrumb) {
    throw new Error("No se encontró una miga de pan para esta ruta");
  }
  return (
    <p className="text-sm text-alto-700 flex gap-2 max-sm:text-xs whitespace-nowrap overflow-auto no-scrollbar">
      {activeBreadcrumb?.breadcrumb.map((a, i) => (
        <Fragment key={a}>
          {i > 0 && <span className="text-alto-400"> / </span>}
          <Link
            className={clsx(
              "relative after:content-[''] after:absolute after:w-full after:bottom-[2px] after:border-t after:left-0 after:border-alto-500",
              "after:scale-x-0 after:origin-left after:transition-all after:duration-300",
              "hover:after:scale-x-100",
              {
                "text-primary-900/70":
                  i === activeBreadcrumb.breadcrumb.length - 1,
              }
            )}
            to={a}
          >
            {BREADCRUMB.find((b) => b.match === a)?.name || ""}
          </Link>
        </Fragment>
      ))}
    </p>
  );
};

export default Breadcrumb;
