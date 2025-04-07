import clsx from "clsx";
import { useMeasureContext } from "../../_layout/context/MeasureContext";
import AnswerPunctuation from "../components/AnswerPunctuation";
import AnswerTabs from "../components/AnswerTabs";
import AnswerUser from "../components/AnswerUser";
import { AnswerContextProvider } from "../context/AnswerContext";

interface Props {
  id?: number | null;
}

const AnswerPage = ({ id }: Props) => {
  const { size, PRIVATE_PADDING_INLINE } = useMeasureContext();
  const isSmall = size !== "normal";

  return (
    <AnswerContextProvider id={id}>
      <div
        className={clsx(
          "flex-1 grid gap-x-8 gap-y-4 max-xl:pb-2 max-xl:gap-y-8 min-h-full",
          !id && "pb-10"
        )}
        style={{
          paddingInline: id ? undefined : PRIVATE_PADDING_INLINE,
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
