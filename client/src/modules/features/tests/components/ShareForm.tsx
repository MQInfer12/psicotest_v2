import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import { toastSuccess } from "@/modules/core/utils/toasts";
import { toJpeg } from "html-to-image";
import QRCode from "./QRCode";
import Input from "@/modules/core/components/ui/Input";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { useUserContext } from "../../auth/context/UserContext";
import { useMemo, useState } from "react";
import { cypherUrl } from "@/modules/core/utils/crypto";
import { motion } from "framer-motion";

interface Props {
  idTests: number[];
  nombreTest: string;
  children?: React.ReactNode;
}

const ShareForm = ({ idTests, nombreTest, children }: Props) => {
  const { fetchData } = useFetch();
  const { data } = fetchData("GET /carpeta");
  const { user } = useUserContext();
  const [carpetaId, setCarpetaId] = useState("");

  const link = useMemo(() => {
    const params =
      `test=${JSON.stringify(idTests)}` +
      `&allocator=${user?.email}` +
      (carpetaId ? `&folder=${carpetaId}` : "");
    const cryptedParams = cypherUrl(params);
    return (
      window.location.href.replaceAll("?", "") +
      `/share?cparams=${cryptedParams}`
    );
  }, [user, carpetaId, idTests]);

  return (
    <div className="flex flex-col">
      <div className="flex w-full flex-col gap-4">
        {children}
        <Input
          label="Carpeta"
          type="select"
          value={carpetaId}
          onChange={(e) => setCarpetaId(e.target.value)}
          required
        >
          <option value="">Sin clasificación</option>
          {data
            ?.filter((c) => c.tipo === "propia" || c.tipo === "global")
            .map((carpeta) => (
              <option key={carpeta.id} value={carpeta.id}>
                {carpeta.descripcion}
              </option>
            ))}
        </Input>
      </div>
      <div className="w-full aspect-square flex justify-center items-center">
        {idTests.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full"
          >
            <QRCode contents={link} />
          </motion.div>
        ) : (
          <small className="text-alto-950 dark:text-alto-50">
            Selecciona al menos un test para compartirlo
          </small>
        )}
      </div>
      <div className="flex flex-col gap-2 items-center">
        <div className="flex gap-2">
          <Button
            btnType="secondary"
            title="Copiar URL"
            icon={Icon.Types.CLIPBOARD}
            onClick={() => {
              navigator.clipboard.writeText(link).then(() => {
                toastSuccess("Enlace copiado al portapapeles correctamente");
              });
            }}
            disabled={idTests.length === 0}
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
                link.download = `neurall_qr_${nombreTest}.jpeg`;
                link.href = dataUrl;
                link.click();
              });
            }}
            disabled={idTests.length === 0}
          >
            Descargar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShareForm;
