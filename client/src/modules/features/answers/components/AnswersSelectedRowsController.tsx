import Button from "@/modules/core/components/ui/Button";
import AnswersDeleteManyButton from "./logic/AnswersDeleteManyButton";
import Icon from "@/modules/core/components/icons/Icon";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import AnswersMoveManyForm from "./logic/AnswersMoveManyForm";

const AnswersSelectedRowsController = () => {
  const { setOpen, modal } = useModal();

  return (
    <div className="flex gap-2">
      <Button
        title="Mover seleccionados"
        onClick={() => setOpen(true)}
        icon={Icon.Types.FOLDER_MOVE}
        btnSize="small"
        btnType="secondary"
      />
      {modal("Mover respuestas", <AnswersMoveManyForm />)}
      <AnswersDeleteManyButton />
    </div>
  );
};

export default AnswersSelectedRowsController;
