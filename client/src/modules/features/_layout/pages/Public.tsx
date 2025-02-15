import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  useSearch,
} from "@tanstack/react-router";
import clsx from "clsx";
import LoginCard from "../../auth/components/LoginCard";
import { LoginContextProvider } from "../../auth/context/LoginContext";
import { useUserContext } from "../../auth/context/UserContext";
import { shadowClasses } from "../../landing/constants/LANDING_SHADOWS";
import LoginLink from "../components/LoginLink";
import Logo from "../components/Logo";
import { PUBLIC_NAVBAR_HEIGHT } from "../constants/LAYOUT_SIZES";
import { useEffect } from "react";

const Public = () => {
  const { state } = useUserContext();
  const { redirect } = useSearch({
    from: "/_public",
  });
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (state !== "unlogged") {
    const isDaily = pathname.startsWith("/daily");
    return (
      <Navigate
        to={
          redirect || (isDaily ? pathname.replace("daily", "blogs") : "/tests")
        }
      />
    );
  }
  return (
    <LoginContextProvider>
      <nav
        style={{
          height: PUBLIC_NAVBAR_HEIGHT,
        }}
        className={clsx(
          "max-sm:px-5 px-20 p-2 flex items-center gap-2 justify-between fixed top-0 w-screen z-30 backdrop-blur-[10px] bg-alto-50/80 dark:bg-alto-1000/80",
          shadowClasses
        )}
      >
        <div className="flex gap-16 max-sm:gap-8 items-center">
          <Link
            className="flex"
            to="/"
            onClick={() => {
              window.scrollTo(0, 0);
            }}
          >
            <Logo autoHideText />
          </Link>
          <div className="flex gap-10 max-sm:gap-8">
            <Link
              className="[&.active]:text-primary-700 dark:[&.active]:text-primary-400 text-alto-950 dark:text-alto-50 text-sm relative after:content-['_'] after:absolute after:bottom-0 after:w-full after:h-[1px] after:bg-primary-700 after:dark:bg-primary-400 after:left-0 after:scale-x-0 hover:after:scale-x-100 after:transition-all after:duration-300"
              to="/"
            >
              Inicio
            </Link>
            <Link
              className="[&.active]:text-primary-700 dark:[&.active]:text-primary-400 text-alto-950 dark:text-alto-50 text-sm relative after:content-['_'] after:absolute after:bottom-0 after:w-full after:h-[1px] after:bg-primary-700 after:dark:bg-primary-400 after:left-0 after:scale-x-0 hover:after:scale-x-100 after:transition-all after:duration-300"
              to="/daily"
            >
              Novedades
            </Link>
          </div>
        </div>
        <div className="flex gap-10">
          <LoginLink />
        </div>
      </nav>
      <LoginCard redirect={redirect} />
      <div className="min-h-[100svh] overflow-x-hidden relative scroll-smooth">
        <Outlet />
      </div>
    </LoginContextProvider>
  );
};

export default Public;
