import { useThemeContext } from "@/modules/core/context/ThemeContext";
import Logo from "../../_layout/components/Logo";
import { PUBLIC_NAVBAR_HEIGHT } from "../../_layout/constants/LAYOUT_SIZES";
import UnifranzLogo from "@/assets/images/unifranz-logo.png";
import UnifranzLogoDark from "@/assets/images/unifranz-logo-dark.png";
import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import { useNavigate } from "@tanstack/react-router";
import { validateRoute } from "../../_layout/components/breadcrumb/utils/validateRoute";
import clsx from "clsx";

interface Props {
  secondary?: boolean;
}

const Footer = ({ secondary }: Props) => {
  const { dark } = useThemeContext();
  const navigate = useNavigate();

  return (
    <footer
      className={clsx("relative", {
        "bg-primary-800": !secondary,
        "bg-alto-100 dark:bg-alto-950": secondary,
      })}
    >
      <div
        className="w-full py-20 h-full flex items-center justify-center gap-20 flex-wrap-reverse bg-alto-100 dark:bg-alto-950"
        style={{
          paddingInline: PUBLIC_NAVBAR_HEIGHT,
          borderTopLeftRadius: "50% 8%",
          borderTopRightRadius: "50% 8%",
        }}
      >
        <div className="bg-alto-50 dark:bg-alto-1000 py-4 px-8 flex gap-8 rounded-xl shadow-md shadow-primary-200 dark:shadow-primary-300/10 items-center flex-wrap justify-center">
          <p className="text-sm text-alto-900 dark:text-alto-200">¡Síguenos!</p>
          <div className="flex gap-4 text-alto-800 dark:text-alto-100">
            <a
              className="min-w-6 aspect-square hover:text-primary-800 dark:hover:text-primary-400 hover:scale-125 transition-all duration-300 cursor-pointer"
              href="#"
            >
              <Icon type={Icon.Types.WEB} />
            </a>
            <a className="min-w-6 aspect-square hover:text-primary-800 dark:hover:text-primary-400 hover:scale-125 transition-all duration-300 cursor-pointer">
              <Icon type={Icon.Types.FACEBOOK} />
            </a>
            <a className="min-w-6 aspect-square hover:text-primary-800 dark:hover:text-primary-400 hover:scale-125 transition-all duration-300 cursor-pointer">
              <Icon type={Icon.Types.INSTAGRAM} />
            </a>
            <a className="min-w-6 aspect-square hover:text-primary-800 dark:hover:text-primary-400 hover:scale-125 transition-all duration-300 cursor-pointer">
              <Icon type={Icon.Types.TIKTOK} />
            </a>
            <a className="min-w-6 aspect-square hover:text-primary-800 dark:hover:text-primary-400 hover:scale-125 transition-all duration-300 cursor-pointer">
              <Icon type={Icon.Types.LIKEDIN} />
            </a>
          </div>
        </div>
        <div className="h-16">
          <img
            src={dark ? UnifranzLogoDark : UnifranzLogo}
            className="h-full w-auto"
            alt="Logo de Unifranz"
          />
        </div>
      </div>
      <div className="flex flex-col gap-10 bg-alto-100 dark:bg-alto-950 border-b-8 border-primary-800">
        <div className="scale-125">
          <Logo slogan />
        </div>
        <div
          className="flex flex-col max-w-full items-center border-t border-alto-300/80 dark:border-alto-900 py-8 gap-10"
          style={{
            paddingInline: PUBLIC_NAVBAR_HEIGHT,
          }}
        >
          <div className="flex gap-4 flex-wrap overflow-hidden justify-center">
            <Button
              icon={Icon.Types.HOME}
              btnType="secondary"
              btnSize="small"
              reverse
              onClick={() => {
                navigate({
                  to: "/",
                });
                window.scrollTo(0, 0);
              }}
            >
              Inicio
            </Button>
            <Button
              icon={Icon.Types.BLOG}
              btnType="secondary"
              btnSize="small"
              reverse
              onClick={() => {
                navigate({
                  to: "/daily",
                });
                window.scrollTo(0, 0);
              }}
            >
              Blogs
            </Button>
            <Button
              icon={Icon.Types.BRAIN}
              btnType="secondary"
              btnSize="small"
              reverse
              onClick={() =>
                navigate({
                  to: "/",
                  search: {
                    redirect:
                      validateRoute("/tests/share") +
                      "?cparams=U2FsdGVkX1+PXPY6GsXsW56LtuwJXIL4Q6DwaiEhU3zCB6whYr0S2PswCyIGpBtBVxjOlhMoxGSsEqPh4nwEL8V1tRwN1ehDN0QxTYMDFMA=",
                  },
                })
              }
            >
              Tests vocacionales
            </Button>
            <Button
              icon={Icon.Types.CALENDAR}
              btnType="secondary"
              btnSize="small"
              reverse
              onClick={() =>
                navigate({
                  to: "/",
                  search: {
                    redirect: validateRoute("/calendar"),
                  },
                })
              }
            >
              Gabinete psicológico
            </Button>
            <Button
              icon={Icon.Types.WEB}
              btnType="secondary"
              btnSize="small"
              reverse
              onClick={() => {
                navigate({
                  to: "/privacy",
                });
                window.scrollTo(0, 0);
              }}
            >
              Políticas de privacidad
            </Button>
          </div>
          <small className="w-full text-center text-alto-700 dark:text-alto-300">
            © 2025 Universidad Franz Tamayo. Todos los derechos reservados.
          </small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
