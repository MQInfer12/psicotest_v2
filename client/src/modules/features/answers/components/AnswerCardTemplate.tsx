import Icon, { ICON } from "@/modules/core/components/icons/Icon";
import React, { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { COLORS } from "@/modules/core/constants/COLORS";
import { useThemeContext } from "@/modules/core/context/ThemeContext";

interface Props {
  tabs: {
    title: string;
    icon?: ICON;
    component: React.ReactNode;
  }[];
  gridArea: string;
}

/* const TAB_VARIANT: Variants = {
  enter: (direction: number) => ({
    x: direction >= 0 ? "100%" : "-100%",
  }),
  active: {
    x: 0,
  },
  exit: (direction: number) => ({
    x: direction >= 0 ? "100%" : "-100%",
  }),
}; */

const AnswerCardTemplate = ({ tabs, gridArea }: Props) => {
  if (tabs.length === 0) {
    throw new Error("tabs tiene que tener al menos un item.");
  }

  const { dark } = useThemeContext();

  const id = useId();
  const isTabs = tabs.length > 1;
  const [config, setConfig] = useState<[number, number] | null>(
    isTabs ? [0, 1] : null
  );
  let activeTab: number | null = null;
  /* let direction = 1; */
  if (config) {
    activeTab = config[0];
    /* direction = config[1]; */
  }

  const setActiveTab = (newTab: number) => {
    if (activeTab === null) return;
    const newDirection = newTab - activeTab;
    setConfig([newTab, newDirection]);
  };

  return (
    <div
      style={{
        gridArea,
      }}
      className="w-full h-full flex flex-col gap-1 overflow-hidden"
    >
      <div className="flex">
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.title}
            disabled={!isTabs}
            initial={false}
            animate={{
              color:
                !isTabs || index === activeTab
                  ? dark
                    ? COLORS.alto[100]
                    : COLORS.alto[900]
                  : dark
                    ? COLORS.alto[700]
                    : COLORS.alto[300],
            }}
            className="flex px-2 pb-1 gap-2 relative"
            onClick={() => setActiveTab(index)}
          >
            <h3 className="text-base font-bold">{tab.title}</h3>
            {tab.icon && (
              <div className="w-5 aspect-square">
                <Icon type={tab.icon} />
              </div>
            )}
            {isTabs && index === activeTab && (
              <motion.span
                layoutId={id}
                className="absolute bottom-[2px] left-0 w-full h-[2px] bg-primary-400 rounded-full"
              />
            )}
          </motion.button>
        ))}
      </div>
      {/* <h3 className="text-xl pl-2 font-bold">{title}</h3> */}
      <div className="flex-1 flex flex-col bg-alto-50 dark:bg-alto-1000 rounded-lg overflow-hidden border border-alto-300/70 dark:border-alto-900 relative">
        {isTabs ? (
          <AnimatePresence initial={false}>
            <motion.div
              /*  key={activeTab}
              variants={TAB_VARIANT}
              custom={direction}
              initial="enter"
              animate="active"
              exit="exit"
              transition={{
                bounce: 1,
              }} */
              className="absolute inset-0 overflow-hidden flex flex-col rounded-lg"
            >
              {tabs[activeTab ?? 0].component}
            </motion.div>
          </AnimatePresence>
        ) : (
          tabs[0].component
        )}
      </div>
    </div>
  );
};

export default AnswerCardTemplate;
