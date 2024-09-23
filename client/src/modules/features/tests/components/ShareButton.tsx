import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import { useUserContext } from "../../auth/context/UserContext";

interface Props {
  idTest: number;
}

const ShareButton = ({ idTest }: Props) => {
  const { modal, setOpen } = useModal();
  const { user } = useUserContext();

  const link =
    window.location.href +
    "/share" +
    `?test=${idTest}` +
    `&allocator=${user?.email}`;

  return (
    <>
      {modal("Compartir test", <>{link}</>)}
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
