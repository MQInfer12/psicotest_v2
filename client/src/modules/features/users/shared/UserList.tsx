import { ICON } from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import PhotoColumn from "@/modules/core/components/ui/table/columns/PhotoColumn";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { useVirtualizer } from "@tanstack/react-virtual";
import { User } from "../api/responses";
import { useDebounce } from "@/modules/core/hooks/useDebounce";
import Loader from "@/modules/core/components/ui/loader/Loader";

const ROW_HEIGHT = 56;

interface Props {
  search: string;
  anonymous?: boolean;
  emptySearchAll?: boolean;
  idTest?: number;
  button?: {
    icon: ICON;
    onClick: (user: User) => void;
    title: string;
  };
}

const UserList = ({
  search,
  anonymous = false,
  emptySearchAll = true,
  idTest,
  button,
}: Props) => {
  const { fetchData } = useFetch();

  const { debouncedValue, isDebouncing } = useDebounce(search.trim());

  const { data, isLoading } = fetchData("GET /user/for/search", {
    params: {
      search: debouncedValue ?? "",
      anonymous: String(anonymous),
      emptySearchAll: String(emptySearchAll),
      idTest: idTest ? String(idTest) : "",
    },
  });

  const rowVirtualizer = useVirtualizer({
    count: data?.length ?? 0,
    estimateSize: () => ROW_HEIGHT,
    getScrollElement: () => document.getElementById("scroll-user-list"),
    overscan: 2,
  });

  return (
    <div className="h-96 flex flex-col gap-2 overflow-hidden">
      <div id="scroll-user-list" className="h-full overflow-y-scroll">
        {isLoading || isDebouncing ? (
          <div className="w-full h-full">
            <Loader scale="0.8" />
          </div>
        ) : !emptySearchAll && data?.length === 0 && !search ? (
          <div className="w-full h-full flex items-center justify-center">
            <small className="text-alto-950 dark:text-alto-50 opacity-60 leading-relaxed text-center text-xs">
              Realiza una búsqueda
            </small>
          </div>
        ) : data?.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <small className="text-alto-950 dark:text-alto-50 opacity-60 leading-relaxed text-center text-xs">
              No se encontraron datos
            </small>
          </div>
        ) : (
          <ul
            className="text-xs flex flex-col relative"
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const user = data?.[virtualRow.index];
              if (!user) return null;
              return (
                <li
                  key={user.email}
                  style={{
                    height: ROW_HEIGHT,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className="absolute top-0 w-full border-b px-2 flex gap-4 items-center min-h-14"
                >
                  <PhotoColumn
                    src={user.foto}
                    text={user.nombre}
                    small={user.email}
                  />
                  {button && (
                    <Button
                      btnType="secondary"
                      btnSize="small"
                      icon={button.icon}
                      title={button.title}
                      onClick={() => button.onClick(user)}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <small className="self-end text-[10px] text-alto-400">
        {isLoading || isDebouncing
          ? "Cargando..."
          : `${data?.length ?? 0} usuarios encontrados`}
      </small>
    </div>
  );
};

export default UserList;
