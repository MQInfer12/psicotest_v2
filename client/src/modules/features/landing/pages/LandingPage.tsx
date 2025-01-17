import AnoyingButton from "../components/AnoyingButton";
import Footer from "../components/Footer";
import Landing from "../components/Landing";
import Services from "../components/Services";

const LandingPage = () => {
  return (
    <>
      <AnoyingButton />
      <Landing />
      <Services />
      <Footer />
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
