import Icon from "@/modules/core/components/icons/Icon";
import Loader from "@/modules/core/components/ui/loader/Loader";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import { SetData } from "@/modules/core/hooks/useFetch/getSetData";
import React from "react";
import { useUserContext } from "../../auth/context/UserContext";
import { Folder } from "../api/responses";
import FolderButton from "./FolderButton";
import FolderForm from "./FolderForm";
import FolderGroupSubtitle from "./FolderGroupSubtitle";
import FolderMap from "./FolderMap";

interface Props {
  data: Folder[] | undefined;
  setData: SetData<Folder[]>;
  selectedFolders: number[];
  setSelectedFolders: React.Dispatch<React.SetStateAction<number[]>>;
  loading: boolean;
  loadingFetch: boolean;
}

const FolderList = ({
  selectedFolders,
  setSelectedFolders,
  loading,
  data,
  setData,
  loadingFetch,
}: Props) => {
  const { user } = useUserContext();
  const { modal, setOpen } = useModal<
    { type: "edit"; folder: Folder } | { type: "new"; id_grupo: number | null }
  >();

  const handleSelectFolder = (id: number) => {
    setSelectedFolders((prev) => {
      const exists = prev.some((folderId) => folderId === id);
      if (exists) {
        return prev.filter((folderId) => folderId !== id);
      }
      return [...prev, id];
    });
  };

  data?.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
  return (
    <>
      {modal("Formulario de carpeta", (item) => (
        <FolderForm
          folder={item?.type === "edit" ? item.folder : null}
          id_grupo={
            item?.type === "new"
              ? item.id_grupo
              : (item?.folder.id_grupo ?? null)
          }
          onSuccess={(folder) => {
            if (item?.type === "new") {
              setData((prev) => [...prev, folder]);
            } else {
              setData((prev) =>
                prev.map((v) => (v.id === item?.folder.id ? folder : v))
              );
            }
            setOpen(false);
          }}
          onSuccessDelete={(folder) => {
            setData((prev) => prev.filter((v) => v.id !== folder.id));
            setSelectedFolders((prev) => prev.filter((v) => v !== folder.id));
            setOpen(false);
          }}
        />
      ))}
      <div className="w-80 flex flex-col gap-2 max-lg:w-full">
        {!data ? (
          <Loader text="Cargando carpetas..." />
        ) : (
          <>
            <FolderGroupSubtitle
              title="Carpetas propias"
              loading={
                loading &&
                selectedFolders
                  .map((id) => data.find((folder) => folder.id === id))
                  .some((folder) => !folder?.id_grupo)
              }
              onClick={() =>
                setOpen({
                  type: "new",
                  id_grupo: null,
                })
              }
            />
            <div className="flex flex-col gap-2 max-lg:flex-row">
              <FolderButton
                id={0}
                title="Sin clasificación"
                handleSelectFolder={handleSelectFolder}
                loadingFetch={loadingFetch}
                selectedFolders={selectedFolders}
                subicon={Icon.Types.MINUS}
              />
              <FolderMap
                folders={data.filter((folder) => !folder.id_grupo)}
                handleSelectFolder={handleSelectFolder}
                loadingFetch={loadingFetch}
                onClickEdit={(folder) =>
                  setOpen({
                    type: "edit",
                    folder,
                  })
                }
                selectedFolders={selectedFolders}
              />
            </div>
            {user?.grupos.map((grupo) => (
              <React.Fragment key={grupo.id}>
                <FolderGroupSubtitle
                  title={grupo.descripcion}
                  loading={
                    loading &&
                    selectedFolders
                      .map((id) => data.find((folder) => folder.id === id))
                      .some((folder) => folder?.id_grupo === grupo.id)
                  }
                  onClick={() =>
                    setOpen({
                      type: "new",
                      id_grupo: grupo.id,
                    })
                  }
                />
                <div className="flex flex-col gap-2 max-lg:flex-row">
                  <FolderMap
                    folders={data.filter(
                      (folder) => folder.id_grupo === grupo.id
                    )}
                    handleSelectFolder={handleSelectFolder}
                    loadingFetch={loadingFetch}
                    onClickEdit={(folder) =>
                      setOpen({
                        type: "edit",
                        folder,
                      })
                    }
                    selectedFolders={selectedFolders}
                  />
                </div>
              </React.Fragment>
            ))}
          </>
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
