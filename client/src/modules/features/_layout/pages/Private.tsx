import DefaultPhoto from "@/assets/images/defaultPhoto.jpg";
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
  useSearch,
} from "@tanstack/react-router";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useUserContext } from "../../auth/context/UserContext";
import { Permisos } from "../../auth/types/Permisos";
import SettingsForm from "../../settings/components/SettingsForm";
import AsideLink from "../components/AsideLink";
import Logo from "../components/Logo";
import ThemeButton from "../components/ThemeButton";
import Breadcrumb from "../components/breadcrumb/Breadcrumb";
import { useBreadcrumb } from "../components/breadcrumb/hooks/useBreadcrumb";
import { PRIVATE_ASIDE_WIDTH } from "../constants/LAYOUT_SIZES";
import { PRIVATE_LINKS } from "../constants/PRIVATE_LINKS";
import { useMeasureContext } from "../context/MeasureContext";
import UnifranzLogo from "@/assets/images/unifranz-logo.png";
import UnifranzLogoDark from "@/assets/images/unifranz-logo-dark.png";
import { useThemeContext } from "@/modules/core/context/ThemeContext";
import { useReturnTo } from "@/modules/core/hooks/navigation/useReturnTo";

const Dashboard = () => {
  const { pathname, search } = useLocation();
  const activeBreadcrumb = useBreadcrumb();
  const navigate = useNavigate();
  const { dark } = useThemeContext();

  const { user, state, logout } = useUserContext();
  const url = pathname + buildUrlParams(search);
  const fromLogoutRef = useRef(false);

  //@ts-ignore
  const { returnTo, goBackWithReturnTo } = useReturnTo();

  const returnToBreadcrumb = useBreadcrumb(returnTo);
  const returnToObj = returnToBreadcrumb[returnToBreadcrumb.length - 1];

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
    toastConfirm(
      user?.cita_proxima
        ? "Te recomendamos mantener abierta tu sesión para recibir actualizaciones del calendario."
        : "Te recomendamos mantener abierta la sesión.",
      () =>
        logoutMutation(null, {
          onSuccess: (res) => {
            logout();
            toastSuccess(res.message);
            fromLogoutRef.current = true;
          },
        }),
      {
        title: "¿Quieres cerrar sesión?",
      }
    );
  };

  const { modal: modalSettings, setOpen: setOpenSettings } = useModal();

  const outletContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    outletContainerRef.current?.scrollTo(0, 0);
  }, [pathname]);

  const { view } = useSearch({
    strict: false,
  });

  if (state === "unlogged") {
    return (
      <Navigate
        to="/"
        search={!fromLogoutRef.current ? { redirect: url } : undefined}
      />
    );
  }

  if (state === "loading") {
    return (
      <div className="w-screen h-[100svh] bg-alto-100 dark:bg-alto-950">
        <Loader text="Cargando datos de usuario..." />
      </div>
    );
  }

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
        className={clsx(
          "absolute inset-0 bg-alto-950/60 dark:bg-alto-50/30 z-30 md:hidden",
          {
            hidden: !open,
          }
        )}
      />
      <motion.aside
        className={clsx(
          "fixed left-0 top-0 h-[100svh] bg-alto-50 dark:bg-alto-1000 flex flex-col shadow-lg shadow-alto-950/20 dark:shadow-alto-50/10 z-40 overflow-hidden justify-between"
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
          className="flex flex-col gap-10 flex-1 overflow-hidden"
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
          <div className="px-4 flex flex-col gap-2 overflow-x-hidden overflow-y-auto no-scrollbar">
            {PRIVATE_LINKS.map((link) => (
              <AsideLink
                key={link.to}
                onClick={size !== "normal" ? () => setOpen(false) : undefined}
                showText={open}
                type="link"
                behavior="and"
                {...link}
              />
            ))}
            <AsideLink
              type="button"
              onClick={() => setOpenSettings(true)}
              icon={ICON.CONFIG}
              title="Configuración"
              showText={open}
              behavior="or"
              permisos={[
                Permisos.CONFIGURAR,
                Permisos.VER_CITAS,
                Permisos.VER_RESULTADOS,
              ]}
            />
            <AsideLink
              type="button"
              onClick={handleLogout}
              icon={ICON.LOGOUT}
              title="Cerrar sesión"
              showText={open}
              behavior="and"
              permisos={[]}
            />
          </div>
        </div>
        <ThemeButton open={open} />
      </motion.aside>
      <main
        style={{
          paddingLeft: PRIVATE_ASIDE_WIDTH_THIN,
        }}
        className="w-screen min-h-[100svh] flex flex-col h-[100svh] overflow-hidden max-md:!pl-0"
      >
        <header
          style={{
            minHeight: PRIVATE_HEADER_HEIGHT,
            paddingInline: PRIVATE_PADDING_INLINE,
          }}
          className="flex items-center justify-between bg-alto-100 dark:bg-alto-950 z-20 gap-2"
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
                {(activeBreadcrumb.length > 1 || returnTo) && (
                  <button
                    title={
                      returnTo
                        ? `Volver a '${returnToObj.name}'`
                        : "Volver atrás"
                    }
                    className="relative flex items-center justify-center text-alto-700 dark:text-alto-400 hover:text-primary-900/70 transition-all duration-300 pr-2"
                    onClick={() => {
                      if (returnTo) {
                        goBackWithReturnTo();
                        return;
                      }
                      if (activeBreadcrumb.length > 1) {
                        const prevBreadcrumb =
                          activeBreadcrumb[activeBreadcrumb.length - 2];
                        navigate({
                          to: prevBreadcrumb.path,
                          search: {
                            view,
                          },
                        });
                        return;
                      }
                    }}
                  >
                    <Icon type={Icon.Types.CHEVRON_LEFT} />
                    {returnTo && (
                      <span className="absolute bottom-0 right-2 w-3 h-3 bg-alto-100 dark:bg-alto-950">
                        <Icon type={returnToObj.icon ?? Icon.Types.QUESTION} />
                      </span>
                    )}
                  </button>
                )}
                <h2
                  title={activeBreadcrumb[activeBreadcrumb.length - 1]?.name}
                  className="text-2xl font-bold text-alto-950 dark:text-alto-50 whitespace-nowrap overflow-hidden text-ellipsis max-sm:text-xl"
                >
                  {activeBreadcrumb[activeBreadcrumb.length - 1]?.name}
                </h2>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="flex overflow-hidden items-center border border-alto-200 dark:border-alto-800 rounded-lg bg-alto-50 dark:bg-alto-1000">
              <div className="flex-1 overflow-hidden flex flex-col justify-center px-2 w-36 max-sm:hidden">
                <p className="text-xs font-semibold text-primary-950 dark:text-primary-300 whitespace-nowrap overflow-hidden text-ellipsis">
                  {user?.nombre}
                </p>
                <small className="text-[10px] text-alto-950 dark:text-alto-50">
                  ¡Bienvenido!
                </small>
              </div>
              <div className="w-12 aspect-square rounded-lg bg-alto-100 overflow-hidden flex items-center justify-center border-l border-alto-200">
                <img
                  className="w-full h-full"
                  src={user?.foto ?? DefaultPhoto}
                  onError={(event) => {
                    event.currentTarget.src = DefaultPhoto;
                  }}
                />
              </div>
            </button>
            {/* <button className="h-full aspect-square rounded-lg bg-alto-50 dark:bg-alto-1000 border border-alto-200 dark:border-alto-800 flex items-center justify-center p-3 text-alto-400">
              <Icon type={Icon.Types.BELL} />
            </button> */}
          </div>
        </header>
        <section
          ref={outletContainerRef}
          className="flex-1 overflow-auto flex flex-col relative isolate"
        >
          <Outlet />
          <img
            src={dark ? UnifranzLogoDark : UnifranzLogo}
            className="w-64 max-sm:w-32 fixed opacity-10 -z-50"
            style={{
              bottom: 40,
              right: PRIVATE_PADDING_INLINE,
            }}
          />
        </section>
      </main>
    </>
  );
};

export default Dashboard;
