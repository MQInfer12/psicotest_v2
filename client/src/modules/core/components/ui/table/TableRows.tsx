import { flexRender, Table } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import React, { CSSProperties, useEffect, useReducer } from "react";
import Button from "../Button";
import Loader from "../loader/Loader";
import { TableAction } from "./Table";

interface Props<T> {
  data: T[] | undefined;
  rowHeight: number;
  savedOffsetKey?: string;
  tableContainerRef: React.RefObject<HTMLDivElement>;
  table: Table<T>;
  onClickRow?: {
    fn: (row: T) => void;
    disabled?: (row: T) => boolean;
  };
  rowStyle?: (row: T) => CSSProperties;
  gridTemplateColumns: string;
  actions?: TableAction<T>[];
  loadingRow?: (row: T) => boolean;
  checkable?: boolean;
  defaultFocusedRows: number[];
  setDefaultFocusedRows: React.Dispatch<React.SetStateAction<number[]>>;
}

const TableRows = <T,>({
  savedOffsetKey,
  rowHeight,
  tableContainerRef,
  data,
  table,
  onClickRow,
  rowStyle,
  gridTemplateColumns,
  actions,
  checkable,
  loadingRow,
  defaultFocusedRows,
  setDefaultFocusedRows,
}: Props<T>) => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const rowVirtualizer = useVirtualizer({
    initialOffset: () => {
      if (!savedOffsetKey) return 0;
      const initialOffset = sessionStorage.getItem(savedOffsetKey);
      return initialOffset ? Number(initialOffset) : 0;
    },
    count: data?.length ?? 0,
    estimateSize: () => rowHeight,
    getScrollElement: () => tableContainerRef.current,
    overscan: 2,
    gap: 1,
  });

  //! QUICKFIX
  //? Por algun motivo triggerear una renderización más arregla un error de que el virtualizador
  //? no devuelve bien todas las filas que tiene que renderizar
  useEffect(() => {
    forceUpdate();
  }, []);

  useEffect(() => {
    return () => {
      if (!savedOffsetKey) return;
      const offset = rowVirtualizer.scrollOffset;
      if (offset !== null) {
        sessionStorage.setItem(savedOffsetKey, String(offset));
      }
    };
  }, [savedOffsetKey]);

  return (
    <tbody
      className="relative"
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`,
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const row = table.getRowModel().rows[virtualRow.index];
        const handleClickRow = onClickRow?.disabled?.(row.original)
          ? undefined
          : onClickRow?.fn;
        const styles = rowStyle?.(row.original) || {};
        const isDefaultFocused =
          !!defaultFocusedRows &&
          defaultFocusedRows.some((r) => String(r) === row.id);
        return (
          <tr
            key={row.id}
            className={clsx(
              "absolute w-full grid border-y border-y-alto-300/50 dark:border-y-alto-800/40 ring-inset ring-primary-400 transition-[background-color,opacity,filter,box-shadow] duration-300",
              {
                "bg-white dark:bg-alto-1000": virtualRow.index % 2 === 0,
                "bg-primary-50 dark:bg-primary-1000":
                  virtualRow.index % 2 === 1,
                "hover:!invert-[4%] cursor-pointer": !!handleClickRow,
                "ring-2": isDefaultFocused,
                "ring-0": !isDefaultFocused,
              }
            )}
            style={{
              gridTemplateColumns,
              transform: `translateY(${virtualRow.start}px)`,
              ...styles,
            }}
            onClick={() => handleClickRow?.(row.original)}
            onBlur={() => {
              if (isDefaultFocused) setDefaultFocusedRows([]);
            }}
            autoFocus={isDefaultFocused}
          >
            {checkable && (
              <td
                style={{
                  height: rowHeight,
                }}
                className="flex items-center justify-center text-[10px] overflow-hidden text-ellipsis"
                onClick={row.getToggleSelectedHandler()}
              >
                <input
                  className="accent-primary-500 dark:accent-primary-400 dark:[&:not(:checked)]:opacity-30"
                  type="checkbox"
                  checked={row.getIsSelected()}
                  disabled={!row.getCanSelect()}
                  onChange={() => {}}
                />
              </td>
            )}
            <td
              style={{
                height: rowHeight,
              }}
              className="flex items-center justify-center text-[10px] overflow-hidden text-ellipsis text-alto-950 dark:text-alto-50"
            >
              {virtualRow.index + 1}
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
                    "flex items-center text-xs px-3 [&_p]:overflow-hidden [&_p]:text-ellipsis w-full text-alto-950 dark:text-alto-50",
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
                className="flex items-center justify-center px-3 w-full gap-1"
              >
                {loadingRow?.(row.original) ? (
                  <div className="-mt-6">
                    <Loader text="" scale=".4" />
                  </div>
                ) : (
                  actions.map((a) => (
                    <Button
                      key={a.title}
                      onClick={() => a.fn(row.original)}
                      btnSize="small"
                      title={a.title}
                      icon={a.icon}
                      disabled={a.disabled?.(row.original)}
                      btnType={a.type}
                      danger={a.danger}
                    />
                  ))
                )}
              </td>
            )}
          </tr>
        );
      })}
    </tbody>
  );
};

export default TableRows;
