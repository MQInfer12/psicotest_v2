import { Seccion } from "@/modules/features/tests/types/TestType";
import { TEST_CAROUSEL_VARIANT } from "../constants/TEST_CAROUSEL_VARIANT";
import { motion } from "framer-motion";
import clsx from "clsx";

interface Props {
  direction: number;
  seccion: Seccion | undefined;
}

const TestSection = ({ direction, seccion }: Props) => {
  return (
    <motion.div
      variants={TEST_CAROUSEL_VARIANT}
      custom={direction}
      initial="enter"
      animate="active"
      exit="exit"
      className="absolute inset-0 flex flex-col overflow-auto gap-4 py-8 px-12 max-md:py-4 max-md:px-2"
    >
      {seccion?.description?.map((v, i) => {
        switch (v.type) {
          case "paragraph":
            return (
              <p
                key={i}
                className={clsx("text-sm leading-loose text-alto-900 px-4", {
                  "text-center": v.align === "center",
                })}
              >
                {v.content}
              </p>
            );
          case "title":
            return (
              <strong
                key={i}
                className="px-4 text-primary-800 border-b-2 border-primary-200 pb-2"
              >
                {v.content}
              </strong>
            );
        }
      })}
    </motion.div>
  );
};

export default TestSection;
