import UnifranzLogo from "@/assets/images/unifranz-logo.png";
import Icon from "@/modules/core/components/icons/Icon";
import { PUBLIC_NAVBAR_HEIGHT } from "../../_layout/constants/LAYOUT_SIZES";
import Landing from "../components/Landing";
import Services from "../components/Services";

const LandingPage = () => {
  return (
    <>
      <Landing />
      <section
        className="flex pt-20 items-center justify-center flex-wrap-reverse gap-20"
        style={{
          paddingInline: PUBLIC_NAVBAR_HEIGHT,
        }}
      >
        <div className="bg-alto-50 py-4 px-8 flex gap-8 rounded-xl shadow-lg shadow-primary-200 items-center flex-wrap justify-center">
          <p className="text-sm text-alto-800">¡Síguenos!</p>
          <div className="flex gap-4">
            <a
              className="min-w-6 aspect-square text-alto-900 hover:text-primary-800 hover:scale-125 transition-all duration-300 cursor-pointer"
              href="#"
            >
              <Icon type={Icon.Types.WEB} />
            </a>
            <a className="min-w-6 aspect-square text-alto-900 hover:text-primary-800 hover:scale-125 transition-all duration-300 cursor-pointer">
              <Icon type={Icon.Types.FACEBOOK} />
            </a>
            <a className="min-w-6 aspect-square text-alto-900 hover:text-primary-800 hover:scale-125 transition-all duration-300 cursor-pointer">
              <Icon type={Icon.Types.INSTAGRAM} />
            </a>
            <a className="min-w-6 aspect-square text-alto-900 hover:text-primary-800 hover:scale-125 transition-all duration-300 cursor-pointer">
              <Icon type={Icon.Types.TIKTOK} />
            </a>
            <a className="min-w-6 aspect-square text-alto-900 hover:text-primary-800 hover:scale-125 transition-all duration-300 cursor-pointer">
              <Icon type={Icon.Types.LIKEDIN} />
            </a>
          </div>
        </div>
        <div className="h-16">
          <img
            src={UnifranzLogo}
            className="h-full w-auto"
            alt="Logo de Unifranz"
          />
        </div>
      </section>
      <Services />
      {/*  <section className="h-[100svh] flex max-lg:flex-col-reverse overflow-hidden relative">
        <div className="absolute inset-0 flex">
          <div
            className="flex-[2_1_0] flex flex-col justify-between"
            style={{
              paddingLeft: PUBLIC_NAVBAR_HEIGHT,
              paddingBlock: PUBLIC_NAVBAR_HEIGHT * 2,
            }}
          >
            <div className="bg-alto-50 p-10 h-full flex flex-col justify-between rounded-xl">
              <LandingTitle>
                La jornada hacia el <span>verdadero</span> tú
              </LandingTitle>
              <div className="flex flex-col gap-10">
                <p className="max-sm:text-center max-sm:text-sm py-4  [&>span]:text-primary-800 [&>span]:font-bold">
                  Conoce tu profesión ideal, descubre tus fortalezas y
                  debilidades demostrándonos tus gustos y habilidades mediante
                  nuestros tests psicológicos de <span>KUDER</span> y{" "}
                  <span>PMA</span>.
                </p>
                <LandingButton onClick={() => {}}>Empezar</LandingButton>
              </div>
            </div>
          </div>
          <div
            className="flex-[3_1_0] grid"
            style={{
              gridTemplateColumns: "60% 1fr",
              gridTemplateRows: "1fr 1fr 1fr",
              padding: PUBLIC_NAVBAR_HEIGHT,
              paddingBlock: PUBLIC_NAVBAR_HEIGHT * 2,
              gap: PUBLIC_NAVBAR_HEIGHT / 2,
            }}
          >
            <div className="w-full h-full rounded-xl overflow-hidden bg-alto-100 border-8 shadow-lg border-alto-100 flex row-span-3">
              <img className="w-full h-full" src={LandingImg3} />
            </div>
            <div className="w-full h-full rounded-xl overflow-hidden bg-alto-100 border-8 shadow-lg border-alto-100 flex">
              <img className="w-full h-full" src={LandingImg1} />
            </div>
            <div className="w-full h-full rounded-xl overflow-hidden bg-alto-100 border-8 shadow-lg border-alto-100 flex">
              <img className="w-full h-full" src={LandingImg2} />
            </div>
            <div className="w-full h-full rounded-xl overflow-hidden bg-alto-100 border-8 shadow-lg border-alto-100 flex">
              <img className="w-full h-full" src={LandingImg3} />
            </div>
          </div>
        </div>
      </section> */}
    </>
  );
};

export default LandingPage;
