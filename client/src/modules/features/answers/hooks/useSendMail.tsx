import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toasts";
import { T_Tests_Respuestas } from "../../tests/api/responses";

export const useSendMail = () => {
  const { postData } = useFetch();
  const patchMutation = postData("PATCH /respuesta/patch/visibilidad");

  const handleSendMail = (
    ids: number[],
    onSuccess?: (data: T_Tests_Respuestas[]) => void
  ) => {
    toastConfirm("Se le enviará un correo al evaluado.", () => {
      patchMutation(
        {
          ids: ids,
        },
        {
          onSuccess: (res) => {
            toastSuccess(res.message);
            onSuccess?.(res.data);
          },
        }
      );
    });
  };

  return { handleSendMail };
};
