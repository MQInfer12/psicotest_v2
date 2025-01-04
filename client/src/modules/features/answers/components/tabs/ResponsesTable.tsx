import Icon from "@/modules/core/components/icons/Icon";
import Table from "@/modules/core/components/ui/table/Table";
import { CellContext, createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import { useAnswerContext } from "../../context/AnswerContext";
import { cleanOptionTags } from "@/modules/core/components/ui/canvas/utils/dynamicOptions";
import { Opcion } from "@/modules/features/tests/types/TestType";
import TestTextSectionQualify from "./TestTextSectionQualify";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import { STORAGE_URL } from "@/modules/core/constants/ENVIRONMENT";

interface TableResultados {
  pregunta: string;
  type: "image" | "text";
  [key: string]: string | boolean;
}

const columnHelper = createColumnHelper<TableResultados>();

const ResponsesTable = () => {
  const { modal, setOpen } = useModal<string>();
  const { test, resultados, seccionIndex, setSeccionIndex } =
    useAnswerContext();

  const seccion =
    test.secciones.length > 0 ? test.secciones[seccionIndex] : undefined;

  const columns = useMemo(
    () => [
      columnHelper.accessor("pregunta", {
        header: "Pregunta",
        cell: (info) => {
          switch (info.row.original.type) {
            case "text":
              return (
                <p className="line-clamp-3 whitespace-pre-line leading-normal">
                  {cleanOptionTags(info.getValue())}
                </p>
              );
            case "image":
              return (
                <button
                  onClick={() => setOpen(info.row.original.pregunta)}
                  className="line-clamp-3 whitespace-pre-line leading-normal underline hover:text-primary-800 transition-all duration-300"
                >
                  Ver imagen
                </button>
              );
          }
        },
        meta: {
          minWidth: 200,
        },
      }),
      ...(seccion?.opciones.map((opcion) => ({
        accessorKey: opcion.descripcion,
        header: opcion.descripcion,
        cell: (info: CellContext<TableResultados, any>) => (
          <input
            className="accent-primary-500 pointer-events-none [&:not(:checked)]:opacity-40"
            tabIndex={-1}
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
    const opciones: Opcion[] = [];
    if (seccion.type === "multi") {
      const ids = respuesta?.idOpcion;
      if (Array.isArray(ids)) {
        const opcionesSeleccionadas = seccion.opciones.filter((o) =>
          ids.includes(o.id)
        );
        opciones.push(...opcionesSeleccionadas);
      }
    } else {
      const opcion = seccion?.opciones.find(
        (o) => o.id === respuesta?.idOpcion
      );
      if (opcion) {
        opciones.push(opcion);
      }
    }
    let res: TableResultados = {
      pregunta: pregunta.descripcion,
      type: pregunta.type ?? "text",
    };
    opciones.forEach((opcion) => {
      res[opcion.descripcion] = true;
    });
    return res;
  });

  return (
    <>
      {modal("Pregunta", (item) => (
        <div className="w-full h-40 flex items-center justify-center">
          <img
            className="w-full max-w-full max-h-full object-contain"
            src={STORAGE_URL + item}
          />
        </div>
      ))}
      <div className="bg-primary-100 dark:bg-primary-1000 px-4 pt-2 pb-2 flex justify-center">
        <div className="w-80 flex gap-4 items-center justify-between">
          <button
            className="w-5 aspect-square text-alto-500 dark:text-alto-100 disabled:text-alto-200 dark:disabled:text-alto-900"
            onClick={() => setSeccionIndex(seccionIndex - 1)}
            disabled={seccionIndex === 0}
          >
            <Icon type={Icon.Types.CHEVRON_LEFT} />
          </button>
          <p className="font-semibold text-primary-950 dark:text-primary-100 text-sm">
            Sección {seccionIndex + 1}
          </p>
          <button
            onClick={() => setSeccionIndex(seccionIndex + 1)}
            disabled={seccionIndex === test.secciones.length - 1}
            className="w-5 aspect-square text-alto-500 dark:text-alto-100 disabled:text-alto-200 dark:disabled:text-alto-900"
          >
            <Icon type={Icon.Types.CHEVRON_RIGHT} />
          </button>
        </div>
      </div>
      {seccion?.type === "text" ? (
        <TestTextSectionQualify seccion={seccion} />
      ) : (
        <Table rounded={false} border={false} data={data} columns={columns} />
      )}
    </>
  );
};

export default ResponsesTable;
