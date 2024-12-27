import { useEffect, useState } from "react";
import { useLoginContext } from "../../auth/context/LoginContext";
import { CAROUSEL_ITEMS } from "../constants/CAROUSEL_ITEMS";
import { PUBLIC_NAVBAR_HEIGHT } from "../../_layout/constants/LAYOUT_SIZES";
import { motion } from "framer-motion";
import Hexagon from "./elements/Hexagon";
import LandingTitle from "./elements/LandingTitle";
import LandingButton from "./elements/LandingButton";
import clsx from "clsx";
import { shadowClasses } from "../constants/LANDING_SHADOWS";

const Landing = () => {
  const { setOpen } = useLoginContext();
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const interval = setTimeout(() => {
      setCarouselIndex((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
    }, 4000);
    return () => {
      clearTimeout(interval);
    };
  }, [carouselIndex]);

  return (
    <section className="min-h-[100svh] flex max-lg:flex-col-reverse">
      <div
        className="flex-1 relative flex items-center justify-center isolate max-lg:mb-[80px]"
        style={{
          paddingTop: PUBLIC_NAVBAR_HEIGHT,
        }}
      >
        <div className="flex flex-col absolute mr-80 mt-80 gap-2 z-10 max-xl:mr-0 max-xl:items-center">
          <div className="bg-alto-50 p-2 shadow-lg rounded-md flex flex-col gap-2 max-w-fit">
            <small className="p-1 px-2 text-xs bg-primary-200 text-primary-800 max-w-fit rounded-md whitespace-nowrap">
              Resuelve tests y obtén tus resultados
            </small>
          </div>
          <div className="bg-alto-50 p-2 shadow-lg rounded-md flex flex-col gap-2 max-w-fit">
            <small className="p-1 px-2 text-xs bg-primary-200 text-primary-800 max-w-fit rounded-md whitespace-nowrap">
              Agenda citas con tus psicólogos
            </small>
          </div>
        </div>
        <div className="flex flex-col gap-4 items-center">
          <div className="max-xl:w-[320px] max-xl:h-[400px] w-[440px] h-[560px] rounded-xl bg-alto-100 border-8 shadow-lg border-alto-100 flex">
            {CAROUSEL_ITEMS.map((image, i) => (
              <motion.img
                key={i}
                src={image}
                alt="Estudiantes resolviendo tests psicológicos"
                animate={{
                  translateX: `-${carouselIndex * 100}%`,
                }}
                className="w-full h-full"
                transition={{
                  ease: "easeIn",
                  duration: 0.6,
                }}
              />
            ))}
          </div>
          {/*  <div className="px-4 py-2 bg-alto-50 rounded-md shadow-md max-w-fit flex gap-2">
            {CAROUSEL_ITEMS.map((_, i) => (
              <motion.button
                key={i}
                animate={{
                  width: carouselIndex === i ? 40 : 20,
                  backgroundColor:
                    carouselIndex === i
                      ? COLORS.primary[500]
                      : COLORS.alto[200],
                }}
                transition={{
                  ease: "easeIn",
                  duration: 0.6,
                }}
                className={clsx("h-2 rounded-md")}
                onClick={() => setCarouselIndex(i)}
              />
            ))}
          </div> */}
        </div>
        <div className="absolute -z-10 mr-96 mb-[480px] max-xl:mb-[420px] max-xl:mr-[200px]">
          <Hexagon size={380} />
        </div>
        <div className="absolute -z-10 ml-96 mb-[-520px] max-xl:mb-[-420px] max-xl:ml-[180px]">
          <Hexagon />
        </div>
      </div>
      <div
        style={{
          paddingTop: PUBLIC_NAVBAR_HEIGHT * 2,
          paddingInline: 20,
          paddingBottom: PUBLIC_NAVBAR_HEIGHT,
        }}
        className={clsx(
          "flex-1 max-xl:flex-[1.5_1_0] flex items-center justify-center bg-alto-50 rounded-bl-[80px] z-10 max-lg:rounded-b-[80px]",
          shadowClasses
        )}
      >
        <motion.div
          initial={{
            opacity: 0,
            translateX: "100%",
          }}
          animate={{
            opacity: 1,
            translateX: 0,
          }}
          transition={{
            type: "spring",
            bounce: 0.02,
            delay: 0.5,
          }}
          className="flex flex-col max-sm:items-center gap-4 w-[520px] isolate relative"
        >
          <small className="p-1 px-2 text-xs bg-primary-200 text-primary-800 max-w-fit rounded-md">
            Novedad: Nuevos tests psicológicos
          </small>
          <LandingTitle>
            Obtén apoyo de <span>psicólogos</span> especializados de la{" "}
            <span>Unifranz</span>
          </LandingTitle>
          <p className="max-sm:text-center max-sm:text-sm py-4 text-balance">
            Obtén apoyo del gabinete psicológico utilizando un calendario simple
            e intuitivo y realiza tus tests de una manera moderna junto a ellos.
          </p>
          <div>
            <LandingButton onClick={() => setOpen(true)}>
              ¡Inicia sesión para comenzar!
            </LandingButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Landing;
