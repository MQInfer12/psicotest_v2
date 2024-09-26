import Table from "@/modules/core/components/ui/table/Table";
import AnswerCardTemplate from "./AnswerCardTemplate";
import { MAPITest } from "../../tests/modules/MAPI/data";
import Icon from "@/modules/core/components/icons/Icon";

const AnswerTabs = () => {
  return (
    <AnswerCardTemplate title="Resultados" gridArea="tabs">
      <div className="bg-primary-100 px-4 pt-2 flex justify-center">
        <div className="w-80 flex gap-4 items-center justify-between">
          <button
            className="w-5 aspect-square text-alto-500 disabled:text-alto-200"
            disabled
          >
            <Icon type={Icon.Types.CHEVRON_LEFT} />
          </button>
          <p className="font-semibold text-primary-950 text-sm">Sección 1</p>
          <button className="w-5 aspect-square text-alto-500 disabled:text-alto-200">
            <Icon type={Icon.Types.CHEVRON_RIGHT} />
          </button>
        </div>
      </div>
      <Table
        rounded={false}
        data={MAPITest.items.map((i) => ({
          pregunta: i.descripcion,
        }))}
        columns={[
          {
            accessorKey: "pregunta",
            header: "Pregunta",
            cell: (info) => (
              <p className="line-clamp-3 whitespace-pre-line leading-normal">
                {info.getValue()}
              </p>
            ),
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
        ]}
      />
    </AnswerCardTemplate>
  );
};

export default AnswerTabs;
