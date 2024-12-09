import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import Input from "@/modules/core/components/ui/Input";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { useAnswersHeaderContext } from "../context/AnswersHeaderContext";

const AnswersTemplateSelector = () => {
  const { fetchData } = useFetch();
  const { data } = fetchData("GET /plantilla");
  const {
    startedSelection,
    setStartedSelection,
    setSelectedTests,
    plantilla,
    setPlantilla,
  } = useAnswersHeaderContext();

  return (
    <div className="flex gap-2 w-64">
      <div className="flex-1">
        <Input
          inputSize="small"
          type="select"
          value={plantilla}
          onChange={(e) => setPlantilla(e.target.value)}
          disabled={!!startedSelection}
        >
          <option value="">Seleccione una plantilla</option>
          {data?.map((v) => (
            <option key={v.id} value={v.id}>
              {v.nombre}
            </option>
          ))}
        </Input>
      </div>
      <Button
        title={startedSelection ? "Cancelar" : "Comenzar selección"}
        onClick={() => {
          setStartedSelection((prev) => {
            if (!prev) {
              return data?.find((v) => v.id === Number(plantilla)) ?? null;
            }
            return null;
          });
          setSelectedTests(null);
        }}
        icon={startedSelection ? Icon.Types.X : Icon.Types.HAND_POINTER}
        btnSize="small"
        disabled={!plantilla}
        btnType={startedSelection ? "primary" : "secondary"}
      />
    </div>
  );
};

export default AnswersTemplateSelector;
