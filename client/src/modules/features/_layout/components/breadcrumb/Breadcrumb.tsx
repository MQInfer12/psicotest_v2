import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { Fragment } from "react/jsx-runtime";
import { useEffect } from "react";
import { useBreadcrumb } from "./hooks/useBreadcrumb";

const Breadcrumb = () => {
  const activeBreadcrumb = useBreadcrumb();

  useEffect(() => {
    document.title = `Neurall | ${activeBreadcrumb[activeBreadcrumb.length - 1].name}`;
    return () => {
      document.title = "Neurall";
    };
  }, [activeBreadcrumb]);

  if (!activeBreadcrumb) {
    throw new Error("No se encontró una miga de pan para esta ruta");
  }
  return (
    <p className="text-sm text-alto-700 dark:text-alto-400 flex gap-2 max-sm:text-xs whitespace-nowrap overflow-auto no-scrollbar">
      {activeBreadcrumb.map((a, i) => (
        <Fragment key={a.path}>
          {i > 0 && (
            <span className="text-alto-400 dark:text-alto-700"> / </span>
          )}
          <Link
            className={clsx(
              "relative after:content-[''] after:absolute after:w-full after:bottom-[2px] after:border-t after:left-0 after:border-alto-500",
              "after:scale-x-0 after:origin-left after:transition-all after:duration-300",
              "hover:after:scale-x-100",
              {
                "text-primary-900/70 dark:text-primary-400":
                  i === activeBreadcrumb.length - 1,
              }
            )}
            to={a.path}
          >
            {a.name}
          </Link>
        </Fragment>
      ))}
    </p>
  );
};

export default Breadcrumb;
