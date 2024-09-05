import { useUserContext } from "../../auth/context/UserContext";
import { Link, Navigate, Outlet } from "@tanstack/react-router";

const Public = () => {
  const { state } = useUserContext();
  if (state !== "unlogged") return <Navigate to="/users" />;

  return (
    <div className="flex flex-col h-screen">
      <div className="p-2 flex gap-2 justify-between">
        <p>Bienvenido</p>
        <Link to="/" className="[&.active]:font-bold">
          Inicio
        </Link>
        <Link to="/login" className="[&.active]:font-bold">
          Login
        </Link>
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default Public;
