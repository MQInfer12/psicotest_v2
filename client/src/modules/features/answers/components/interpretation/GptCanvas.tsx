import GPT from "@/assets/images/gpt.png";
import clsx from "clsx";
import GptPdf from "./GptPdf";
import Button from "@/modules/core/components/ui/Button";
import { useState } from "react";
import Icon from "@/modules/core/components/icons/Icon";

interface Props {
  content: string;
  loaded: boolean;
}

const GptCanvas = ({ content, loaded }: Props) => {
  const [showPDF, setShowPDF] = useState(false);

  return (
    <div className="bg-alto-50 flex-1 overflow-x-hidden overflow-y-scroll relative isolate">
      <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none overflow-visible">
        <img src={GPT} className="min-w-[540px] h-auto opacity-5" />
      </div>
      <div className="absolute inset-0 flex-1 overflow-auto">
        {showPDF ? (
          <GptPdf content={content} />
        ) : (
          <p
            dangerouslySetInnerHTML={{ __html: content }}
            className={clsx(
              "w-full min-h-full whitespace-pre-line text-sm leading-[30px] px-8 py-4 pb-20",
              "[&>.title]:text-base [&>.title]:font-bold",
              "[&>.subtitle]:font-semibold",
              "[&>.vignette]:box-decoration-clone [&>.vignette]:pl-8 [&_.vignette-title]:font-semibold"
            )}
          />
        )}
      </div>
      {/* {showPDF ? (
      ) : (
        <>
          <div className="sticky h-0 w-full top-1/2 flex items-center justify-center -z-10 pointer-events-none overflow-visible">
            <img src={GPT} className="min-w-[540px] h-auto opacity-5" />
          </div>
        </>
      )} */}
      <div className={clsx("bottom-4 right-4 absolute")}>
        <Button
          onClick={() => setShowPDF(!showPDF)}
          disabled={!content || !loaded}
          icon={showPDF ? Icon.Types.X : Icon.Types.PDF}
        >
          PDF
        </Button>
      </div>
    </div>
  );
};

export default GptCanvas;
