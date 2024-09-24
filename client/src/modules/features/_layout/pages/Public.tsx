import { useUserContext } from "../../auth/context/UserContext";
import { Link, Navigate, Outlet, useSearch } from "@tanstack/react-router";
import Logo from "../components/Logo";
import { PUBLIC_NAVBAR_HEIGHT } from "../constants/LAYOUT_SIZES";
import LoginCard from "../../auth/components/LoginCard";
import { LoginContextProvider } from "../../auth/context/LoginContext";
import LoginLink from "../components/LoginLink";

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
        className="max-sm:px-5 px-20 p-2 flex items-center gap-2 justify-between fixed top-0 w-screen z-30"
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
