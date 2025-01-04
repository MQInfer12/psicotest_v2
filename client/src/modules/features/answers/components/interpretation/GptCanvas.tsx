import GPT from "@/assets/images/gpt.png";
import clsx from "clsx";
import GptPdf, { GptPdfData } from "./GptPdf";
import Button from "@/modules/core/components/ui/Button";
import { useState } from "react";
import Icon from "@/modules/core/components/icons/Icon";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";

interface Props {
  content: string;
  loaded: boolean;
  data: GptPdfData;
  reload?: () => void;
  success?: boolean;
}

const GptCanvas = ({
  content,
  loaded,
  data,
  reload,
  success = true,
}: Props) => {
  const [showPDF, setShowPDF] = useState(false);

  return (
    <div className="bg-alto-50 dark:bg-alto-1000 flex-1 relative isolate">
      <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none overflow-visible">
        <img src={GPT} className="min-w-[540px] h-auto opacity-5" />
      </div>
      <div className="absolute inset-0 flex-1 overflow-auto">
        {showPDF ? (
          <PDFViewer height="100%" width="100%">
            <GptPdf data={data} content={content} />
          </PDFViewer>
        ) : (
          <p
            dangerouslySetInnerHTML={{ __html: content }}
            className={clsx(
              "w-full min-h-full whitespace-pre-line text-sm leading-[30px] px-8 py-6 pb-20 max-md:text-xs max-md:leading-[30px] max-md:px-4 max-md:pt-4 text-alto-800 dark:text-alto-300",
              "[&>.title]:text-base [&>.title]:font-bold [&>.title]:text-alto-950 dark:[&>.title]:text-alto-50",
              "[&>.subtitle]:font-semibold [&>.subtitle]:text-alto-950 dark:[&>.subtitle]:text-alto-50",
              "[&>.vignette]:box-decoration-clone [&>.vignette]:pl-8 [&_.vignette-title]:font-semibold [&_.vignette-t]:font-semibold [&_.vignette-title]:text-alto-950 dark:[&_.vignette-title]:text-alto-50 [&_.vignette-t]:text-alto-950 dark:[&_.vignette-t]:text-alto-50"
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
      <div
        className={clsx(
          "bottom-5 right-5 absolute flex flex-col gap-4 items-end"
        )}
      >
        {success && showPDF && (
          <PDFDownloadLink
            document={<GptPdf data={data} content={content} />}
            fileName={`${data.name.toLocaleLowerCase().replaceAll(" ", "_")}.pdf`}
          >
            <Button btnType="secondary" icon={Icon.Types.DOWNLOAD} />
          </PDFDownloadLink>
        )}
        {reload && !showPDF && (
          <Button
            btnType={success ? "secondary" : "primary"}
            onClick={reload}
            icon={Icon.Types.RELOAD}
            disabled={!content || !loaded}
          />
        )}
        <Button
          onClick={() => setShowPDF(!showPDF)}
          disabled={!success || !content || !loaded}
          icon={showPDF ? Icon.Types.X : Icon.Types.PDF}
        >
          PDF
        </Button>
      </div>
    </div>
  );
};

export default GptCanvas;
