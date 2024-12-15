import { useTableContext } from "../context/TableContext";

interface Props {
  children?: React.ReactNode;
}

const TableHeader = ({ children }: Props) => {
  const { selectedRows, totalRows } = useTableContext();

  return (
    <header className="flex flex-col gap-2 px-2 py-2 bg-primary-100">
      {children}
      <div className="w-full flex justify-between">
        <small className="text-[10px] font-semibold px-3">
          {totalRows} filas
        </small>
        {selectedRows.length > 0 && (
          <small className="text-[10px] font-semibold px-3">
            {selectedRows.length} seleccionados
          </small>
        )}
      </div>
    </header>
  );
};

export default TableHeader;
