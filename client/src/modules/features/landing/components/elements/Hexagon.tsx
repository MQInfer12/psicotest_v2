import { useThemeContext } from "@/modules/core/context/ThemeContext";
import { motion } from "framer-motion";

interface Props {
  size?: number;
  secondary?: boolean;
}

const Hexagon = ({ size = 240, secondary }: Props) => {
  const { dark, COLORS } = useThemeContext();

  const primaryAlto = dark ? COLORS.alto[800] : COLORS.alto[200];
  const primary1 = dark ? COLORS.primary[500] : COLORS.primary[200];
  const primary2 = dark ? COLORS.primary[400] : COLORS.primary[400];

  return (
    <div style={{ height: size }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-hexagon"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <motion.path
          initial={{
            pathLength: 0,
          }}
          animate={{
            pathLength: 1,
            stroke: [primaryAlto, secondary ? primary2 : primary1, primaryAlto],
          }}
          transition={{
            pathLength: { duration: 2 },
            stroke: {
              delay: 2,
              duration: 6,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            },
          }}
          d="M19.875 6.27a2.225 2.225 0 0 1 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z"
        />
      </svg>
    </div>
  );
};

export default Hexagon;
