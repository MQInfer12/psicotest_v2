import { useUserContext } from "../../auth/context/UserContext";
import { Link, Navigate, Outlet } from "@tanstack/react-router";
import Logo from "../components/Logo";
import UnifranzLogo from "@assets/images/unifranz-logo.png";
import { PUBLIC_NAVBAR_HEIGHT } from "../constants/LAYOUT_SIZES";
import LoginCard from "../../auth/components/LoginCard";

const Public = () => {
  const { state } = useUserContext();
  if (state !== "unlogged") return <Navigate to="/tests" />;

  return (
    <>
      <nav
        style={{
          height: PUBLIC_NAVBAR_HEIGHT,
        }}
        className="px-20 p-2 flex items-center gap-2 justify-between fixed top-0 w-screen z-30"
      >
        <Link className="flex flex-1" to="/">
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
        <div className="flex-1 flex justify-end">
          <img src={UnifranzLogo} className="h-12 w-auto" alt="logo-unifranz" />
        </div>
      </nav>
      <LoginCard />
      <div className="min-h-screen bg-alto-100 overflow-x-hidden">
        <Outlet />
      </div>
    </>
  );
};

export default Public;
