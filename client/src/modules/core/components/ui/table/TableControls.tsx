import Icon from "../../icons/Icon";
import Button from "../Button";
import Input from "../Input";

const TableControls = () => {
  return (
    <div className="w-full bg-primary-100 p-2 flex gap-2 justify-between items-center flex-wrap-reverse">
      <div className="flex flex-[9999_1_0] gap-2">
        <div className="w-32">
          <Input
            value="nombre"
            type="select"
            inputSize="small"
            placeholder="Buscar por..."
          >
            <option value="nombre">Nombre</option>
          </Input>
        </div>
        <div className="flex-1 max-w-80 min-w-32">
          <Input inputSize="small" placeholder="Buscar por..." />
        </div>
      </div>
      <div className="flex-1 flex gap-2 justify-end">
        <Button btnType="secondary" icon={Icon.Types.PDF} btnSize="small">
          PDF
        </Button>
        <Button btnType="secondary" btnSize="small" icon={Icon.Types.EXCEL}>
          Excel
        </Button>
      </div>
    </div>
  );
};

export default TableControls;
