import Landing2 from "@/assets/images/landing-2-min.jpeg";
import Landing3 from "@/assets/images/landing-3-min.jpg";
import { useNavigate } from "@tanstack/react-router";
import { validateRoute } from "../../_layout/components/breadcrumb/utils/validateRoute";
import { PUBLIC_NAVBAR_HEIGHT } from "../../_layout/constants/LAYOUT_SIZES";
import Hexagon from "./elements/Hexagon";
import LandingButton from "./elements/LandingButton";
import LandingTitle from "./elements/LandingTitle";

const Services = () => {
  const navigate = useNavigate();

  return (
    <section
      className="min-h-[100svh] mt-20 bg-gradient-to-b from-alto-100 to-primary-800 flex flex-col gap-12 items-center justify-center isolate"
      style={{
        paddingBlock: PUBLIC_NAVBAR_HEIGHT * 2,
        paddingInline: PUBLIC_NAVBAR_HEIGHT,
      }}
    >
      <div className="mt-20 w-[520px] max-w-full flex flex-col items-center z-10">
        <LandingTitle secondary>Nuestros servicios</LandingTitle>
        <p className="text-center max-sm:text-sm py-4 text-balance text-white">
          ¡Mira los servicios que tenemos disponibles gratuitamente para ti!
        </p>
      </div>
      <div className="flex gap-16 gap-y-12 flex-wrap items-center justify-center relative isolate mx-14">
        <div className="absolute bottom-[-90px] left-[-112px] -z-10">
          <Hexagon secondary />
        </div>
        <div className="absolute right-[-104px] top-[-112px] -z-10">
          <Hexagon secondary size={320} />
        </div>
        <div className="max-xl:w-[320px] w-[440px] rounded-xl bg-alto-100 border-8 shadow-lg shadow-alto-50/30 border-alto-100 flex flex-col">
          <img
            src={Landing3}
            alt="Estudiantes resolviendo tests psicológicos"
            className="w-full h-[240px] rounded-lg opacity-80"
          />
          <div className="flex flex-col gap-4 p-4">
            <small className="p-1 px-2 text-xs bg-primary-200 text-primary-800 max-w-fit rounded-md">
              Agenda tu cita presencial en la Unifranz
            </small>
            <h3 className="text-xl font-bold">Gabinete psicológico</h3>
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
        <div className="max-xl:w-[320px] w-[440px] rounded-xl bg-alto-100 border-8 shadow-lg shadow-alto-50/30 border-alto-100 flex flex-col">
          <img
            src={Landing2}
            alt="Estudiantes resolviendo tests psicológicos"
            className="w-full h-[240px] rounded-lg opacity-80"
          />
          <div className="flex flex-col gap-4 p-4">
            <small className="p-1 px-2 text-xs bg-primary-200 text-primary-800 max-w-fit rounded-md">
              Descubre tu profesión ideal
            </small>
            <h3 className="text-xl font-bold">Análisis vocacional</h3>
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
      </div>
    </section>
  );
};

export default Services;