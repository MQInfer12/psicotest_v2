import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import { useUserContext } from "../../auth/context/UserContext";
import Input from "@/modules/core/components/ui/Input";
import { toastSuccess } from "@/modules/core/utils/toasts";
import QRCode from "./QRCode";
import { toJpeg } from "html-to-image";

interface Props {
  idTest: number;
  nombreTest: string;
}

const ShareButton = ({ idTest, nombreTest }: Props) => {
  const { modal, setOpen } = useModal();
  const { user } = useUserContext();

  const link =
    window.location.href +
    "/share" +
    `?test=${idTest}` +
    `&allocator=${user?.email}`;

  /* useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (open) {
      setShowQR(false);
      timeout = setTimeout(() => {
        setShowQR(true);
      }, 200);
    }
    return () => clearTimeout(timeout);
  }, [open]); */

  return (
    <>
      {modal(
        "Compartir test",
        <div className="flex flex-col">
          <div className="w-full aspect-square flex justify-center items-center">
            <QRCode contents={link} />
          </div>
          <div className="flex flex-col gap-2 items-center">
            <Input value={link} readOnly disabled />
            <div className="flex gap-2">
              <Button
                btnType="secondary"
                title="Copiar URL"
                icon={Icon.Types.CLIPBOARD}
                onClick={() => {
                  navigator.clipboard.writeText(link).then(() => {
                    toastSuccess(
                      "Enlace copiado al portapapeles correctamente"
                    );
                  });
                }}
              >
                Copiar
              </Button>
              <Button
                btnType="secondary"
                title="Copiar URL"
                icon={Icon.Types.DOWNLOAD}
                onClick={() => {
                  const element = document.getElementById("qr1");
                  if (!element) return;
                  toJpeg(element).then((dataUrl) => {
                    var link = document.createElement("a");
                    link.download = `psicotest_qr_${nombreTest}.jpeg`;
                    link.href = dataUrl;
                    link.click();
                  });
                }}
              >
                Descargar
              </Button>
            </div>
          </div>
        </div>
      )}
      <Button
        btnType="secondary"
        onClick={() => setOpen(true)}
        icon={Icon.Types.QR}
        title="Compartir test"
      />
    </>
  );
};

export default ShareButton;
