import Icon from "@/modules/core/components/icons/Icon";
import { STORAGE_URL } from "@/modules/core/constants/ENVIRONMENT";
import { useNavigate } from "@tanstack/react-router";
import { Blog } from "../api/responses";
import { BlogsView } from "@/routes/_private/blogs";
import { usePermiso } from "../../auth/hooks/usePermiso";
import { Permisos } from "../../auth/types/Permisos";
import { useUserContext } from "../../auth/context/UserContext";
import clsx from "clsx";
import DefaultPhoto from "@/assets/images/defaultPhoto.jpg";

interface Props {
  blog: Blog;
  view: BlogsView;
  handleStandout: (blog: Blog) => void;
}

const FeaturedBlog = ({ blog, view, handleStandout }: Props) => {
  const { state } = useUserContext();
  const isUnlogged = state === "unlogged";

  const navigate = useNavigate();

  const canStandout = usePermiso([Permisos.DESTACAR_BLOGS]);

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
      className="group cursor-pointer min-h-[480px] max-h-[480px] hover:opacity-90 transition-opacity duration-300 ring-primary-200 text-start w-full flex items-end relative isolate rounded-3xl overflow-hidden px-16 max-sm:px-5 pb-10 shadow-md shadow-alto-950/20 dark:shadow-alto-50/10"
    >
      {canStandout && (
        <button
          title="Quitar destacado"
          className="absolute top-10 right-16 text-white hover:opacity-80 w-8 h-8"
          onClick={(e) => {
            e.stopPropagation();
            handleStandout(blog);
          }}
        >
          <Icon type={Icon.Types.STAR} />
        </button>
      )}
      <div className="absolute -z-10 inset-0">
        <div className="relative h-full w-full isolate">
          <img
            src={STORAGE_URL + blog.portada}
            className="w-full h-full object-cover"
          />
          <span className="h-[100%] w-full absolute bottom-0 left-0 bg-gradient-to-b from-transparent to-primary-1000/80" />
        </div>
      </div>
      <div className="w-full flex justify-between items-end overflow-hidden gap-10">
        <article className="flex flex-col text-white gap-4 w-[800px] max-w-full">
          <small className="opacity-80">Destacado</small>
          <h3 className="text-3xl font-medium max-sm:text-xl">{blog.titulo}</h3>
          <p className="font-light text-sm opacity-80 line-clamp-3">
            {blog.descripcion}
          </p>
          {blog.evento && (
            <div className="flex">
              {blog.asistencias
                .filter((_, i) => i < 8)
                .map((u, i) => (
                  <div
                    key={u.id}
                    className={clsx(
                      "w-7 aspect-square rounded-full overflow-hidden border-2 border-white dark:border-alto-400",
                      {
                        "-ml-4": i > 0,
                      }
                    )}
                  >
                    <img
                      className="w-full h-full bg-alto-50"
                      src={u.foto_user ?? DefaultPhoto}
                      onError={(event) => {
                        event.currentTarget.src = DefaultPhoto;
                      }}
                    />
                  </div>
                ))}
              <div
                className={clsx(
                  "w-7 aspect-square rounded-full overflow-hidden border-2 border-white bg-alto-100 text-alto-800 p-2",
                  {
                    "-ml-4": blog.asistencias.length > 0,
                  }
                )}
              >
                <Icon type={Icon.Types.DOTS} />
              </div>
            </div>
          )}
        </article>
        <div className="text-white min-w-10 h-10 group-hover:opacity-100 opacity-0 transition-opacity duration-300">
          <Icon type={Icon.Types.CHEVRON_RIGHT} />
        </div>
      </div>
    </article>
  );
};

export default FeaturedBlog;
