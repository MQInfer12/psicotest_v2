import { useAnswersHeaderContext } from "../context/AnswersHeaderContext";
import AnswersFilters from "./AnswersFilters";
import AnswersTemplateSelector from "./AnswersTemplateSelector";

const AnswersHeader = () => {
  const { totalRows } = useAnswersHeaderContext();

  return (
    <header className="flex flex-col gap-2 p-2 bg-primary-100">
      <div className="flex justify-between">
        <AnswersFilters />
        <AnswersTemplateSelector />
      </div>
      <small className="text-[10px] font-semibold px-3">
        {totalRows} filas
      </small>
    </header>
  );
};

export default AnswersHeader;
