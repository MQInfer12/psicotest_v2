import useFetch from "@/modules/core/hooks/useFetch";
import { useUserContext } from "../../auth/context/UserContext";
import { toastSuccess } from "@/modules/core/utils/toasts";
import { Link, Navigate, Outlet } from "@tanstack/react-router";

const Dashboard = () => {
  const { user, state, logout } = useUserContext();
  if (state === "unlogged") return <Navigate to="/login" />;

  const { postData } = useFetch();
  const logoutMutation = postData("POST /logout");

  const handleLogout = () => {
    logoutMutation.mutate(null, {
      onSuccess: (res) => {
        logout();
        toastSuccess(res.message);
      },
    });
  };

  if (state === "loading") return <div>Cargando...</div>;

  return (
    <>
      <div className="p-2 flex gap-2 justify-between">
        <p>Bienvenido {user?.nombre}</p>
        <Link to="/users" className="[&.active]:font-bold">
          Usuarios
        </Link>
        <button onClick={handleLogout} className="bg-gray-300">
          Logout
        </button>
      </div>
      <Outlet />
    </>
  );
};

export default Dashboard;
