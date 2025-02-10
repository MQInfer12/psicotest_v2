import DefaultPhoto from "@/assets/images/defaultPhoto.jpg";
import { STORAGE_URL } from "@/modules/core/constants/ENVIRONMENT";
import { Blog } from "../api/responses";
import { formatDate } from "@/modules/core/utils/formatDate";
import { useNavigate } from "@tanstack/react-router";
import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import { BlogsView } from "@/routes/_private/blogs";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toasts";
import { usePermiso } from "../../auth/hooks/usePermiso";
import { Permisos } from "../../auth/types/Permisos";

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

  return (
    <article
      onClick={() => {
        navigate({
          to: "/blogs/$id",
          params: {
            id: String(blog.id),
          },
          search: {
            view,
          },
        });
      }}
      className="cursor-pointer w-full text-start hover:opacity-90 transition-opacity duration-300 flex flex-col text-alto-950 dark:text-alto-50"
    >
      <div className="h-36 w-full rounded-xl relative isolate overflow-hidden shadow-md shadow-alto-950/20 dark:shadow-alto-50/10 mb-4">
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
      <h3 className="font-normal mb-2 line-clamp-1">{blog.titulo}</h3>
      <div className="h-9 mb-4">
        <p className="text-xs font-light opacity-80 leading-normal line-clamp-2">
          {blog.descripcion ??
            blog.config.find((item) => item.type === "paragraph")?.content}
        </p>
      </div>
      <div
        className="flex justify-between gap-4 w-full"
        title={`${blog.autor.nombre} • ${formatDate(blog.updated_at)}`}
      >
        <div className="flex items-center gap-4 flex-1">
          <img
            className="w-[34px] h-[34px] border border-alto-800/20 dark:border-alto-300/90 rounded-md"
            src={blog.autor.foto ?? DefaultPhoto}
            onError={(event) => {
              event.currentTarget.src = DefaultPhoto;
            }}
          />
          <p className="text-xs line-clamp-1">
            {viewOwns ? "Tú" : blog.autor.nombre} •{" "}
            {formatDate(blog.updated_at)}
          </p>
        </div>
        {viewOwns && (
          <div className="flex gap-4 justify-end">
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
            >
              Editar
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              icon={Icon.Types.TRASH}
              btnType="secondary"
              danger
              btnSize="small"
            />
          </div>
        )}
      </div>
    </article>
  );
};

export default BlogCard;
