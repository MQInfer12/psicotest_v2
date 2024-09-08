import useFetch from "@/modules/core/hooks/useFetch";
import { useUserContext } from "../../auth/context/UserContext";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toasts";
import { Link, Navigate, Outlet } from "@tanstack/react-router";
import {
  PRIVATE_ASIDE_WIDTH,
  PRIVATE_ASIDE_WIDTH_THIN,
} from "../constants/LAYOUT_SIZES";
import { ICON } from "@/modules/core/components/icons/Icon";
import AsideLink from "../components/AsideLink";
import { PRIVATE_LINKS } from "../constants/PRIVATE_LINKS";
import { useState } from "react";
import { motion } from "framer-motion";
import Logo from "../components/Logo";

const Dashboard = () => {
  const { state, logout } = useUserContext();
  if (state === "unlogged") return <Navigate to="/" />;

  const [open, setOpen] = useState(false);

  const { postData } = useFetch();
  const logoutMutation = postData("POST /logout");

  const handleLogout = () => {
    toastConfirm("¿Quieres cerrar sesión?", () =>
      logoutMutation(null, {
        onSuccess: (res) => {
          logout();
          toastSuccess(res.message);
        },
      })
    );
  };

  if (state === "loading") return <div>Cargando...</div>;
  return (
    <>
      <motion.aside
        className="fixed left-0 top-0 h-screen bg-alto-50 flex flex-col pt-[5vh] gap-[5vh] shadow-lg"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        animate={{
          width: open ? PRIVATE_ASIDE_WIDTH : PRIVATE_ASIDE_WIDTH_THIN,
        }}
      >
        <Link to="/tests" className="self-center mx-auto px-4">
          <Logo showText={open} />
        </Link>
        <div className="px-4 flex flex-col gap-2 overflow-hidden">
          {PRIVATE_LINKS.map((link) => (
            <AsideLink key={link.title} showText={open} type="link" {...link} />
          ))}
          <AsideLink
            type="button"
            onClick={handleLogout}
            icon={ICON.LOGOUT}
            title="Cerrar sesión"
            showText={open}
          />
        </div>
      </motion.aside>
      <main
        style={{
          paddingLeft: PRIVATE_ASIDE_WIDTH_THIN,
        }}
        className="w-screen min-h-screen bg-alto-100"
      >
        <header></header>
        <Outlet />
      </main>
    </>
  );
};

export default Dashboard;
