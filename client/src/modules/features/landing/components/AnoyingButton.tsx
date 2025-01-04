import Icon from "@/modules/core/components/icons/Icon";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const AnoyingButton = () => {
  const [onTop, setOnTop] = useState(window.scrollY === 0);

  useEffect(() => {
    const handleScrollEvent = () => {
      setOnTop(window.scrollY === 0);
    };
    window.addEventListener("scroll", handleScrollEvent);
    return () => {
      window.removeEventListener("scroll", handleScrollEvent);
    };
  }, []);

  const handleScrollTo = () => {
    const element = document.getElementById("services");
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="absolute z-20 pointer-events-none top-0 left-0 h-[100svh] w-full">
      <div className="relative h-full w-full flex justify-center">
        <AnimatePresence>
          {onTop && (
            <motion.button
              onClick={handleScrollTo}
              initial={{
                opacity: 0,
                translateY: -32,
              }}
              animate={{
                scaleX: [1, 0.9, 1],
                opacity: 1,
                translateY: 0,
              }}
              exit={{
                opacity: 0,
                translateY: 32,
                transition: {
                  delay: 0,
                },
              }}
              transition={{
                delay: 1.5,
                duration: 1,
                scaleX: {
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                },
              }}
              className="absolute bottom-4 py-1 px-20 rounded-lg bg-gradient-to-b from-transparent to-primary-500/20 dark:to-primary-400/20 cursor-pointer pointer-events-auto"
            >
              <motion.div
                animate={{
                  translateY: [0, 3, 0],
                }}
                transition={{
                  translateY: {
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                  },
                }}
                className="w-10 aspect-square text-primary-600 dark:text-primary-300"
              >
                <Icon type={Icon.Types.CHEVRON_DOWN} />
              </motion.div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnoyingButton;
