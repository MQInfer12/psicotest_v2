import useFetch from "@/modules/core/hooks/useFetch";
import { useUserContext } from "../../auth/context/UserContext";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toasts";
import { Link, Navigate, Outlet } from "@tanstack/react-router";
import {
  PRIVATE_ASIDE_WIDTH,
  PRIVATE_ASIDE_WIDTH_THIN,
  PRIVATE_HEADER_HEIGHT,
} from "../constants/LAYOUT_SIZES";
import Icon, { ICON } from "@/modules/core/components/icons/Icon";
import AsideLink from "../components/AsideLink";
import { PRIVATE_LINKS } from "../constants/PRIVATE_LINKS";
import { useState } from "react";
import { motion } from "framer-motion";
import Logo from "../components/Logo";
import Breadcrumb from "../components/Breadcrumb";
import Loader from "@/modules/core/components/ui/loader/Loader";

const Dashboard = () => {
  const { user, state, logout } = useUserContext();
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

  if (state === "loading")
    return (
      <div className="w-screen h-screen bg-alto-100">
        <Loader />
      </div>
    );
  return (
    <>
      <motion.aside
        className="fixed left-0 top-0 h-screen bg-alto-50 flex flex-col gap-10 shadow-lg z-30"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        animate={{
          width: open ? PRIVATE_ASIDE_WIDTH : PRIVATE_ASIDE_WIDTH_THIN,
        }}
      >
        <div
          style={{
            height: PRIVATE_HEADER_HEIGHT,
          }}
          className="flex items-center"
        >
          <Link to="/tests" className="self-center mx-auto px-4">
            <Logo showText={open} />
          </Link>
        </div>
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
        className="w-screen min-h-screen bg-alto-100 flex flex-col h-screen overflow-hidden"
      >
        <header
          style={{
            minHeight: PRIVATE_HEADER_HEIGHT,
          }}
          className="flex items-center justify-between px-10 bg-alto-100 z-20"
        >
          <div className="flex flex-col gap-1">
            <h2 className="text-lg">
              ¡Bienvenido, {user?.nombre.split(" ")[0]}!
            </h2>
            <Breadcrumb />
          </div>
          <div className="flex gap-8">
            <button className="w-12 aspect-square rounded-lg bg-alto-200 flex items-center justify-center p-3 text-alto-400">
              <Icon type={Icon.Types.BELL} />
            </button>
            <button className="w-12 aspect-square rounded-lg bg-alto-200 flex items-center justify-center overflow-hidden">
              {user?.foto && <img className="w-full h-full" src={user.foto} />}
            </button>
          </div>
        </header>
        <section className="flex-1 overflow-auto flex flex-col">
          <Outlet />
        </section>
      </main>
    </>
  );
};

export default Dashboard;
