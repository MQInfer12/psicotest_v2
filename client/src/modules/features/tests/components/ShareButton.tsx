import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import ShareForm from "./ShareForm";

interface Props {
  idTest: number;
  nombreTest: string;
}

const ShareButton = ({ idTest, nombreTest }: Props) => {
  const { modal, setOpen } = useModal();

  return (
    <>
      {modal(
        "Compartir test",
        <ShareForm
          tests={[
            {
              id: idTest,
              nombre: nombreTest,
            },
          ]}
        />
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
