import { useEffect, useState } from "react";
import { PUBLIC_NAVBAR_HEIGHT } from "../../_layout/constants/LAYOUT_SIZES";
import Hexagon from "../components/Hexagon";
import { motion } from "framer-motion";
import { CAROUSEL_ITEMS } from "../constants/CAROUSEL_ITEMS";
import clsx from "clsx";
import { COLORS } from "@/modules/core/constants/COLORS";

const LandingPage = () => {
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
    <section className="h-screen flex">
      <div
        className="flex-1 relative flex items-center justify-center isolate"
        style={{
          paddingTop: PUBLIC_NAVBAR_HEIGHT,
        }}
      >
        <div className="flex flex-col absolute mr-80 mt-80 gap-2 z-10">
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
          <div className="w-[440px] h-[560px] rounded-xl overflow-hidden bg-alto-100 border-8 shadow-lg border-alto-100 flex">
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
          <div className="px-4 py-2 bg-alto-50 rounded-md shadow-md max-w-fit flex gap-2">
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
          </div>
        </div>
        <div className="absolute -z-10 mr-96 mb-[480px]">
          <Hexagon size={380} />
        </div>
        <div className="absolute -z-10 ml-96 mb-[-520px]">
          <Hexagon />
        </div>
      </div>
      <div
        style={{
          paddingTop: PUBLIC_NAVBAR_HEIGHT,
        }}
        className="flex-1 flex items-center justify-center bg-alto-50  rounded-bl-[100px]"
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
            delay: 0.4,
          }}
          className="flex flex-col gap-4 w-[520px] isolate relative"
        >
          <small className="p-1 px-2 text-xs bg-primary-200 text-primary-800 max-w-fit rounded-md">
            Novedad: Nuevos tests psicológicos
          </small>
          <h2 className="text-4xl font-bold text-balance [&>span]:text-primary-800 leading-normal">
            Apóyate de los <span>psicólogos</span> especializados de la{" "}
            <span>Unifranz</span>
          </h2>
          <p className="py-4 text-balance">
            Obtén apoyo del gabinete psicológico utilizando un calendario simple
            e intuitivo y realiza tus tests de una manera moderna junto a ellos.
          </p>
          <div>
            <button className="bg-primary-500 hover:bg-primary-600 active:bg-primary-700 p-2 px-6 rounded-md text-white transition-all duration-300">
              ¡Inicia sesión para comenzar!
            </button>
          </div>
          {/* <div className="absolute -z-10">
            <Hexagon size={640} />
          </div> */}
        </motion.div>
      </div>
    </section>
  );
};

export default LandingPage;
