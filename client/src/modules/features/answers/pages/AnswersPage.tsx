import Table from "@/modules/core/components/ui/table/Table";
import { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import Icon from "@/modules/core/components/icons/Icon";
import { useNavigate } from "@tanstack/react-router";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { T_Tests_Respuestas } from "../../tests/api/responses";
import clsx from "clsx";
import { RespuestaEstado } from "../types/RespuestaEstado";
import { motion } from "framer-motion";
import DefaultPhoto from "@/assets/images/defaultPhoto.jpg";
import { useMeasureContext } from "../../_layout/context/MeasureContext";
import FolderList from "../../folders/components/FolderList";
import { useDebounce } from "@/modules/core/hooks/useDebounce";

const columnHelper = createColumnHelper<T_Tests_Respuestas>();

const AnswersPage = () => {
  const [selectedFolders, setSelectedFolders] = useState<number[]>([]);
  const { debouncedValue, isDebouncing } = useDebounce(
    JSON.stringify(selectedFolders),
    {
      delay: 1200,
    }
  );

  const { fetchData } = useFetch();
  const { data, isLoading } = fetchData("GET /respuesta/for/table", {
    params: {
      folders: debouncedValue ?? "[]",
    },
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState<number | null>(null);
  const { PRIVATE_PADDING_INLINE } = useMeasureContext();

  const columns = useMemo(
    () => [
      columnHelper.accessor("nombre_user", {
        header: "Usuario",
        cell: (info) => (
          <div className="flex gap-3 items-center w-full overflow-hidden">
            <div className="min-w-10 w-10 aspect-square rounded-md bg-alto-100 overflow-hidden">
              <motion.img
                layoutId={`answer-foto-${info.row.original.id_respuesta}`}
                className="w-full h-full"
                src={info.row.original.foto_user || DefaultPhoto}
              />
            </div>
            <div className="flex-1 flex flex-col gap-1 overflow-hidden">
              <motion.strong
                layoutId={`answer-nombre-${info.row.original.id_respuesta}`}
                className="font-semibold text-sm whitespace-nowrap overflow-hidden text-ellipsis"
              >
                {info.getValue()}
              </motion.strong>
              <motion.p
                layoutId={`answer-email-${info.row.original.id_respuesta}`}
                className="text-[10px] font-medium text-alto-700"
              >
                {info.row.original.email_user}
              </motion.p>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("nombre_test", {
        header: "Test",
        cell: (info) => (
          <div className="flex-1 flex flex-col gap-1 overflow-hidden">
            <motion.strong
              layoutId={`answer-test-${info.row.original.id_respuesta}`}
              className="font-semibold text-sm text-primary-600 whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {info.getValue()}
            </motion.strong>
            <p className="text-[10px] font-medium text-alto-700 overflow-hidden whitespace-nowrap">
              por:{" "}
              <span className="font-semibold">
                {info.row.original.nombre_autor ||
                  info.row.original.nombre_autor_creador}
              </span>
            </p>
          </div>
        ),
        meta: {
          width: 200,
        },
      }),
      columnHelper.accessor("estado", {
        header: "Estado",
        cell: (info) => (
          <small
            className={clsx("px-2 py-[2px] text-xs font-semibold rounded-md", {
              "bg-success/10 text-success":
                info.getValue() === RespuestaEstado.ENVIADO,
              "bg-alto-600/10 text-alto-600":
                info.getValue() === RespuestaEstado.PENDIENTE,
            })}
          >
            {info.getValue()}
          </small>
        ),
        meta: {
          width: 200,
        },
      }),
    ],
    []
  );

  return (
    <div
      style={{
        paddingInline: PRIVATE_PADDING_INLINE,
      }}
      className="flex pb-10 flex-1 overflow-hidden gap-8"
    >
      <FolderList
        selectedFolders={selectedFolders}
        setSelectedFolders={setSelectedFolders}
        loading={isDebouncing || isLoading}
      />
      <Table
        data={data}
        columns={columns}
        actions={[
          {
            fn: (row) => {
              setLoading(row.id_respuesta);
              navigate({
                to: "/answers/$id",
                params: {
                  id: String(row.id_respuesta),
                },
              });
            },
            icon: Icon.Types.BRAIN,
            title: "Ver respuesta",
            disabled: (row) => row.estado === RespuestaEstado.PENDIENTE,
          },
        ]}
        loadingRow={(row) => row.id_respuesta === loading}
        shadow
        smallEmptyMessage="Selecciona una carpeta para mostrar las respuestas"
      />
    </div>
  );
};

export default AnswersPage;
