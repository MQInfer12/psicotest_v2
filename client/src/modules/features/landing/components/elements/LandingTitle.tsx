import clsx from "clsx";
import React from "react";

interface Props {
  children: React.ReactNode;
  secondary?: boolean;
}

const LandingTitle = ({ children, secondary }: Props) => {
  return (
    <h2
      className={clsx(
        "max-sm:text-center max-sm:text-2xl text-4xl font-bold text-balance leading-normal",
        {
          "text-alto-950 [&>span]:text-primary-800": !secondary,
          "text-alto-50": secondary,
        }
      )}
    >
      {children}
    </h2>
  );
};

export default LandingTitle;
