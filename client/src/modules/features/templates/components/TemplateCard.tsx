import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import Loader from "@/modules/core/components/ui/loader/Loader";
import { IA_Plantilla } from "../api/responses";

interface Props {
  template: IA_Plantilla;
  loading: boolean;
}

const TemplateCard = ({ loading, template }: Props) => {
  const test1 = Object.keys(template.id_tests).at(0) ?? "-";
  const test2 = Object.keys(template.id_tests).at(1) ?? "-";
  return (
    <div className="w-full h-full rounded-lg border-t-8 border-primary-700 bg-alto-50 shadow-lg pt-4 p-8 flex flex-col gap-4">
      <div className="flex items-center gap-2 justify-between">
        <strong className="text-xl w-full overflow-hidden text-ellipsis whitespace-nowrap">
          {template.nombre}
        </strong>
        <div
          title="Seleccionado por los creadores"
          className="h-6 aspect-square text-primary-700"
        >
          <Icon type={Icon.Types.TEMPLATE} />
        </div>
      </div>
      <p className="text-sm text-alto-800 leading-6 line-clamp-3 h-[72px]">
        {template.descripcion}
      </p>
      <div className="flex flex-col gap-3 text-alto-700">
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
          <Button
            btnType="secondary"
            onClick={() => {}}
            icon={Icon.Types.PENCIL}
            title="Editar test"
          />
        )}
      </div>
    </div>
  );
};

export default TemplateCard;
