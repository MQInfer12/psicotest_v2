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
}

const FolderMap = ({
  folders,
  selectedFolders,
  loadingFetch,
  handleSelectFolder,
  onClickEdit,
}: Props) => {
  const { user } = useUserContext();
  return (
    <>
      {folders.map((folder) => (
        <div key={folder.id} className="flex gap-2 max-lg:flex-col">
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
