import { PRIVATE_PADDING_INLINE } from "../../_layout/constants/LAYOUT_SIZES";
import AnswerPunctuation from "../components/AnswerPunctuation";
import AnswerTabs from "../components/AnswerTabs";
import AnswerUser from "../components/AnswerUser";
import { AnswerContextProvider } from "../context/AnswerContext";

const AnswerPage = () => {
  return (
    <AnswerContextProvider>
      <div
        className="flex-1 grid pb-10 gap-x-8 gap-y-4 overflow-hidden"
        style={{
          paddingInline: PRIVATE_PADDING_INLINE,
          gridTemplateColumns: "420px auto",
          gridTemplateRows: "240px auto",
          gridTemplateAreas: `
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
