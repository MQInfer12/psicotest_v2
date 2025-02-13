import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import { useNavigate } from "@tanstack/react-router";
import { useMeasureContext } from "../../_layout/context/MeasureContext";
import { usePermiso } from "../../auth/hooks/usePermiso";
import { Permisos } from "../../auth/types/Permisos";
import BlogCard from "../components/BlogCard";
import FeaturedBlog from "../components/FeaturedBlog";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { BlogsView } from "@/routes/_private/blogs";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toasts";
import { Blog } from "../api/responses";
import Loader from "@/modules/core/components/ui/loader/Loader";
import { useUserContext } from "../../auth/context/UserContext";
import clsx from "clsx";

interface Props {
  view?: BlogsView;
}

const BlogsPage = ({ view = BlogsView.ALL }: Props) => {
  const { state } = useUserContext();
  const isUnlogged = state === "unlogged";

  const { PRIVATE_PADDING_INLINE } = useMeasureContext();
  const navigate = useNavigate();
  const { fetchData, postData } = useFetch();

  const canCreate = usePermiso([Permisos.CREAR_BLOGS]);

  const { data, setData } = fetchData("GET /blog");
  const { data: ownData, setData: setOwnData } = fetchData("GET /blog/for/me", {
    queryOptions: {
      gcTime: 0,
      //@ts-expect-error: enabled should be a valid option
      enabled: canCreate,
    },
  });
  const patchMutation = postData("PATCH /blog/standout/:id");

  const handleStandout = (blog: Blog) => {
    toastConfirm(
      blog.destacado
        ? "¿Quieres quitar este blog del destacado?"
        : "¿Quieres destacar este blog?",
      () => {
        patchMutation(null, {
          params: {
            id: blog.id,
          },
          onSuccess: (res) => {
            toastSuccess(res.message);
            if (blog.destacado) {
              setData((prev) =>
                prev?.map((b) =>
                  b.id === blog.id ? { ...b, destacado: false } : b
                )
              );
              setOwnData((prev) =>
                prev?.map((b) =>
                  b.id === blog.id ? { ...b, destacado: false } : b
                )
              );
            } else {
              setData((prev) => {
                return prev?.map((b) => {
                  if (b.id === blog.id) {
                    return { ...b, destacado: true };
                  }
                  return { ...b, destacado: false };
                });
              });
              setOwnData((prev) => {
                return prev?.map((b) => {
                  if (b.id === blog.id) {
                    return { ...b, destacado: true };
                  }
                  return { ...b, destacado: false };
                });
              });
            }
          },
        });
      }
    );
  };

  const viewOwns = canCreate ? view === BlogsView.OWN : false;
  const setViewOwns = (newView: BlogsView) => {
    navigate({
      to: "/blogs",
      search: {
        view: newView,
      },
    });
  };

  const destacado = data?.find((b) => b.destacado);
  const blogsWithoutStarred = data?.filter((b) => !b.destacado);

  return (
    <div
      className="flex flex-col gap-8 h-full overflow-y-scroll overflow-x-hidden"
      style={{
        paddingInline: PRIVATE_PADDING_INLINE,
        paddingBottom: PRIVATE_PADDING_INLINE,
      }}
    >
      {canCreate && (
        <div className="flex gap-4 justify-between items-center">
          <span />
          <div className="flex gap-4">
            <Button
              onClick={() =>
                setViewOwns(viewOwns ? BlogsView.ALL : BlogsView.OWN)
              }
              btnType="tertiary"
              btnSize="small"
              icon={Icon.Types.BLOG}
            >
              {viewOwns ? "Ver todos" : "Ver propios"}
            </Button>
            <Button
              onClick={() => {
                navigate({
                  to: "/blogs/create",
                  search: {
                    view,
                  },
                });
              }}
              btnSize="small"
              icon={Icon.Types.ADD}
            >
              Crear blog
            </Button>
          </div>
        </div>
      )}
      {data ? (
        <>
          {!viewOwns && destacado && (
            <FeaturedBlog
              blog={destacado}
              view={view}
              handleStandout={handleStandout}
            />
          )}
          <div className="flex flex-col gap-8">
            <h3 className="text-primary-900 dark:text-primary-400 font-bold">
              {viewOwns ? "Blogs propios" : "Blogs recientes"}
            </h3>
            <div
              className="grid gap-10 gap-y-10 place-content-center"
              style={{
                gridTemplateColumns: `repeat(auto-fill, minmax(300px, 420fr))`,
              }}
            >
              {(viewOwns ? ownData : blogsWithoutStarred)?.map((b) => (
                <BlogCard
                  key={b.id}
                  blog={b}
                  viewOwns={viewOwns}
                  view={view}
                  handleStandout={handleStandout}
                  onSuccessDelete={(id) => {
                    setData((prev) => prev?.filter((b) => b.id !== id));
                    setOwnData((prev) => prev?.filter((b) => b.id !== id));
                  }}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div
          className={clsx("flex justify-center items-center", {
            "min-h-[calc(100svh-120px)]": isUnlogged,
            "flex-1": !isUnlogged,
          })}
        >
          <Loader text="Cargando blogs..." />
        </div>
      )}
    </div>
  );
};

export default BlogsPage;
