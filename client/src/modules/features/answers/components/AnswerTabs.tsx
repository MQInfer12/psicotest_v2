import Table from "@/modules/core/components/ui/table/Table";
import AnswerCardTemplate from "./AnswerCardTemplate";
import Icon from "@/modules/core/components/icons/Icon";
import { useAnswerContext } from "../context/AnswerContext";
import { CellContext, createColumnHelper } from "@tanstack/react-table";
import { useMemo, useState } from "react";

interface TableResultados {
  pregunta: string;
  [key: string]: string | boolean;
}

const columnHelper = createColumnHelper<TableResultados>();

const AnswerTabs = () => {
  const { test, resultados } = useAnswerContext();
  const [seccionIndex, setSeccionIndex] = useState(0);

  const seccion =
    test.secciones.length > 0 ? test.secciones[seccionIndex] : undefined;

  const columns = useMemo(
    () => [
      columnHelper.accessor("pregunta", {
        header: "Pregunta",
        cell: (info) => (
          <p className="line-clamp-3 whitespace-pre-line leading-normal">
            {info.getValue()}
          </p>
        ),
        meta: {
          minWidth: 200,
        },
      }),
      ...(seccion?.opciones.map((opcion) => ({
        accessorKey: opcion.descripcion,
        header: opcion.descripcion,
        cell: (info: CellContext<TableResultados, any>) => (
          <input
            className="accent-primary-500 pointer-events-none"
            type="radio"
            defaultChecked={info.getValue()}
          />
        ),
        meta: {
          width: 100,
          textAlign: "center" as const,
          minimal: true,
        },
      })) ?? []),
    ],
    [test, seccion]
  );

  const data: TableResultados[] | undefined = seccion?.items.map((pregunta) => {
    const respuesta = resultados.find(
      (resultado) => resultado.idPregunta === pregunta.id
    );
    const opcion = seccion?.opciones.find((o) => o.id === respuesta?.idOpcion);
    let res: TableResultados = {
      pregunta: pregunta.descripcion,
    };
    if (opcion) {
      res[opcion.descripcion] = true;
    }
    return res;
  });

  return (
    <AnswerCardTemplate title="Resultados" gridArea="tabs">
      <div className="bg-primary-100 px-4 pt-2 flex justify-center">
        <div className="w-80 flex gap-4 items-center justify-between">
          <button
            className="w-5 aspect-square text-alto-500 disabled:text-alto-200"
            onClick={() => setSeccionIndex(seccionIndex - 1)}
            disabled={seccionIndex === 0}
          >
            <Icon type={Icon.Types.CHEVRON_LEFT} />
          </button>
          <p className="font-semibold text-primary-950 text-sm">
            Sección {seccionIndex + 1}
          </p>
          <button
            onClick={() => setSeccionIndex(seccionIndex + 1)}
            disabled={seccionIndex === test.secciones.length - 1}
            className="w-5 aspect-square text-alto-500 disabled:text-alto-200"
          >
            <Icon type={Icon.Types.CHEVRON_RIGHT} />
          </button>
        </div>
      </div>
      <Table rounded={false} data={data} columns={columns} />
    </AnswerCardTemplate>
  );
};

export default AnswerTabs;
