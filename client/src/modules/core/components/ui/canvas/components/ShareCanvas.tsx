import { toJpeg } from "html-to-image";
import Icon from "../../../icons/Icon";
import Button from "../../Button";
import { useModal } from "../../modal/useModal";
import { toastSuccess } from "@/modules/core/utils/toasts";
import { motion } from "framer-motion";
import QRCode from "@/modules/features/tests/components/QRCode";

interface Props {
  shareLink: string;
  onFooter?: boolean;
}

const ShareCanvas = ({ shareLink, onFooter }: Props) => {
  const { modal, setOpen } = useModal();

  return (
    <>
      <div className="self-end">
        <Button
          icon={Icon.Types.SHARE}
          btnType={onFooter ? "primary" : "secondary"}
          onClick={() => setOpen(true)}
        >
          {onFooter ? "Compartir" : ""}
        </Button>
      </div>
      {modal(
        "Compartir blog",
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full"
          >
            <QRCode contents={shareLink} />
          </motion.div>
          <div className="flex flex-col gap-2 items-center">
            <div className="flex gap-2">
              <Button
                btnType="secondary"
                title="Copiar URL"
                icon={Icon.Types.CLIPBOARD}
                onClick={() => {
                  navigator.clipboard.writeText(shareLink).then(() => {
                    toastSuccess(
                      "Enlace copiado al portapapeles correctamente"
                    );
                  });
                }}
              >
                Copiar enlace
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
                    link.download = `qr_blog.jpeg`;
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
    </>
  );
};

export default ShareCanvas;
