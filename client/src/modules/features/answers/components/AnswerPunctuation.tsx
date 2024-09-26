import Table from "@/modules/core/components/ui/table/Table";
import AnswerCardTemplate from "./AnswerCardTemplate";
import { useAnswerContext } from "../context/AnswerContext";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import { getEscalaColumns } from "../utils/getEscalaColumns";
import { getPunctuations, PunctuationData } from "../utils/getPunctuations";

const columnHelper = createColumnHelper<PunctuationData>();

const AnswerPunctuation = () => {
  const { data, resultados, test } = useAnswerContext();

  const columns = useMemo(
    () => [
      columnHelper.accessor("dimension", {
        header: "Dimensión",
        cell: (info) => <p className="line-clamp-3">{info.getValue()}</p>,
        meta: {
          minWidth: 160,
        },
      }),
      columnHelper.accessor("natural", {
        header: "Natural",
        meta: {
          textAlign: "center",
          width: 80,
          minimal: true,
        },
      }),
      ...getEscalaColumns(data.id, test),
    ],
    [test, data]
  );

  const tableData: PunctuationData[] = useMemo(
    () => getPunctuations(data, test, resultados),
    [data, test, resultados]
  );

  return (
    <AnswerCardTemplate title="Puntuaciones" gridArea="punt">
      <Table data={tableData} columns={columns} showControls={false} />
    </AnswerCardTemplate>
  );
};

export default AnswerPunctuation;
