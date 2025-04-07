import Button from "@/modules/core/components/ui/Button";
import { Folder } from "../api/responses";
import Icon from "@/modules/core/components/icons/Icon";
import FolderButton from "./FolderButton";
import { useUserContext } from "../../auth/context/UserContext";

interface Props {
  folders: Folder[];
  selectedFolders: number[];
  loadingFetch: boolean;
  handleSelectFolder: (id: number) => void;
  onClickEdit: (folder: Folder) => void;
  showMessage?: boolean;
}

const FolderMap = ({
  folders,
  selectedFolders,
  loadingFetch,
  handleSelectFolder,
  onClickEdit,
  showMessage = true,
}: Props) => {
  const { user } = useUserContext();
  if (folders.length === 0 && showMessage) {
    return (
      <div className="flex justify-center items-center">
        <small className="text-alto-500">No hay carpetas disponibles</small>
      </div>
    );
  }
  return (
    <>
      {folders.map((folder) => (
        <div key={folder.id} className="flex gap-2">
          <div className="flex-1 overflow-hidden flex">
            <FolderButton
              id={folder.id}
              title={folder.descripcion}
              handleSelectFolder={handleSelectFolder}
              loadingFetch={loadingFetch}
              selectedFolders={selectedFolders}
              subicon={
                user?.email === folder.email_user ? undefined : Icon.Types.SHARE
              }
            />
          </div>
          {!folder.global && (
            <Button
              btnType="secondary"
              btnSize="small"
              icon={Icon.Types.PENCIL}
              onClick={() => onClickEdit(folder)}
            />
          )}
        </div>
      ))}
    </>
  );
};

export default FolderMap;
