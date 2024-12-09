import { useTableContext } from "@/modules/core/components/ui/table/context/TableContext";
import { useAnswersHeaderContext } from "../context/AnswersHeaderContext";
import AnswersFilters from "./AnswersFilters";
import AnswersTemplateSelector from "./AnswersTemplateSelector";
import AnswersSelectedRowsController from "./AnswersSelectedRowsController";

const AnswersHeader = () => {
  const { selectedRows } = useTableContext();
  const { totalRows } = useAnswersHeaderContext();

  return (
    <header className="flex flex-col gap-2 px-2 py-2 bg-primary-100">
      <div className="flex justify-between gap-2">
        <AnswersFilters />
        {selectedRows.length > 0 ? (
          <AnswersSelectedRowsController />
        ) : (
          <AnswersTemplateSelector />
        )}
      </div>
      <small className="text-[10px] font-semibold px-3">
        {totalRows} filas
      </small>
    </header>
  );
};

export default AnswersHeader;
