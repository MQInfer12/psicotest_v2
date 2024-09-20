import Table from "@/modules/core/components/ui/table/Table";
import AnswerCardTemplate from "./AnswerCardTemplate";
import { MAPITest } from "../../tests/modules/MAPI/data";

const AnswerTabs = () => {
  return (
    <AnswerCardTemplate title="Resultados" gridArea="tabs">
      <Table
        data={MAPITest.items.map((i) => ({
          pregunta: i.descripcion,
        }))}
        columns={[
          {
            accessorKey: "pregunta",
            header: "Pregunta",
            cell: (info) => <p className="line-clamp-3">{info.getValue()}</p>,
            meta: {
              minWidth: 200,
            },
          },
          {
            accessorKey: "1",
            header: "Verdadero",
            cell: () => <input className="accent-primary-500" type="radio" />,
            meta: {
              width: 100,
              textAlign: "center",
              minimal: true,
            },
          },
          {
            accessorKey: "2",
            header: "Falso",
            cell: () => <input className="accent-primary-500" type="radio" />,
            meta: {
              width: 100,
              textAlign: "center",
              minimal: true,
            },
          },
          {
            accessorKey: "3",
            header: "ni VERDADERO ni FALSO para mí",
            cell: () => <input className="accent-primary-500" type="radio" />,
            meta: {
              width: 100,
              textAlign: "center",
              minimal: true,
            },
          },
        ]}
      />
    </AnswerCardTemplate>
  );
};

export default AnswerTabs;
