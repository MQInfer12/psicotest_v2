import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import { useTableContext } from "@/modules/core/components/ui/table/context/TableContext";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toasts";
import { useAnswersHeaderContext } from "../../context/AnswersHeaderContext";

const AnswersDeleteManyButton = () => {
  const { selectedRows, resetSelectedRows } = useTableContext();
  const { setData } = useAnswersHeaderContext();
  const { postData } = useFetch();
  const deleteManyMutation = postData("PUT /respuesta/delete/many");

  const handleDeleteMany = () => {
    const ids = selectedRows.map(Number);
    toastConfirm(`Se eliminarán ${selectedRows.length} respuestas.`, () => {
      deleteManyMutation(
        { ids },
        {
          onSuccess: async (res) => {
            toastSuccess(res.message);
            setData((prev) =>
              prev?.filter((respuesta) => !ids.includes(respuesta.id_respuesta))
            );
            resetSelectedRows();
          },
        }
      );
    });
  };

  return (
    <Button
      title="Eliminar seleccionados"
      onClick={handleDeleteMany}
      icon={Icon.Types.TRASH} 
      btnSize="small"
      btnType="secondary"
      danger
    />
  );
};

export default AnswersDeleteManyButton;
