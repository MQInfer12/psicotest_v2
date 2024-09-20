import {
  ColumnDef,
  ColumnSort,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Icon, { ICON } from "../../icons/Icon";
import TableControls from "./TableControls";
import Button from "../Button";
import Loader from "../loader/Loader";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { useState } from "react";

interface Props<T> {
  data: T[] | undefined;
  columns: ColumnDef<T, any>[];
  showControls?: boolean;
  actions?: {
    icon: ICON;
    title: string;
    fn: (row: T) => void;
  }[];
  shadow?: boolean;
  rowHeight?: number;
}

const Table = <T,>({
  data,
  showControls = true,
  columns,
  actions,
  shadow = false,
  rowHeight = 64,
}: Props<T>) => {
  const [sorting, setSorting] = useState<ColumnSort[]>([]);

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div
      className={clsx(
        "flex-1 flex flex-col bg-alto-50 border overflow-hidden rounded-lg",
        {
          "shadow-xl": shadow,
        }
      )}
    >
      {showControls && <TableControls />}
      <div className="flex-1 overflow-auto relative">
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
        <table
          className="grid border-collapse"
          style={{
            gridTemplateColumns: [
              "40px",
              ...columns.map((c) =>
                c.meta?.width
                  ? `${c.meta.width}px`
                  : `minmax(${c.meta?.minWidth ? `${c.meta.minWidth}px` : "320px"}, 1fr)`
              ),
              actions ? "120px" : "",
            ].join(" "),
          }}
        >
          <thead className="contents">
            {table.getHeaderGroups().map((group) => (
              <tr
                className="contents [&_th]:sticky [&_th]:top-0"
                key={group.id}
              >
                <th className="h-10 flex items-center gap-2 font-bold bg-primary-100">
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
                        "h-10 flex items-center gap-2 font-bold bg-primary-100 hover:bg-primary-200 cursor-pointer transition-colors duration-300 select-none",
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
                  <th className="h-10 flex justify-center items-center gap-2 px-3 font-bold bg-primary-100">
                    <p className="whitespace-nowrap overflow-hidden text-ellipsis text-[10px] uppercase text-primary-950">
                      Acciones
                    </p>
                  </th>
                )}
              </tr>
            ))}
          </thead>
          <tbody className="contents">
            {table.getRowModel().rows.map((row, i) => (
              <tr
                className="contents [&_td]:odd:bg-white [&_td]:even:bg-primary-50 [&_td]:border-b [&_td]:border-b-alto-100"
                key={row.id}
              >
                <td
                  style={{
                    height: rowHeight,
                  }}
                  className="flex items-center justify-center text-[10px] overflow-hidden text-ellipsis"
                >
                  {i + 1}
                </td>
                {row.getVisibleCells().map((cell) => {
                  const content = flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  );
                  return (
                    <td
                      key={cell.id}
                      style={{
                        height: rowHeight,
                      }}
                      className={clsx(
                        "flex items-center text-xs px-3 [&_p]:overflow-hidden [&_p]:text-ellipsis w-full",
                        {
                          "justify-center":
                            cell.column.columnDef.meta?.textAlign === "center",
                        }
                      )}
                    >
                      {content}
                    </td>
                  );
                })}
                {actions && (
                  <td
                    style={{
                      height: rowHeight,
                    }}
                    className="flex items-center justify-center px-3 w-full"
                  >
                    {actions.map((a) => (
                      <Button
                        onClick={() => a.fn(row.original)}
                        btnSize="small"
                        title={a.title}
                        icon={a.icon}
                      />
                    ))}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
