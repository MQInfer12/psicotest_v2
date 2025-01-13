import { createColumnHelper } from "@tanstack/react-table";
import { Appointment } from "../../api/responses";
import { useMemo, useState } from "react";
import DefaultPhoto from "@/assets/images/defaultPhoto.jpg";
import { stringFromDate } from "../../utils/stringFromDate";
import dayjs from "dayjs";
import { formatDate } from "@/modules/core/utils/formatDate";
import Icon from "@/modules/core/components/icons/Icon";
import clsx from "clsx";
import Table from "@/modules/core/components/ui/table/Table";
import {
  AppointmentPassedContextProvider,
  AppointmentPassedFiltersState,
} from "../../context/AppointmentPassedContext";
import TableHeader from "@/modules/core/components/ui/table/header/TableHeader";
import AppointmentPassedFilters from "./AppointmentPassedFilters";
import { useNavigate } from "@tanstack/react-router";
import { useUserContext } from "@/modules/features/auth/context/UserContext";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import AppointmentPDFsRenderer from "../AppointmentPage/AppointmentPDFsRenderer";
import { User } from "@/modules/features/users/api/responses";

const columnHelper = createColumnHelper<Appointment>();

interface Props {
  isProfile?: User;
  data: Appointment[] | undefined;
}

const AppointmentsTable = ({ isProfile, data }: Props) => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<AppointmentPassedFiltersState>({
    type: "nombre",
    value: "",
  });
  const { modal, setOpen } = useModal<Appointment>();

  const columns = useMemo(
    () => [
      columnHelper.accessor(
        isProfile ? "nombre_psicologo" : "nombre_paciente",
        {
          header: isProfile ? "Psicólogo" : "Usuario",
          cell: (info) => (
            <div className="flex gap-3 items-center w-full overflow-hidden">
              <div className="min-w-10 w-10 aspect-square rounded-md bg-alto-100 overflow-hidden">
                <img
                  className="w-full h-full"
                  src={
                    (isProfile
                      ? info.row.original.foto_psicologo
                      : info.row.original.foto_paciente) || DefaultPhoto
                  }
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
                  {isProfile
                    ? info.row.original.email_psicologo
                    : info.row.original.email_paciente}
                </p>
              </div>
            </div>
          ),
        }
      ),
      columnHelper.accessor("fecha", {
        header: "Fecha",
        cell: (info) => {
          const { day } = stringFromDate(dayjs(info.row.original.fecha));
          return (
            <div className="flex-1 flex flex-col gap-1 overflow-hidden">
              <strong className="font-semibold text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                {formatDate(info.row.original.fecha)}
              </strong>
              <div className="flex justify-between text-[10px] font-medium text-alto-700 dark:text-alto-400">
                <span>{day}</span>
                {info.row.original.email_psicologo === user?.email && (
                  <a
                    href={info.row.original.html_link_calendar}
                    className="text-[10px] font-medium text-alto-700 dark:text-alto-400 overflow-hidden whitespace-nowrap flex gap-1 underline hover:text-primary-400 max-w-max"
                  >
                    <div className="w-3 aspect-square">
                      <Icon type={Icon.Types.GOOGLE_CALENDAR} />
                    </div>
                    <p>Ver</p>
                  </a>
                )}
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
    <>
      {modal(
        (item) => `Detalles de la cita (${item ? formatDate(item.fecha) : ""})`,
        (item) =>
          item &&
          isProfile && (
            <div className="h-full w-full">
              <AppointmentPDFsRenderer cita={item} paciente={isProfile} />
            </div>
          ),
        {
          width: 900,
          type: "floating",
        }
      )}
      <Table
        border={!isProfile}
        columns={columns}
        data={filteredData}
        actions={
          isProfile
            ? [
                {
                  fn: (row) => setOpen(row),
                  icon: Icon.Types.EYE,
                  title: "Ver",
                  type: "secondary",
                },
              ]
            : [
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
              ]
        }
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
    </>
  );
};

export default AppointmentsTable;
