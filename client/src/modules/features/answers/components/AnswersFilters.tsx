import Input from "@/modules/core/components/ui/Input";
import {
  AnswersTableFiltersType,
  useAnswersHeaderContext,
} from "../context/AnswersHeaderContext";

const AnswersFilters = () => {
  const { filters, setFilters, disableFilters } = useAnswersHeaderContext();

  return (
    <div className="flex gap-2 w-96">
      <div className="flex-1">
        <Input
          inputSize="small"
          type="select"
          value={filters.type}
          disabled={disableFilters}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              type: e.target.value as AnswersTableFiltersType,
            }))
          }
        >
          <option value="nombre">Nombre</option>
          <option value="test">Test</option>
        </Input>
      </div>
      <div className="flex-[2_1_0]">
        <Input
          type="text"
          inputSize="small"
          placeholder="Realiza una búsqueda..."
          value={filters.value}
          disabled={disableFilters}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              value: e.target.value,
            }))
          }
        />
      </div>
    </div>
  );
};

export default AnswersFilters;
