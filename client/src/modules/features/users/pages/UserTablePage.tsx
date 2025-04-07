import Icon from "@/modules/core/components/icons/Icon";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import DoubleColumn from "@/modules/core/components/ui/table/columns/DoubleColumn";
import PhotoColumn from "@/modules/core/components/ui/table/columns/PhotoColumn";
import StateColumn from "@/modules/core/components/ui/table/columns/StateColumn";
import TableHeader from "@/modules/core/components/ui/table/header/TableHeader";
import Table from "@/modules/core/components/ui/table/Table";
import { postData } from "@/modules/core/hooks/useFetch/postData";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { formatDate } from "@/modules/core/utils/formatDate";
import { getTodayUtc } from "@/modules/core/utils/getTodayUtc";
import { measureAge } from "@/modules/core/utils/measureAge";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toasts";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useMeasureContext } from "../../_layout/context/MeasureContext";
import PreAppointmentForm from "../../calendar/components/CalendarPage/PreAppointmentForm";
import { User } from "../api/responses";
import UserTableFilters from "../components/UserTableFilters";
import {
  UserTableContextProvider,
  UserTableFiltersState,
} from "../context/UserTableContext";

const columnHelper = createColumnHelper<User>();

const UserTablePage = () => {
  const [filters, setFilters] = useState<UserTableFiltersState>({
    type: "nombre",
    value: "",
  });
  const [showAnonymous, setShowAnonymous] = useState(false);
  const { modal, setOpen } = useModal<User>();
  const { fetchData } = useFetch();
  const { data, setData } = fetchData("GET /user");
  const { data: roles } = fetchData("GET /rol");
  const deleteMutation = postData("DELETE /user/:id/psicotest");
  const changeStateMutation = postData(
    "PATCH /user/change-state/:id/psicotest"
  );
  const changeRolMutation = postData("PATCH /user/change-rol/:id/psicotest");
  const { PRIVATE_PADDING_INLINE } = useMeasureContext();

  const handleDelete = (id: string) => {
    toastConfirm("¿Quieres eliminar este usuario?", () =>
      deleteMutation(null, {
        params: {
          id,
        },
        onSuccess: (res) => {
          toastSuccess(res.message);
          setData((prev) => prev.filter((v) => v.email !== id));
        },
      })
    );
  };

  const handleChangeState = (id: string) => {
    toastConfirm("¿Quires cambiar el estado de este usuario?", () =>
      changeStateMutation(null, {
        params: {
          id,
        },
        onSuccess: (res) => {
          toastSuccess(res.message);
          setData((prev) =>
            prev.map((v) => (v.email === res.data.email ? res.data : v))
          );
        },
      })
    );
  };

  const handleChangeRol = (id: string, id_rol: number) => {
    changeRolMutation(
      {
        id_rol,
      },
      {
        params: {
          id,
        },
        onSuccess: (res) => {
          toastSuccess(res.message);
          setData((prev) =>
            prev.map((v) => (v.email === res.data.email ? res.data : v))
          );
        },
      }
    );
  };

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
      columnHelper.accessor("created_at", {
        header: "Registrado",
        cell: (info) => (
          <DoubleColumn
            text={formatDate(info.row.original.created_at)}
            small={info.row.original.created_at.split("T")[1].substring(0, 5)}
            icon={Icon.Types.CLOCK}
          />
        ),
        meta: {
          width: 120,
        },
      }),
      columnHelper.accessor("estado", {
        header: "Estado",
        cell: (info) => (
          <StateColumn
            data={[
              {
                text: "Inactivo",
                color: "danger",
                condition: !info.row.original.estado,

                onClick: () => handleChangeState(info.row.original.email),
              },
              {
                text: "Activo",
                color: "success",
                condition: info.row.original.estado,
                onClick: () => handleChangeState(info.row.original.email),
              },
            ]}
          />
        ),
        meta: {
          width: 120,
        },
      }),
      columnHelper.accessor("id_rol", {
        header: "Rol",
        cell: (info) => (
          <div className="flex-1 flex flex-col gap-1 overflow-hidden items-center">
            <select
              className="w-full bg-transparent"
              value={info.row.original.id_rol}
              onChange={(e) =>
                handleChangeRol(
                  info.row.original.email,
                  Number(e.target.value || 0)
                )
              }
            >
              {roles?.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.descripcion}
                </option>
              )) ?? <option value="">Cargando...</option>}
            </select>
          </div>
        ),
        meta: {
          width: 148,
        },
      }),
    ],
    [setData]
  );

  const getFilteredData = () => {
    return data?.filter((v) => {
      if (!showAnonymous) {
        if (v.email.includes("@neurall.com")) return false;
      }
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
        columns={columns}
        data={filteredData}
        actions={[
          {
            fn: setOpen,
            icon: Icon.Types.PENCIL,
            title: "Editar",
            type: "secondary",
          },
          {
            fn: (row) => {
              handleDelete(row.email);
            },
            icon: Icon.Types.TRASH,
            title: "Eliminar",
            type: "secondary",
            danger: true,
          },
        ]}
      >
        <UserTableContextProvider
          value={{
            roles,
            filters,
            setFilters,
            showAnonymous,
            setShowAnonymous,
          }}
        >
          <TableHeader>
            <UserTableFilters />
          </TableHeader>
        </UserTableContextProvider>
      </Table>
      {modal(
        "Formulario de usuario",
        (item) => (
          <PreAppointmentForm
            user={item}
            withName
            required={false}
            onSuccess={async (user) => {
              toastSuccess("Usuario actualizado con éxito");
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
        ),
        {
          width: 480,
        }
      )}
    </div>
  );
};

export default UserTablePage;
