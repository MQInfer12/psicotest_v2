import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import { User } from "@/modules/features/users/api/responses";
import ContractPDF from "./ContractPDF";

interface Props {
  user: User;
  full?: boolean;
}

const AppointmentUserContractButton = ({ user, full }: Props) => {
  const { modal: modalContract, setOpen: setOpenContract } = useModal();

  return (
    <>
      {modalContract(
        "Contrato terapeútico para el gabinete",
        <ContractPDF user={user} />,
        {
          width: 900,
          type: "floating",
        }
      )}
      <Button
        className="w-full"
        btnSize="small"
        btnType="secondary"
        icon={Icon.Types.PDF}
        onClick={() => setOpenContract(true)}
      >
        {full ? "Imprimir contrato" : ""}
      </Button>
    </>
  );
};

export default AppointmentUserContractButton;
