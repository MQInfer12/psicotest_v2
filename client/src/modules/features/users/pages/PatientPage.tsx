import Icon from "@/modules/core/components/icons/Icon";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import DoubleColumn from "@/modules/core/components/ui/table/columns/DoubleColumn";
import PhotoColumn from "@/modules/core/components/ui/table/columns/PhotoColumn";
import TableHeader from "@/modules/core/components/ui/table/header/TableHeader";
import Table from "@/modules/core/components/ui/table/Table";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { getTodayUtc } from "@/modules/core/utils/getTodayUtc";
import { measureAge } from "@/modules/core/utils/measureAge";
import { useNavigate } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useMeasureContext } from "../../_layout/context/MeasureContext";
import { User } from "../api/responses";
import UserForm from "../components/UserForm";
import UserTableFilters from "../components/UserTableFilters";
import {
  UserTableContextProvider,
  UserTableFiltersState,
} from "../context/UserTableContext";

const columnHelper = createColumnHelper<User>();

const PatientPage = () => {
  const [filters, setFilters] = useState<UserTableFiltersState>({
    type: "nombre",
    value: "",
  });
  const { modal, setOpen } = useModal<User>();
  const { fetchData } = useFetch();
  const { data, setData } = fetchData("GET /user/for/patients");
  const { data: roles } = fetchData("GET /rol");
  const { PRIVATE_PADDING_INLINE } = useMeasureContext();
  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      columnHelper.accessor("nombre", {
        header: "Usuario",
        cell: (info) => (
          <PhotoColumn
            src={info.row.original.foto}
            text={info.getValue()}
            small={info.row.original.email}
          />
        ),
      }),
      columnHelper.accessor("fecha_nacimiento", {
        header: "Edad y género",
        cell: (info) => (
          <DoubleColumn
            text={
              info.row.original.fecha_nacimiento
                ? `${measureAge(info.row.original.fecha_nacimiento, getTodayUtc())} años`
                : "Sin especificar"
            }
            small={info.row.original.genero ?? "Sin especificar"}
            icon={
              info.row.original.genero
                ? info.row.original.genero === "Hombre"
                  ? Icon.Types.GENDER_MALE
                  : Icon.Types.GENDER_FEMALE
                : Icon.Types.GENDER_NONE
            }
          />
        ),
        meta: {
          width: 148,
        },
      }),
      columnHelper.accessor("carrera", {
        header: "Carrera",
        cell: (info) => (
          <DoubleColumn
            text={info.row.original.carrera || "Sin especificar"}
            small={
              info.row.original.codigo_estudiantil
                ? info.row.original.codigo_estudiantil
                : "Sin especificar"
            }
            icon={Icon.Types.BARCODE}
          />
        ),
        meta: {
          width: 192,
        },
      }),
      columnHelper.accessor("telefono", {
        header: "Contacto",
        cell: (info) => {
          let string = info.row.original.telefono_tutor ?? "-";
          if (info.row.original.nombre_tutor)
            string += ` (${info.row.original.nombre_tutor})`;
          return (
            <DoubleColumn
              text={
                info.row.original.telefono
                  ? String(info.row.original.telefono)
                  : "Sin especificar"
              }
              small={String(string)}
              icon={Icon.Types.CONTACT}
            />
          );
        },
        meta: {
          width: 192,
        },
      }),
    ],
    [setData]
  );

  const getFilteredData = () => {
    return data?.filter((v) => {
      const { value } = filters;
      switch (filters.type) {
        case "nombre":
          return v.nombre
            ?.toLocaleLowerCase()
            .includes(value.trim().toLocaleLowerCase());
        case "email":
          return v.email
            ?.toLocaleLowerCase()
            .includes(value.trim().toLocaleLowerCase());
        case "genero":
          if (!value) return true;
          console.log(value, v.genero);
          if (!v.genero) return value === "Sin especificar";
          return v.genero === value;
        case "estado":
          if (!value) return true;
          return v.estado ? value === "Activo" : value === "Inactivo";
        case "rol":
          if (!value) return true;
          return String(v.id_rol) === value;
        default:
          return true;
      }
    });
  };

  const filteredData = getFilteredData();

  return (
    <div
      style={{
        paddingInline: PRIVATE_PADDING_INLINE,
      }}
      className="flex-1 rounded-lg overflow-hidden shadow-lg flex flex-col pb-10"
    >
      <Table
        actions={[
          {
            title: "Ver",
            icon: Icon.Types.EYE,
            fn: (row) => {
              navigate({
                to: "/patients/$id",
                params: {
                  id: row.email,
                },
              });
            },
            type: "secondary",
          },
        ]}
        columns={columns}
        data={filteredData}
      >
        <UserTableContextProvider
          value={{
            roles,
            filters,
            setFilters,
          }}
        >
          <TableHeader>
            <UserTableFilters />
          </TableHeader>
        </UserTableContextProvider>
      </Table>
      {modal("Formulario de usuario", (item) => (
        <UserForm
          user={item}
          onSuccess={(user) => {
            if (!item) {
              setData((prev) => [...prev, user]);
            } else {
              setData((prev) =>
                prev.map((v) => (v.email === item.email ? user : v))
              );
            }
            setOpen(false);
          }}
        />
      ))}
    </div>
  );
};

export default PatientPage;
