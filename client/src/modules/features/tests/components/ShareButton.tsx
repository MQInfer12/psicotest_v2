import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import ShareForm from "./ShareForm";
import { useMemo } from "react";

interface Props {
  idTest: number;
  nombreTest: string;
}

const ShareButton = ({ idTest, nombreTest }: Props) => {
  const { modal, setOpen } = useModal();

  const sharedId = useMemo(() => [idTest], [idTest]);
  return (
    <>
      {modal(
        "Compartir test",
        <ShareForm idTests={sharedId} nombreTest={nombreTest} />
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
