import GPT from "@/assets/images/gpt.png";
import clsx from "clsx";
import GptPdf, { GptPdfData } from "./GptPdf";
import Button from "@/modules/core/components/ui/Button";
import { useEffect, useState } from "react";
import Icon from "@/modules/core/components/icons/Icon";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import GptContent from "./GptContent";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toasts";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { useSendMail } from "../../hooks/useSendMail";
import { T_Tests_Respuestas } from "@/modules/features/tests/api/responses";

interface Props {
  content: string;
  loaded: boolean;
  data: GptPdfData;
  reload?: () => void;
  success?: boolean;
  setContent: React.Dispatch<React.SetStateAction<string | null>>;
  idRespuestas: number[];
  onChangePDF?: (showPDF: boolean) => void;
  alreadySendedMail?: boolean;
  onSuccessSendMail?: (data: T_Tests_Respuestas[]) => void;
}

const GptCanvas = ({
  content,
  loaded,
  data,
  reload,
  success = true,
  setContent,
  idRespuestas,
  onChangePDF,
  alreadySendedMail,
  onSuccessSendMail,
}: Props) => {
  const [edit, setEdit] = useState<string | null>(null);
  const [showPDF, setShowPDF] = useState(false);
  const [sendedMail, setSendedMail] = useState(!!alreadySendedMail);

  useEffect(() => {
    onChangePDF?.(showPDF);
  }, [showPDF]);

  const { postData } = useFetch();
  const patchMutation = postData("PATCH /respuesta/patch/interpretations");

  const handleSave = () => {
    if (!edit) return;
    patchMutation(
      {
        interpretaciones: idRespuestas.map((id) => ({
          id: id,
          interpretacion: edit,
        })),
      },
      {
        onSuccess: () => {
          toastSuccess("Guardado correctamente");
          setContent(edit);
          setEdit(null);
        },
      }
    );
  };

  const { handleSendMail } = useSendMail();
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
          <GptContent edit={edit} setEdit={setEdit} content={content} />
        )}
      </div>
      <div
        className={clsx("bottom-5 right-5 absolute flex gap-4 items-end", {
          "flex-col": showPDF,
        })}
      >
        {success && showPDF && (
          <>
            <PDFDownloadLink
              document={<GptPdf data={data} content={content} />}
              fileName={`${data.name.toLocaleLowerCase().replaceAll(" ", "_")}.pdf`}
            >
              <Button btnType="secondary" icon={Icon.Types.DOWNLOAD} />
            </PDFDownloadLink>
          </>
        )}
        {reload && !showPDF && (
          <Button
            btnType={success ? "secondary" : "primary"}
            onClick={() => {
              if (success) {
                toastConfirm("La interpretación se volverá a generar", reload);
              } else {
                reload();
              }
            }}
            icon={Icon.Types.RELOAD}
            disabled={!!edit || !content || !loaded}
          />
        )}
        {!showPDF && (
          <>
            <Button
              title="Enviar mail al evaluado"
              btnType="secondary"
              onClick={() =>
                handleSendMail(idRespuestas, (data) => {
                  setSendedMail(true);
                  onSuccessSendMail?.(data);
                })
              }
              disabled={!success || !content || !loaded || !!edit}
              icon={Icon.Types.MAIL}
              subicon={sendedMail ? Icon.Types.CHECK : undefined}
              success={sendedMail}
            />
            <Button
              title={edit ? "Terminar edición" : "Editar contenido"}
              btnType={edit ? "primary" : "secondary"}
              onClick={() => {
                if (edit) {
                  toastConfirm("¿Quieres guardar los cambios?", handleSave, {
                    title: "Terminar edición",
                    cancelable: true,
                    onCancel: () => {
                      setEdit(null);
                    },
                  });
                  return;
                } else {
                  setEdit(content);
                }
              }}
              disabled={!success || !content || !loaded}
              icon={edit ? Icon.Types.PENCIL_CANCEL : Icon.Types.PENCIL}
            />
          </>
        )}
        <Button
          onClick={() => setShowPDF(!showPDF)}
          disabled={!!edit || !success || !content || !loaded}
          icon={showPDF ? Icon.Types.X : Icon.Types.PDF}
        >
          PDF
        </Button>
      </div>
    </div>
  );
};

export default GptCanvas;
