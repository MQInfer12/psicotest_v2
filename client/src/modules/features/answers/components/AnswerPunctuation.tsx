import Table from "@/modules/core/components/ui/table/Table";
import AnswerCardTemplate from "./AnswerCardTemplate";

const AnswerPunctuation = () => {
  return (
    <AnswerCardTemplate title="Puntuaciones" gridArea="punt">
      <Table
        data={[
          {
            dimension: "Totales",
            natural: 24,
            T: 33,
          },
        ]}
        columns={[
          {
            accessorKey: "dimension",
            header: "Dimensión",
            meta: {
              minWidth: 120,
            },
          },
          {
            accessorKey: "natural",
            header: "Natural",
            meta: {
              textAlign: "center",
              width: 120,
            },
          },
        ]}
        showControls={false}
      />
    </AnswerCardTemplate>
  );
};

export default AnswerPunctuation;
