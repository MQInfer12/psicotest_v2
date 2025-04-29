import { PUBLIC_NAVBAR_HEIGHT } from "../../_layout/constants/LAYOUT_SIZES";
import Hexagon from "./elements/Hexagon";
import LandingTitle from "./elements/LandingTitle";
import ServicesCards from "./elements/ServicesCards";

const Services = () => {
  return (
    <section
      id="services"
      className="relative min-h-[100svh] mt-20 bg-gradient-to-b from-transparent to-primary-800 flex flex-col gap-12 items-center justify-center isolate"
      style={{
        paddingBlock: PUBLIC_NAVBAR_HEIGHT * 2,
        paddingInline: PUBLIC_NAVBAR_HEIGHT,
        scrollMargin: PUBLIC_NAVBAR_HEIGHT * -1,
      }}
    >
      <div className="mt-20 w-[520px] max-w-full flex flex-col items-center z-10">
        <LandingTitle secondary>Nuestros servicios</LandingTitle>
        <p className="text-center max-sm:text-sm py-4 text-balance text-white leading-relaxed">
          ¡Mira los servicios que tenemos disponibles gratuitamente para ti!
        </p>
      </div>
      <ServicesCards>
        <div className="absolute bottom-[-90px] left-[-112px] -z-10">
          <Hexagon secondary />
        </div>
        <div className="absolute right-[-104px] top-[-112px] -z-10">
          <Hexagon secondary size={320} />
        </div>
      </ServicesCards>
    </section>
  );
};

export default Services;
