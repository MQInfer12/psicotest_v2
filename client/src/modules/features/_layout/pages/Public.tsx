import { Link, Navigate, Outlet, useSearch } from "@tanstack/react-router";
import clsx from "clsx";
import LoginCard from "../../auth/components/LoginCard";
import { LoginContextProvider } from "../../auth/context/LoginContext";
import { useUserContext } from "../../auth/context/UserContext";
import { shadowClasses } from "../../landing/constants/LANDING_SHADOWS";
import LoginLink from "../components/LoginLink";
import Logo from "../components/Logo";
import { PUBLIC_NAVBAR_HEIGHT } from "../constants/LAYOUT_SIZES";

const Public = () => {
  const { state } = useUserContext();
  const { redirect } = useSearch({
    from: "/_public",
  });

  if (state !== "unlogged") return <Navigate to={redirect || "/tests"} />;
  return (
    <LoginContextProvider>
      <nav
        style={{
          height: PUBLIC_NAVBAR_HEIGHT,
        }}
        className={clsx(
          "max-sm:px-5 px-20 p-2 flex items-center gap-2 justify-between fixed top-0 w-screen z-30 transition-colors duration-700 bg-alto-50/80 backdrop-blur-[10px]",
          shadowClasses
        )}
      >
        <Link className="flex" to="/">
          <Logo />
        </Link>
        {/* <div className="flex gap-10">
          <Link className="flex flex-1" to="/">
            Inicio
          </Link>
          <Link className="flex flex-1" to="/">
            Blogs
          </Link>
        </div> */}
        <div className="flex gap-10">
          <LoginLink />
        </div>
      </nav>
      <LoginCard redirect={redirect} />
      <div className="min-h-screen bg-alto-100 overflow-x-hidden">
        <Outlet />
      </div>
    </LoginContextProvider>
  );
};

export default Public;
