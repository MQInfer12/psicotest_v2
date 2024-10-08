import { useMeasureContext } from "../../_layout/context/MeasureContext";
import AnswerPunctuation from "../components/AnswerPunctuation";
import AnswerTabs from "../components/AnswerTabs";
import AnswerUser from "../components/AnswerUser";
import { AnswerContextProvider } from "../context/AnswerContext";

const AnswerPage = () => {
  const { size, PRIVATE_PADDING_INLINE } = useMeasureContext();
  const isSmall = size !== "normal";
  return (
    <AnswerContextProvider>
      <div
        className="flex-1 grid pb-10 gap-x-8 gap-y-4 overflow-auto max-xl:gap-y-8"
        style={{
          paddingInline: PRIVATE_PADDING_INLINE,
          gridTemplateColumns: isSmall ? "1fr" : "420px 1fr",
          gridTemplateRows: isSmall ? "322px 420px 640px" : "auto 1fr",
          gridTemplateAreas: isSmall
            ? `
            'user'
            'punt'
            'tabs'
          `
            : `
            'user tabs'
            'punt tabs'
         `,
        }}
      >
        <AnswerUser />
        <AnswerTabs />
        <AnswerPunctuation />
      </div>
    </AnswerContextProvider>
  );
};

export default AnswerPage;
