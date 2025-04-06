import Icon, { ICON } from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";

interface Props {
  selectedFolders: number[];
  handleSelectFolder: (id: number) => void;
  loadingFetch: boolean;
  subicon?: ICON;
  title: string;
  id: number;
}

const FolderButton = ({
  selectedFolders,
  subicon,
  handleSelectFolder,
  loadingFetch,
  title,
  id,
}: Props) => {
  return (
    <Button
      width="100%"
      btnType={selectedFolders.includes(id) ? "primary" : "secondary"}
      btnSize="small"
      textAlign="start"
      icon={
        selectedFolders.includes(id)
          ? Icon.Types.FOLDER_OPEN
          : Icon.Types.FOLDER
      }
      subicon={subicon}
      reverse
      onClick={() => handleSelectFolder(id)}
      disabled={loadingFetch}
    >
      {title}
    </Button>
  );
};

export default FolderButton;
