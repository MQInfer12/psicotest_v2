import Icon, { ICON } from "@/modules/core/components/icons/Icon";
import Loader from "@/modules/core/components/ui/loader/Loader";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { buildUrlParams } from "@/modules/core/utils/buildUrlParams";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toasts";
import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useUserContext } from "../../auth/context/UserContext";
import { Permisos } from "../../auth/types/Permisos";
import AsideLink from "../components/AsideLink";
import Logo from "../components/Logo";
import Breadcrumb from "../components/breadcrumb/Breadcrumb";
import { useBreadcrumb } from "../components/breadcrumb/hooks/useBreadcrumb";
import { PRIVATE_ASIDE_WIDTH } from "../constants/LAYOUT_SIZES";
import { PRIVATE_LINKS } from "../constants/PRIVATE_LINKS";
import { useMeasureContext } from "../context/MeasureContext";
import SettingsForm from "../../settings/components/SettingsForm";
import { use } from "framer-motion/client";

const Dashboard = () => {
  const { pathname, search } = useLocation();
  const activeBreadcrumb = useBreadcrumb();
  const navigate = useNavigate();

  const { user, state, logout } = useUserContext();
  const url = pathname + buildUrlParams(search);
  const fromLogoutRef = useRef(false);

  const {
    size,
    PRIVATE_HEADER_HEIGHT,
    PRIVATE_PADDING_INLINE,
    PRIVATE_ASIDE_WIDTH_THIN,
  } = useMeasureContext();

  const [open, setOpen] = useState(false);

  const { postData } = useFetch();
  const logoutMutation = postData("POST /logout");

  const handleLogout = () => {
    toastConfirm("¿Quieres cerrar sesión?", () =>
      logoutMutation(null, {
        onSuccess: (res) => {
          logout();
          toastSuccess(res.message);
          fromLogoutRef.current = true;
        },
      })
    );
  };

  const { modal: modalSettings, setOpen: setOpenSettings } = useModal();

  const outletContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    outletContainerRef.current?.scrollTo(0, 0);
  }, [pathname]);

  if (state === "unlogged")
    return (
      <Navigate
        to="/"
        search={!fromLogoutRef.current ? { redirect: url } : undefined}
      />
    );
  if (state === "loading")
    return (
      <div className="w-screen h-screen bg-alto-100">
        <Loader text="Cargando datos de usuario..." />
      </div>
    );

  return (
    <>
      {modalSettings(
        "Configuraciones",
        <SettingsForm
          onSuccess={() => {
            setOpenSettings(false);
          }}
        />
      )}
      <div
        onClick={() => setOpen(false)}
        className={clsx("absolute inset-0 bg-black/20 z-30 md:hidden", {
          hidden: !open,
        })}
      />
      <motion.aside
        className={clsx(
          "fixed left-0 top-0 h-[100svh] bg-alto-50 flex flex-col shadow-lg z-40 overflow-hidden"
        )}
        onMouseEnter={
          size === "normal" || size === "xl" ? () => setOpen(true) : undefined
        }
        onMouseLeave={
          size === "normal" || size === "xl" ? () => setOpen(false) : undefined
        }
        animate={{
          width: open ? PRIVATE_ASIDE_WIDTH : PRIVATE_ASIDE_WIDTH_THIN,
        }}
      >
        <div
          className="flex flex-col gap-10"
          style={{
            minWidth: PRIVATE_ASIDE_WIDTH_THIN,
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
              <AsideLink
                key={link.to}
                onClick={size !== "normal" ? () => setOpen(false) : undefined}
                showText={open}
                type="link"
                {...link}
              />
            ))}
            <AsideLink
              type="button"
              onClick={() => setOpenSettings(true)}
              icon={ICON.CONFIG}
              title="Configuración"
              showText={open}
              permisos={[Permisos.CONFIGURAR]}
            />
            <AsideLink
              type="button"
              onClick={handleLogout}
              icon={ICON.LOGOUT}
              title="Cerrar sesión"
              showText={open}
              permisos={[]}
            />
          </div>
        </div>
      </motion.aside>
      <main
        style={{
          paddingLeft: PRIVATE_ASIDE_WIDTH_THIN,
        }}
        className="w-screen min-h-screen bg-alto-100 flex flex-col h-screen overflow-hidden max-md:!pl-0"
      >
        <header
          style={{
            minHeight: PRIVATE_HEADER_HEIGHT,
            paddingInline: PRIVATE_PADDING_INLINE,
          }}
          className="flex items-center justify-between bg-alto-100 z-20 gap-2"
        >
          <div className="flex items-center overflow-hidden gap-2">
            <button
              className="flex items-center justify-center text-alto-500 hover:text-primary-900/70 transition-all duration-300 pr-2 md:hidden"
              onClick={() => setOpen(true)}
            >
              <Icon type={Icon.Types.MENU} />
            </button>
            <div className="flex flex-col gap-2 overflow-hidden max-sm:gap-1">
              <Breadcrumb />
              <div className="flex items-center overflow-hidden">
                {activeBreadcrumb.length > 1 && (
                  <button
                    className="flex items-center justify-center text-alto-500 hover:text-primary-900/70 transition-all duration-300 pr-2"
                    onClick={() => {
                      const prevBreadcrumb =
                        activeBreadcrumb[activeBreadcrumb.length - 2];
                      navigate({
                        to: prevBreadcrumb.path,
                      });
                    }}
                  >
                    <Icon type={Icon.Types.CHEVRON_LEFT} />
                  </button>
                )}
                <h2
                  title={activeBreadcrumb[activeBreadcrumb.length - 1].name}
                  className="text-2xl font-bold text-alto-950 whitespace-nowrap overflow-hidden text-ellipsis max-sm:text-xl"
                >
                  {activeBreadcrumb[activeBreadcrumb.length - 1].name}
                </h2>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="flex overflow-hidden items-center border border-alto-200 rounded-lg bg-alto-50">
              <div className="w-12 aspect-square rounded-lg bg-alto-200 overflow-hidden flex items-center justify-center">
                {user?.foto && (
                  <img className="w-full h-full" src={user.foto} />
                )}
              </div>
              <div className="flex-1 overflow-hidden flex flex-col justify-center px-2 w-36 max-sm:hidden">
                <p className="text-xs font-semibold text-primary-950 whitespace-nowrap overflow-hidden text-ellipsis">
                  {user?.nombre}
                </p>
                <small className="text-[10px]">¡Bienvenido!</small>
              </div>
            </button>
            <button className="w-12 aspect-square rounded-lg bg-alto-50 border border-alto-200 flex items-center justify-center p-3 text-alto-400">
              <Icon type={Icon.Types.BELL} />
            </button>
          </div>
        </header>
        <section
          ref={outletContainerRef}
          className="flex-1 overflow-auto flex flex-col relative"
        >
          <Outlet />
        </section>
      </main>
    </>
  );
};

export default Dashboard;
