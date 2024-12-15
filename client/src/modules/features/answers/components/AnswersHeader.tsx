import { useTableContext } from "@/modules/core/components/ui/table/context/TableContext";
import AnswersFilters from "./AnswersFilters";
import AnswersTemplateSelector from "./AnswersTemplateSelector";
import AnswersSelectedRowsController from "./AnswersSelectedRowsController";

const AnswersHeader = () => {
  const { selectedRows } = useTableContext();

  return (
    <div className="flex justify-between gap-2">
      <AnswersFilters />
      {selectedRows.length > 0 ? (
        <AnswersSelectedRowsController />
      ) : (
        <AnswersTemplateSelector />
      )}
    </div>
  );
};

export default AnswersHeader;
