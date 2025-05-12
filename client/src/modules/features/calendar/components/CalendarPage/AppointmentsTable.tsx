import DefaultPhoto from "@/assets/images/defaultPhoto.jpg";
import Icon from "@/modules/core/components/icons/Icon";
import DoubleColumn from "@/modules/core/components/ui/table/columns/DoubleColumn";
import PhotoColumn from "@/modules/core/components/ui/table/columns/PhotoColumn";
import StateColumn from "@/modules/core/components/ui/table/columns/StateColumn";
import TableHeader from "@/modules/core/components/ui/table/header/TableHeader";
import Table from "@/modules/core/components/ui/table/Table";
import { useReturnTo } from "@/modules/core/hooks/navigation/useReturnTo";
import { formatDate } from "@/modules/core/utils/formatDate";
import { validateRoute } from "@/modules/features/_layout/components/breadcrumb/utils/validateRoute";
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
import AppointmentPassedFilters from "./AppointmentPassedFilters";

const columnHelper = createColumnHelper<Appointment>();

interface Props {
  patient: User;
  data: Appointment[] | undefined;
}

const AppointmentsTable = ({ patient, data }: Props) => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<AppointmentPassedFiltersState>({
    type: "nombre",
    value: "",
  });
  const { goWithReturnTo } = useReturnTo();

  const columns = useMemo(
    () => [
      columnHelper.accessor("nombre_psicologo", {
        header: "Psicólogo",
        cell: (info) => (
          <PhotoColumn
            src={info.row.original.foto_psicologo || DefaultPhoto}
            text={info.getValue()}
            small={info.row.original.email_psicologo}
          />
        ),
      }),
      columnHelper.accessor("fecha", {
        header: "Fecha",
        cell: (info) => {
          const { day } = stringFromDate(dayjs(info.row.original.fecha));
          const isMine = info.row.original.email_psicologo === user?.email;
          return (
            <DoubleColumn
              text={formatDate(
                info.row.original.fecha,
                info.row.original.hora_inicio
              )}
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
      columnHelper.accessor("metodo", {
        header: "Resumen",
        cell: (info) => {
          return (
            <DoubleColumn
              text={info.getValue() ?? "Sin atender"}
              textTitleDetail="Método"
              small={info.row.original.derivado_a ?? "Sin derivar"}
              smallTitleDetail="Derivado a"
              icon={Icon.Types.ARROW_RIGHT}
            />
          );
        },
        meta: {
          width: 148,
        },
      }),
      columnHelper.accessor(
        (row) =>
          row.id === patient?.cita_proxima?.id
            ? "Próximo"
            : row.derivado_a
            ? "Derivado"
            : row.metodo
            ? "Corregido"
            : "No asistió",
        {
          header: "Estado",
          cell: (info) => (
            <StateColumn
              data={[
                {
                  text: "Próximo",
                  color: "alto",
                  condition: info.getValue() === "Próximo",
                },
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
                  text: "No asistió",
                  color: "danger",
                  condition: info.getValue() === "No asistió",
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
          const isProximo = v.id === patient?.cita_proxima?.id;
          if (value === "Próximo") {
            return isProximo;
          }
          if (value === "Corregido") {
            return !!v.metodo && !v.derivado_a;
          }
          if (value === "Derivado") {
            return !!v.derivado_a;
          }
          if (value === "No asistió") {
            return !v.derivado_a && !v.metodo && !isProximo;
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
    <Table
      border={false}
      columns={columns}
      data={filteredData}
      actions={[
        {
          fn: (row) => {
            navigate({
              to: "/calendar/$id",
              params: { id: String(row.id) },
              search: {
                returnTo: goWithReturnTo(
                  validateRoute("/patients/$id", {
                    id: row.email_paciente,
                  })
                ),
              },
            });
          },
          icon: Icon.Types.EYE,
          title: "Ver cita",
          type: "secondary",
          disabled: (row) =>
            !dayjs(row.fecha).isBefore(dayjs(), "day") &&
            row.email_psicologo !== user?.email,
        },
      ]}
    >
      <AppointmentPassedContextProvider
        value={{
          filters,
          setFilters,
        }}
      >
        <TableHeader rowsName="citas" rowsNameSingular="cita">
          <AppointmentPassedFilters />
        </TableHeader>
      </AppointmentPassedContextProvider>
    </Table>
  );
};

export default AppointmentsTable;
