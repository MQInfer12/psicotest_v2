import {
  ColumnDef,
  ColumnSort,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { CSSProperties, ElementRef, useRef, useState } from "react";
import { v4 } from "uuid";
import Icon, { ICON } from "../../icons/Icon";
import IconMessage from "../../icons/IconMessage";
import Loader from "../loader/Loader";
import { TableContextProvider } from "./context/TableContext";
import TableRows from "./TableRows";
import { ButtonType } from "../Button";

export interface TableAction<T> {
  icon: ICON;
  title: string;
  fn: (row: T) => void;
  disabled?: (row: T) => boolean;
  type?: ButtonType;
  danger?: boolean;
}

interface Props<T> {
  data: T[] | undefined;
  columns: ColumnDef<T, any>[];
  actions?: TableAction<T>[];
  shadow?: boolean;
  rowHeight?: number;
  rounded?: boolean;
  loadingRow?: (row: T) => boolean;
  emptyMessage?: string;
  smallEmptyMessage?: string;
  children?: React.ReactNode;
  savedOffsetKey?: string;

  //* PROPS FOR HANDLE ROW STATES
  onClickRow?: {
    fn: (row: T) => void;
    disabled?: (row: T) => boolean;
  };
  rowStyle?: (row: T) => CSSProperties;

  //* PROPS FOR CHECKING
  checkable?: boolean;
  disableCheck?: boolean;
  idKey?: keyof T;
}

const Table = <T,>({
  data,
  columns,
  actions,
  shadow = false,
  rowHeight = 64,
  rounded = true,
  loadingRow,
  emptyMessage,
  smallEmptyMessage,
  onClickRow,
  rowStyle,
  savedOffsetKey,
  children,
  checkable,
  disableCheck,
  idKey,
}: Props<T>) => {
  const [sorting, setSorting] = useState<ColumnSort[]>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      sorting,
      rowSelection,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    enableRowSelection: () => !!checkable && !disableCheck,
    getRowId: (row) => (idKey ? String(row[idKey]) : v4()),
  });
  const tableContainerRef = useRef<ElementRef<"div">>(null);

  const gridTemplateColumns = [
    checkable ? "40px" : "",
    "40px",
    ...columns.map((c) =>
      c.meta?.width
        ? `${c.meta.width}px`
        : `minmax(${c.meta?.minWidth ? `${c.meta.minWidth}px` : "320px"}, 1fr)`
    ),
    actions ? "120px" : "",
  ].join(" ");

  return (
    <div
      className={clsx(
        "flex-1 flex flex-col bg-alto-50 border overflow-hidden relative",
        {
          "rounded-lg": rounded,
          "shadow-xl": shadow,
        }
      )}
    >
      <AnimatePresence>
        {!data && (
          <motion.div
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.5,
            }}
            className="absolute inset-0 z-10 bg-alto-50"
          >
            <Loader />
          </motion.div>
        )}
      </AnimatePresence>
      <TableContextProvider
        value={{
          totalRows: data?.length,
          selectedRows: Object.keys(rowSelection),
          resetSelectedRows: () => setRowSelection({}),
        }}
      >
        {children}
      </TableContextProvider>
      <div
        ref={tableContainerRef}
        className="flex-1 flex flex-col overflow-y-scroll"
      >
        {data?.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <IconMessage
              icon={Icon.Types.QUESTION}
              message={emptyMessage ?? "No se encontraron datos"}
              small={smallEmptyMessage}
            />
          </div>
        ) : (
          <table className="flex-1 border-collapse overflow-auto relative isolate">
            <thead className="sticky top-0 z-10">
              {table.getHeaderGroups().map((group) => (
                <tr
                  className="grid bg-primary-100"
                  style={{
                    gridTemplateColumns,
                  }}
                  key={group.id}
                >
                  {checkable && (
                    <th
                      className="h-10 flex items-center justify-center"
                      onClick={table.getToggleAllRowsSelectedHandler()}
                    >
                      <input
                        className="accent-primary-500"
                        type="checkbox"
                        checked={table.getIsAllRowsSelected()}
                        onChange={() => {}}
                        disabled={disableCheck}
                      />
                    </th>
                  )}
                  <th className="h-10 flex items-center gap-2 font-bold">
                    <p className="whitespace-nowrap overflow-hidden text-ellipsis text-[10px] uppercase w-full text-primary-950">
                      #
                    </p>
                  </th>
                  {group.headers.map((header) => {
                    const minimal =
                      header.column.columnDef.meta?.minimal ?? false;
                    return (
                      <th
                        key={header.id}
                        title={header.column.columnDef.header?.toString()}
                        className={clsx(
                          "h-10 flex items-center gap-2 font-bold hover:bg-primary-200 cursor-pointer transition-colors duration-300 select-none",
                          {
                            "justify-center":
                              header.column.columnDef.meta?.textAlign ===
                              "center",
                            "px-3": !minimal,
                            "px-[2px]": minimal,
                          }
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {header.column.columnDef.meta?.textAlign === "center" &&
                          !minimal && <div className="w-[10px]" />}
                        {header.isPlaceholder ? null : (
                          <p
                            className={clsx(
                              "text-[10px] uppercase text-primary-950",
                              {
                                "whitespace-nowrap overflow-hidden text-ellipsis":
                                  !minimal,
                                "line-clamp-2": minimal,
                              }
                            )}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </p>
                        )}
                        {!minimal && (
                          <div className="w-[10px] flex flex-col text-alto-300">
                            <div
                              className={clsx("transition-all duration-150", {
                                "text-primary-500":
                                  header.column.getIsSorted() === "asc",
                              })}
                            >
                              <Icon type={Icon.Types.CARET_UP} />
                            </div>
                            <div
                              className={clsx("transition-all duration-150", {
                                "text-primary-500":
                                  header.column.getIsSorted() === "desc",
                              })}
                            >
                              <Icon type={Icon.Types.CARET_DOWN} />
                            </div>
                          </div>
                        )}
                      </th>
                    );
                  })}
                  {actions && (
                    <th className="h-10 flex justify-center items-center gap-2 px-3 font-bold">
                      <p className="whitespace-nowrap overflow-hidden text-ellipsis text-[10px] uppercase text-primary-950">
                        Acciones
                      </p>
                    </th>
                  )}
                </tr>
              ))}
            </thead>
            {data && (
              <TableRows
                data={data}
                gridTemplateColumns={gridTemplateColumns}
                rowHeight={rowHeight}
                table={table}
                tableContainerRef={tableContainerRef}
                actions={actions}
                checkable={checkable}
                loadingRow={loadingRow}
                onClickRow={onClickRow}
                rowStyle={rowStyle}
                savedOffsetKey={savedOffsetKey}
              />
            )}
          </table>
        )}
      </div>
    </div>
  );
};

export default Table;
