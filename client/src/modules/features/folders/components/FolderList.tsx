import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import { Folder } from "../api/responses";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import FolderForm from "./FolderForm";
import Loader from "@/modules/core/components/ui/loader/Loader";

const FolderList = () => {
  const { fetchData } = useFetch();
  const { data, setData } = fetchData("GET /carpeta");
  const { modal, setOpen } = useModal<Folder>();

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
            <div className="h-9 flex items-center justify-between">
              <strong>Carpetas propias</strong>
              <Button
                btnType="tertiary"
                btnSize="small"
                title="Añadir carpeta"
                icon={Icon.Types.FOLDER_ADD}
                onClick={() => setOpen(true)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button
                width="100%"
                btnType="secondary"
                btnSize="small"
                icon={Icon.Types.FOLDER}
                textAlign="start"
                reverse
              >
                General
              </Button>
              {data?.map((folder) => (
                <div key={folder.id} className="flex gap-2">
                  <div className="flex-1 overflow-hidden">
                    <Button
                      width="100%"
                      btnType="secondary"
                      btnSize="small"
                      icon={Icon.Types.FOLDER}
                      textAlign="start"
                      reverse
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
