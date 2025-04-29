import { ReactNode, useNavigate } from "@tanstack/react-router";
import LandingButton from "./LandingButton";
import Landing2 from "@/assets/images/landing-2-min.jpeg";
import Landing3 from "@/assets/images/landing-3-min.jpg";
import { validateRoute } from "@/modules/features/_layout/components/breadcrumb/utils/validateRoute";
import clsx from "clsx";

interface Props {
  children?: ReactNode;
  type?: "primary" | "secondary";
}

const ServicesCards = ({ children, type = "primary" }: Props) => {
  const navigate = useNavigate();
  return (
    <div className="flex gap-16 gap-y-12 flex-wrap items-center justify-center relative isolate mx-14">
      {children}
      <div
        className={clsx(
          "max-xl:w-[320px] w-[440px] rounded-xl border-8 shadow-lg shadow-alto-50/30  flex flex-col",
          {
            "bg-alto-100 border-alto-100": type === "primary",
            "bg-alto-50 shadow-alto-950/30 border-alto-50":
              type === "secondary",
          }
        )}
      >
        <img
          src={Landing3}
          alt="Estudiantes resolviendo tests psicológicos"
          className="w-full h-[240px] rounded-lg opacity-80"
        />
        <div className="flex flex-col gap-4 p-4">
          <small className="p-1 px-2 text-xs bg-primary-200 text-primary-800 max-w-fit rounded-md">
            Agenda tu cita presencial en la universidad
          </small>
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold">Gabinete psicológico</h3>
            <p className="text-sm text-alto-800 leading-relaxed">
              Recuerda que es importante mantener una buena salud mental como
              estudiante, ¡Nosotros te ayudaremos!
            </p>
          </div>
          <LandingButton
            onClick={() =>
              navigate({
                to: "/",
                search: {
                  redirect: validateRoute("/calendar"),
                },
              })
            }
          >
            Comenzar
          </LandingButton>
        </div>
      </div>
      <div
        className={clsx(
          "max-xl:w-[320px] w-[440px] rounded-xl border-8 shadow-lg shadow-alto-50/30 flex flex-col",
          {
            "bg-alto-100 border-alto-100": type === "primary",
            "bg-alto-50 shadow-alto-950/30 border-alto-50":
              type === "secondary",
          }
        )}
      >
        <img
          src={Landing2}
          alt="Estudiantes resolviendo tests psicológicos"
          className="w-full h-[240px] rounded-lg opacity-80"
        />
        <div className="flex flex-col gap-4 p-4">
          <small className="p-1 px-2 text-xs bg-primary-200 text-primary-800 max-w-fit rounded-md">
            Descubre tu profesión ideal
          </small>
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold">Orientación vocacional</h3>
            <p className="text-sm text-alto-800 leading-relaxed">
              Realiza los tests de KUDER y PMA para obtener un análisis
              personalizado acerca de tus habilidades e intereses personales.
            </p>
          </div>
          <LandingButton
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
            Comenzar
          </LandingButton>
        </div>
      </div>
    </div>
  );
};

export default ServicesCards;
