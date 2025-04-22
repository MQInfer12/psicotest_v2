import { useEffect } from "react";
import { useTableContext } from "../context/TableContext";

interface Props {
  folders?: number[];
  children?: React.ReactNode;
  text?: string;
  rowsName?: string;
  rowsNameSingular?: string;
}

const TableHeader = ({
  children,
  folders,
  text,
  rowsName = "filas",
  rowsNameSingular = "fila",
}: Props) => {
  const { selectedRows, totalRows, resetSelectedRows } = useTableContext();

  useEffect(() => {
    resetSelectedRows();
  }, [folders]);

  return (
    <header className="flex flex-col gap-2 px-2 py-2 bg-primary-100 dark:dark:bg-primary-1000">
      {children}
      <div className="w-full flex justify-between text-alto-950 dark:text-alto-50">
        <small className="text-[10px] font-semibold px-3">
          {text ??
            `${totalRows} ${totalRows === 1 ? rowsNameSingular : rowsName}`}
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
