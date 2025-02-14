import DefaultPhoto from "@/assets/images/defaultPhoto.jpg";
import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import { CanvasItemContent } from "@/modules/core/components/ui/canvas/types/Canvas";
import { STORAGE_URL } from "@/modules/core/constants/ENVIRONMENT";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { formatDate } from "@/modules/core/utils/formatDate";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toasts";
import { BlogsView } from "@/routes/_private/blogs";
import { useNavigate } from "@tanstack/react-router";
import { useUserContext } from "../../auth/context/UserContext";
import { usePermiso } from "../../auth/hooks/usePermiso";
import { Permisos } from "../../auth/types/Permisos";
import { Blog } from "../api/responses";

interface Props {
  blog: Blog;
  viewOwns: boolean;
  view: BlogsView;
  handleStandout: (blog: Blog) => void;
  onSuccessDelete: (id: number) => void;
}

const BlogCard = ({
  blog,
  viewOwns,
  view,
  handleStandout,
  onSuccessDelete,
}: Props) => {
  const { state } = useUserContext();
  const isUnlogged = state === "unlogged";

  const navigate = useNavigate();

  const { postData } = useFetch();
  const deleteMutation = postData("DELETE /blog/:id");

  const handleDelete = () => {
    toastConfirm("¿Quieres eliminar este blog permanentemente?", () => {
      deleteMutation(null, {
        params: {
          id: blog.id,
        },
        onSuccess: (res) => {
          toastSuccess(res.message);
          onSuccessDelete(blog.id);
        },
      });
    });
  };

  const canStandout = usePermiso([Permisos.DESTACAR_BLOGS]);

  const firstParagraph = blog.config.find(
    (item) => item.type === "paragraph"
  ) as CanvasItemContent | undefined;

  return (
    <article
      onClick={() => {
        if (isUnlogged) {
          navigate({
            to: "/daily/$id",
            params: {
              id: String(blog.id),
            },
          });
        } else {
          navigate({
            to: "/blogs/$id",
            params: {
              id: String(blog.id),
            },
            search: {
              view,
            },
          });
        }
      }}
      className="cursor-pointer w-full text-start hover:opacity-90 transition-opacity duration-300 flex flex-col text-alto-950 dark:text-alto-50"
    >
      <div
        className="h-36 w-full rounded-xl relative isolate overflow-hidden shadow-md shadow-alto-950/20 dark:shadow-alto-50/10 mb-4"
        title={blog.titulo}
      >
        <img
          className="w-full h-full object-cover -z-10"
          src={STORAGE_URL + blog.portada}
        />
        <span className="absolute inset-0 bg-primary-1000/50" />
        {blog.destacado && !canStandout && (
          <div title="Destacado" className="absolute top-4 right-4 text-white">
            <Icon type={Icon.Types.STAR} />
          </div>
        )}
        {canStandout && (
          <button
            title="Destacar blog"
            className="absolute top-4 right-4 text-white hover:opacity-80 transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation();
              handleStandout(blog);
            }}
          >
            <Icon
              type={blog.destacado ? Icon.Types.STAR : Icon.Types.STAR_OUTLINE}
            />
          </button>
        )}
      </div>
      <h3 className="font-normal mb-2 line-clamp-1" title={blog.titulo}>
        {blog.titulo}
      </h3>
      <div className="h-9 mb-4">
        <p className="text-xs font-light opacity-80 leading-normal line-clamp-2">
          {blog.descripcion ?? firstParagraph?.content}
        </p>
      </div>
      <div
        className="flex justify-between gap-4 w-full"
        title={`${blog.autor.nombre} • ${formatDate(blog.updated_at)}`}
      >
        <div className="flex items-center gap-4 flex-1 overflow-hidden">
          <img
            className="w-[34px] h-[34px] border border-alto-800/20 dark:border-alto-300/90 rounded-md"
            src={blog.autor.foto ?? DefaultPhoto}
            onError={(event) => {
              event.currentTarget.src = DefaultPhoto;
            }}
          />
          <p className="text-xs flex whitespace-nowrap overflow-hidden flex-1 gap-1">
            <span className="overflow-hidden overflow-ellipsis">
              {viewOwns ? "Tú" : blog.autor.nombre}
            </span>
            <span>• {formatDate(blog.updated_at)}</span>
          </p>
        </div>
        <div className="flex gap-2">
          {viewOwns && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                navigate({
                  to: "/blogs/create/$id",
                  params: {
                    id: String(blog.id),
                  },
                  search: {
                    view,
                  },
                });
              }}
              icon={Icon.Types.PENCIL}
              btnSize="small"
              title="Editar blog"
            >
              Editar
            </Button>
          )}
          {canStandout && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              icon={Icon.Types.TRASH}
              btnType="secondary"
              danger
              btnSize="small"
              title="Eliminar blog"
            />
          )}
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
