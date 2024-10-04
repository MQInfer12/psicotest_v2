import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { TestIds } from "../../tests/types/TestIds";
import { TestType } from "../../tests/types/TestType";
import { MapiTestType } from "../../tests/modules/MAPI/types/MapiTestType";
import { PunctuationData } from "./getPunctuations";

const columnHelper = createColumnHelper<PunctuationData>();

export const getEscalaColumns = (
  testId: number,
  testGeneral: TestType
): ColumnDef<PunctuationData, any>[] => {
  switch (testId) {
    case TestIds.MAPI:
      const test = testGeneral as MapiTestType;
      return test.escalas.map((escala) =>
        columnHelper.accessor(escala.descripcion, {
          header: escala.descripcion,
          meta: {
            textAlign: "center",
            width: 80,
            minimal: true,
          },
        })
      );
    case TestIds.KUDER:
      return [];
    case TestIds.PMA:
      return [];
    default:
      return [];
  }
};
