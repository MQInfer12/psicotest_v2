import { useEffect, useState } from "react";
import LoginButton from "../../auth/components/LoginButton";
import { useLoginContext } from "../../auth/context/LoginContext";
import { motion, Variants } from "framer-motion";
import Loader from "@/modules/core/components/ui/loader/Loader";

const variant: Variants = {
  rest: {
    scaleX: 0,
  },
  hover: {
    scaleX: 1,
  },
};

const LoginLink = () => {
  const { loading } = useLoginContext();
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.div
      initial="rest"
      animate="rest"
      whileHover="hover"
      className="relative flex flex-col items-center pb-1"
    >
      {loading ? (
        <div className="-mt-[18px]">
          <Loader text="" scale="0.4" />
        </div>
      ) : (
        <>
          <LoginButton type={width <= 640 ? "icon" : "standard"} />
          <motion.span
            variants={variant}
            className="origin-center block absolute bottom-0 left-0 w-full h-[1px] bg-primary-700"
          />
        </>
      )}
    </motion.div>
  );
};

export default LoginLink;
