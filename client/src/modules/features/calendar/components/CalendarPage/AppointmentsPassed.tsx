import Table from "@/modules/core/components/ui/table/Table";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Appointment } from "../../api/responses";
import { createColumnHelper } from "@tanstack/react-table";
import DefaultPhoto from "@/assets/images/defaultPhoto.jpg";
import clsx from "clsx";
import { formatDate } from "@/modules/core/utils/formatDate";
import Icon from "@/modules/core/components/icons/Icon";
import { stringFromDate } from "../../utils/stringFromDate";
import dayjs from "dayjs";
import { useNavigate } from "@tanstack/react-router";
import {
  AppointmentPassedContextProvider,
  AppointmentPassedFiltersState,
} from "../../context/AppointmentPassedContext";
import AppointmentPassedFilters from "./AppointmentPassedFilters";
import TableHeader from "@/modules/core/components/ui/table/header/TableHeader";

const columnHelper = createColumnHelper<Appointment>();

const AppointmentsPassed = () => {
  const { fetchData } = useFetch();
  const { data } = fetchData("GET /cita", {
    params: {
      previous: "true",
    },
  });
  const navigate = useNavigate();
  const [filters, setFilters] = useState<AppointmentPassedFiltersState>({
    type: "nombre",
    value: "",
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor("nombre_paciente", {
        header: "Usuario",
        cell: (info) => (
          <div className="flex gap-3 items-center w-full overflow-hidden">
            <div className="min-w-10 w-10 aspect-square rounded-md bg-alto-100 overflow-hidden">
              <img
                className="w-full h-full"
                src={info.row.original.foto_paciente || DefaultPhoto}
                onError={(event) => {
                  event.currentTarget.src = DefaultPhoto;
                }}
              />
            </div>
            <div className="flex-1 flex flex-col gap-1 overflow-hidden">
              <strong className="font-semibold text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                {info.getValue()}
              </strong>
              <p className="text-[10px] font-medium text-alto-700 dark:text-alto-400">
                {info.row.original.email_paciente}
              </p>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("fecha", {
        header: "Edad y género",
        cell: (info) => {
          const { day } = stringFromDate(dayjs(info.row.original.fecha));
          return (
            <div className="flex-1 flex flex-col gap-1 overflow-hidden">
              <strong className="font-semibold text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                {formatDate(info.row.original.fecha)}
              </strong>
              <div className="flex justify-between text-[10px] font-medium text-alto-700 dark:text-alto-400">
                <span>{day}</span>
                <a
                  href={info.row.original.html_link_calendar}
                  className="text-[10px] font-medium text-alto-700 dark:text-alto-400 overflow-hidden whitespace-nowrap flex gap-1 underline hover:text-primary-400 max-w-max"
                >
                  <div className="w-3 aspect-square">
                    <Icon type={Icon.Types.GOOGLE_CALENDAR} />
                  </div>
                  <p>Ver</p>
                </a>
              </div>
            </div>
          );
        },
        meta: {
          width: 148,
        },
      }),
      columnHelper.accessor(
        (row) =>
          row.derivado_a ? "Derivado" : row.metodo ? "Corregido" : "Ignorado",
        {
          header: "Estado",
          cell: (info) => (
            <div className="flex-1 flex flex-col gap-1 overflow-hidden items-center">
              <span
                className={clsx("text-xs w-max px-4 py-1 rounded-md", {
                  "bg-warning/10 text-warning": info.getValue() === "Derivado",
                  "bg-success/10 text-success": info.getValue() === "Corregido",
                  "bg-danger/10 text-danger": info.getValue() === "Ignorado",
                })}
              >
                {info.getValue()}
              </span>
            </div>
          ),
          meta: {
            width: 120,
          },
        }
      ),
    ],
    []
  );

  const getFilteredData = () => {
    return data?.filter((v) => {
      const { value } = filters;
      switch (filters.type) {
        case "nombre":
          return v.nombre_paciente
            ?.toLocaleLowerCase()
            .includes(value.trim().toLocaleLowerCase());
        case "estado":
          if (!value) return true;
          if (value === "Corregido") {
            return !!v.metodo && !v.derivado_a;
          }
          if (value === "Derivado") {
            return !!v.derivado_a;
          }
          if (value === "Ignorado") {
            return !v.derivado_a && !v.metodo;
          }
          break;
        case "fecha":
          return v.fecha
            ?.toLocaleLowerCase()
            .includes(value.trim().toLocaleLowerCase());
        default:
          return true;
      }
    });
  };

  const filteredData = getFilteredData();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col"
    >
      <Table
        columns={columns}
        data={filteredData}
        actions={[
          {
            fn: (row) =>
              navigate({
                to: "/calendar/$id",
                params: { id: String(row.id) },
              }),
            icon: Icon.Types.EYE,
            title: "Editar",
            type: "secondary",
          },
        ]}
      >
        <AppointmentPassedContextProvider
          value={{
            filters,
            setFilters,
          }}
        >
          <TableHeader>
            <AppointmentPassedFilters />
          </TableHeader>
        </AppointmentPassedContextProvider>
      </Table>
    </motion.div>
  );
};

export default AppointmentsPassed;
