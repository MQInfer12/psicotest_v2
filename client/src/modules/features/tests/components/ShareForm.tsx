import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import Input from "@/modules/core/components/ui/Input";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { cypherUrl } from "@/modules/core/utils/crypto";
import { formatStringList } from "@/modules/core/utils/formatStringList";
import { toastError, toastSuccess } from "@/modules/core/utils/toasts";
import { motion } from "framer-motion";
import { toJpeg } from "html-to-image";
import { useState } from "react";
import { useUserContext } from "../../auth/context/UserContext";
import QRCode from "./QRCode";
import ShareSelectVersion from "./ShareSelectVersion";

interface Props {
  tests: {
    id: number;
    nombre: string;
  }[];
  children?: React.ReactNode;
}

const ShareForm = ({ tests, children }: Props) => {
  const { fetchData } = useFetch();
  const { data } = fetchData("GET /carpeta");
  const { user } = useUserContext();
  const [carpetaId, setCarpetaId] = useState("");
  const [selectedVersionIds, setSelectedVersionIds] = useState<
    {
      idTest: number;
      idVersion: number;
    }[]
  >([]);
  const [link, setLink] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedVersions = selectedVersionIds.filter((v) =>
      tests.some((t) => t.id === v.idTest)
    );
    if (selectedVersions.length !== tests.length) {
      return toastError("Debes seleccionar una versión para cada test");
    }
    const ids = selectedVersions.map((v) => v.idVersion);
    const params =
      `test=${JSON.stringify(ids)}` +
      `&allocator=${user?.email}` +
      (carpetaId ? `&folder=${carpetaId}` : "");
    const cryptedParams = cypherUrl(params);
    const link =
      window.location.href.replaceAll("?", "") +
      `/share?cparams=${encodeURIComponent(cryptedParams)}`;
    setLink(link);
  };

  console.log(link);

  const titleLink = `QR para compartir los tests de ${formatStringList(tests.map((test) => test.nombre))}`;
  return (
    <div className="flex flex-col">
      {link ? (
        <div className="flex flex-col items-center justify-between p-4 h-96">
          <small
            title={titleLink}
            className="text-center font-medium text-alto-950 dark:text-alto-50 whitespace-nowrap text-ellipsis overflow-hidden w-full"
          >
            {titleLink}
          </small>
          <div className="w-[280px] h-[280px] flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full h-full"
            >
              <QRCode contents={link} />
            </motion.div>
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
                    link.download = `neurall_qr_${tests.map((test) => test.nombre).join("_")}.jpeg`;
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
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col relative h-96"
        >
          <div className="flex flex-col flex-1 gap-4 overflow-x-hidden overflow-y-scroll p-4 pr-[8px]">
            <Input
              label="Carpeta"
              type="select"
              value={carpetaId}
              onChange={(e) => setCarpetaId(e.target.value)}
              required
            >
              <option value="">Sin clasificación</option>
              {data?.map((carpeta) => (
                <option key={carpeta.id} value={carpeta.id}>
                  {carpeta.descripcion}
                </option>
              ))}
            </Input>
            {children}
            {tests.map((test) => (
              <ShareSelectVersion
                key={test.id}
                idTest={test.id}
                nombre={test.nombre}
                value={
                  selectedVersionIds.find((v) => v.idTest === test.id)
                    ?.idVersion
                }
                onChange={(newValue) => {
                  if (newValue === null) {
                    setSelectedVersionIds((prev) =>
                      prev.filter((v) => v.idTest !== test.id)
                    );
                  } else {
                    setSelectedVersionIds((prev) => {
                      const exist = prev.find((v) => v.idTest === test.id);
                      if (exist) {
                        return prev.map((v) =>
                          v.idTest === test.id
                            ? { ...v, idVersion: newValue }
                            : v
                        );
                      }
                      return [
                        ...prev,
                        { idTest: test.id, idVersion: newValue },
                      ];
                    });
                  }
                }}
              />
            ))}
          </div>
          <div className="pb-4 px-4 flex flex-col">
            <Button type="submit">Siguiente</Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ShareForm;
