import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import { Folder } from "../api/responses";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import FolderForm from "./FolderForm";
import Loader from "@/modules/core/components/ui/loader/Loader";
import { motion } from "framer-motion";

interface Props {
  selectedFolders: number[];
  setSelectedFolders: React.Dispatch<React.SetStateAction<number[]>>;
  loading: boolean;
}

const FolderList = ({
  selectedFolders,
  setSelectedFolders,
  loading,
}: Props) => {
  const { fetchData } = useFetch();
  const { data, setData } = fetchData("GET /carpeta");
  const { modal, setOpen } = useModal<Folder>();

  const handleSelectFolder = (id: number) => {
    setSelectedFolders((prev) => {
      const exists = prev.some((folderId) => folderId === id);
      if (exists) {
        return prev.filter((folderId) => folderId !== id);
      }
      return [...prev, id];
    });
  };

  return (
    <>
      {modal("Formulario de carpeta", (item) => (
        <FolderForm
          folder={item}
          onSuccess={(folder) => {
            if (!item) {
              setData((prev) => [...prev, folder]);
            } else {
              setData((prev) =>
                prev.map((v) => (v.id === item.id ? folder : v))
              );
            }
            setOpen(false);
          }}
          onSuccessDelete={(folder) => {
            setData((prev) => prev.filter((v) => v.id !== folder.id));
            setOpen(false);
          }}
        />
      ))}
      <div className="w-80 flex flex-col gap-2">
        {data ? (
          <>
            <div className="h-9 flex items-center justify-between relative">
              <strong>Carpetas propias</strong>
              <Button
                btnType="tertiary"
                btnSize="small"
                title="Añadir carpeta"
                icon={Icon.Types.FOLDER_ADD}
                onClick={() => setOpen(true)}
              />
              {loading && (
                <motion.span
                  animate={{
                    opacity: [0.2, 1],
                    width: ["10%", "100%"],
                  }}
                  transition={{
                    opacity: {
                      duration: 1,
                      repeat: Infinity,
                      repeatType: "mirror",
                      ease: "easeInOut",
                    },
                    width: {
                      duration: 1,
                      repeat: Infinity,
                      repeatType: "mirror",
                      ease: "easeInOut",
                    },
                  }}
                  className="block absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] bg-primary-700"
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Button
                width="100%"
                btnType={selectedFolders.includes(0) ? "primary" : "secondary"}
                btnSize="small"
                icon={
                  selectedFolders.includes(0)
                    ? Icon.Types.FOLDER_OPEN
                    : Icon.Types.FOLDER
                }
                textAlign="start"
                reverse
                onClick={() => handleSelectFolder(0)}
              >
                Sin clasificación
              </Button>
              {data?.map((folder) => (
                <div key={folder.id} className="flex gap-2">
                  <div className="flex-1 overflow-hidden">
                    <Button
                      width="100%"
                      btnType={
                        selectedFolders.includes(folder.id)
                          ? "primary"
                          : "secondary"
                      }
                      btnSize="small"
                      icon={
                        selectedFolders.includes(folder.id)
                          ? Icon.Types.FOLDER_OPEN
                          : Icon.Types.FOLDER
                      }
                      textAlign="start"
                      reverse
                      onClick={() => handleSelectFolder(folder.id)}
                    >
                      {folder.descripcion}
                    </Button>
                  </div>
                  <Button
                    btnType="secondary"
                    btnSize="small"
                    icon={Icon.Types.PENCIL}
                    onClick={() => setOpen(folder)}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <Loader text="Cargando carpetas..." />
        )}
        {/* <div className="h-9 flex items-center justify-between">
        <strong>Carpetas compartidas</strong>
      </div>
      <div className="flex flex-col gap-2">
        <Button
          width="100%"
          btnType="secondary"
          btnSize="small"
          icon={Icon.Types.FOLDER_OPEN}
          textAlign="start"
          reverse
        >
          MEDICINA 2022
        </Button>
      </div> */}
      </div>
    </>
  );
};

export default FolderList;
