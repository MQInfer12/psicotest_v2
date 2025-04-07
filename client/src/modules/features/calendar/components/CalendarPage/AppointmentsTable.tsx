import DefaultPhoto from "@/assets/images/defaultPhoto.jpg";
import Icon from "@/modules/core/components/icons/Icon";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import DoubleColumn from "@/modules/core/components/ui/table/columns/DoubleColumn";
import PhotoColumn from "@/modules/core/components/ui/table/columns/PhotoColumn";
import StateColumn from "@/modules/core/components/ui/table/columns/StateColumn";
import TableHeader from "@/modules/core/components/ui/table/header/TableHeader";
import Table from "@/modules/core/components/ui/table/Table";
import { formatDate } from "@/modules/core/utils/formatDate";
import { useUserContext } from "@/modules/features/auth/context/UserContext";
import { User } from "@/modules/features/users/api/responses";
import { useNavigate } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { Appointment } from "../../api/responses";
import {
  AppointmentPassedContextProvider,
  AppointmentPassedFiltersState,
} from "../../context/AppointmentPassedContext";
import { stringFromDate } from "../../utils/stringFromDate";
import AppointmentHistory from "../AppointmentPage/AppointmentHistory";
import AppointmentPassedFilters from "./AppointmentPassedFilters";

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
            <PhotoColumn
              src={
                (isProfile
                  ? info.row.original.foto_psicologo
                  : info.row.original.foto_paciente) || DefaultPhoto
              }
              text={info.getValue()}
              small={
                isProfile
                  ? info.row.original.email_psicologo
                  : info.row.original.email_paciente
              }
            />
          ),
        }
      ),
      columnHelper.accessor("fecha", {
        header: "Fecha",
        cell: (info) => {
          const { day } = stringFromDate(dayjs(info.row.original.fecha));
          const isMine = info.row.original.email_psicologo === user?.email;
          return (
            <DoubleColumn
              text={formatDate(info.row.original.fecha)}
              small={isMine ? `${day} (Ver)` : day}
              icon={isMine ? Icon.Types.GOOGLE_CALENDAR : undefined}
              onClickSmall={
                isMine
                  ? () => {
                      window.open(
                        info.row.original.html_link_calendar,
                        "_blank"
                      );
                    }
                  : undefined
              }
            />
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
            <StateColumn
              data={[
                {
                  text: "Derivado",
                  color: "warning",
                  condition: info.getValue() === "Derivado",
                },
                {
                  text: "Corregido",
                  color: "success",
                  condition: info.getValue() === "Corregido",
                },
                {
                  text: "Ignorado",
                  color: "danger",
                  condition: info.getValue() === "Ignorado",
                },
              ]}
            />
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
              <AppointmentHistory cita={item} paciente={isProfile} />
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
