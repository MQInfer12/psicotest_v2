import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import { useUserContext } from "../../auth/context/UserContext";
import Input from "@/modules/core/components/ui/Input";
import { toastSuccess } from "@/modules/core/utils/toasts";
import QRCode from "./QRCode";
import { toJpeg } from "html-to-image";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { useState } from "react";

interface Props {
  idTest: number;
  nombreTest: string;
}

const ShareButton = ({ idTest, nombreTest }: Props) => {
  const { modal, setOpen } = useModal();
  const { user } = useUserContext();
  const { fetchData } = useFetch();
  const { data } = fetchData("GET /carpeta");
  const [carpetaId, setCarpetaId] = useState("");

  const link =
    window.location.href +
    "/share" +
    `?test=${idTest}` +
    `&allocator=${user?.email}` +
    (carpetaId ? `&folder=${carpetaId}` : "");

  return (
    <>
      {modal(
        "Compartir test",
        <div className="flex flex-col">
          <div className="flex w-full">
            <Input
              label="Carpeta"
              type="select"
              value={carpetaId}
              onChange={(e) => setCarpetaId(e.target.value)}
            >
              <option value="">Selecciona una carpeta</option>
              {data?.map((carpeta) => (
                <option key={carpeta.id} value={carpeta.id}>
                  {carpeta.descripcion}
                </option>
              ))}
            </Input>
          </div>
          <div className="w-full aspect-square flex justify-center items-center">
            <QRCode contents={link} />
          </div>
          <div className="flex flex-col gap-2 items-center">
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
