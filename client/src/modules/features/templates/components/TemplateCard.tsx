import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import Loader from "@/modules/core/components/ui/loader/Loader";
import { IA_Plantilla } from "../api/responses";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toasts";
import { useNavigate } from "@tanstack/react-router";

interface Props {
  template: IA_Plantilla;
  loading: boolean;
  onSuccessDelete: (id: number) => void;
}

const TemplateCard = ({ loading, template, onSuccessDelete }: Props) => {
  const test1 = Object.keys(template.id_tests).at(0) ?? "-";
  const test2 = Object.keys(template.id_tests).at(1) ?? "-";

  const navigate = useNavigate();

  const { postData } = useFetch();
  const deleteMutation = postData("DELETE /plantilla/:id");

  const handleDelete = () => {
    toastConfirm("Se eliminará la plantilla permanentemente", () => {
      deleteMutation(null, {
        params: {
          id: template.id,
        },
        onSuccess: (res) => {
          toastSuccess(res.message);
          onSuccessDelete(template.id);
        },
      });
    });
  };

  return (
    <div className="w-full h-full rounded-lg border-t-8 border-primary-700 dark:border-primary-400 bg-alto-50 dark:bg-alto-1000 shadow-lg shadow-alto-950/10 dark:shadow-alto-50/10 pt-4 p-8 flex flex-col gap-4">
      <div className="flex items-center gap-2 justify-between">
        <strong className="text-xl w-full overflow-hidden text-ellipsis whitespace-nowrap text-alto-950 dark:text-alto-50">
          {template.nombre}
        </strong>
        <div
          title="Seleccionado por los creadores"
          className="h-6 aspect-square text-primary-700 dark:text-primary-400"
        >
          <Icon type={Icon.Types.TEMPLATE} />
        </div>
      </div>
      <p className="text-sm text-alto-800 dark:text-alto-200 leading-6 line-clamp-3 h-[72px]">
        {template.descripcion}
      </p>
      <div className="flex flex-col gap-3 text-alto-700 dark:text-alto-400">
        <div className="flex gap-4 text-sm items-center">
          <div className="w-5 aspect-square text-primary-400">
            <Icon type={Icon.Types.BRAIN} />
          </div>
          <p
            title={test1}
            className="whitespace-nowrap overflow-hidden text-ellipsis"
          >
            {test1}
          </p>
        </div>
        <div className="flex gap-4 text-sm items-center">
          <div className="w-5 aspect-square text-primary-400">
            <Icon type={Icon.Types.BRAIN} />
          </div>
          <p
            title={test2}
            className="whitespace-nowrap overflow-hidden text-ellipsis"
          >
            {test2}
          </p>
        </div>
      </div>
      <div className="flex gap-4 justify-center pt-1 h-[42px]">
        {loading ? (
          <div className="-mt-5">
            <Loader text="" scale=".5" />
          </div>
        ) : (
          <>
            <Button
              btnType="secondary"
              onClick={() => {
                navigate({
                  to: "/templates/create/$id",
                  params: {
                    id: String(template.id),
                  },
                });
              }}
              icon={Icon.Types.PENCIL}
              title="Editar plantilla"
            />
            <Button
              btnType="secondary"
              onClick={handleDelete}
              icon={Icon.Types.TRASH}
              danger
              title="Eliminar plantilla"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default TemplateCard;
