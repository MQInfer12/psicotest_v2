import useFetch from "@/modules/core/hooks/useFetch";
import { PRIVATE_PADDING_INLINE } from "../../_layout/constants/LAYOUT_SIZES";
import Table from "@/modules/core/components/ui/table/Table";
import { useMemo } from "react";
import { User } from "../../users/api/responses";
import { createColumnHelper } from "@tanstack/react-table";
import Icon from "@/modules/core/components/icons/Icon";
import { useNavigate } from "@tanstack/react-router";

const columnHelper = createColumnHelper<User>();

const AnswersPage = () => {
  const { fetchData } = useFetch();
  const { data } = fetchData("GET /user");
  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      columnHelper.accessor("nombre", {
        header: "Usuario",
        cell: (info) => (
          <div className="flex gap-3 items-center w-full overflow-hidden">
            <div className="min-w-10 w-10 aspect-square rounded-md bg-alto-100 overflow-hidden">
              {info.row.original.foto && (
                <img className="w-full h-full" src={info.row.original.foto} />
              )}
            </div>
            <div className="flex-1 flex flex-col gap-1 overflow-hidden">
              <strong className="font-semibold text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                {info.getValue()}
              </strong>
              <p className="text-[10px] font-medium text-alto-700">
                {info.row.original.email}
              </p>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("email", {
        header: "Test",
        cell: () => (
          <div className="flex-1 flex flex-col gap-1 overflow-hidden">
            <strong className="font-semibold text-sm text-primary-600 whitespace-nowrap overflow-hidden text-ellipsis">
              MAPI
            </strong>
            <p className="text-[10px] font-medium text-alto-700">
              por: <span className="font-semibold">MILLON</span>
            </p>
          </div>
        ),
        meta: {
          width: 200,
        },
      }),
      columnHelper.accessor("estado", {
        header: "Estado",
        cell: () => (
          <small className="px-2 py-[2px] text-xs font-semibold bg-success/10 text-success rounded-md">
            Enviado
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
      className="flex flex-col pb-10 flex-1"
    >
      <Table
        data={data}
        columns={columns}
        actions={[
          {
            fn: (row) =>
              navigate({
                to: "/answers/$id",
                params: {
                  id: row.email,
                },
              }),
            icon: Icon.Types.BRAIN,
            title: "Ver respuesta",
          },
        ]}
        shadow
      />
    </div>
  );
};

export default AnswersPage;
