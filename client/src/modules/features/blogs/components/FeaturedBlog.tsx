import Icon from "@/modules/core/components/icons/Icon";
import { STORAGE_URL } from "@/modules/core/constants/ENVIRONMENT";
import { useNavigate } from "@tanstack/react-router";
import { Blog } from "../api/responses";
import { BlogsView } from "@/routes/_private/blogs";

interface Props {
  blog: Blog;
  view: BlogsView;
}

const FeaturedBlog = ({ blog, view }: Props) => {
  const navigate = useNavigate();

  return (
    <button
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
      className="min-h-[480px] max-h-[480px] hover:opacity-90 transition-opacity duration-300 ring-primary-200 text-start w-full flex items-end relative isolate rounded-3xl overflow-hidden px-16 max-sm:px-5 pb-10 shadow-md shadow-alto-950/20 dark:shadow-alto-50/10"
    >
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
        </article>
        <div className="text-white min-w-10 h-10">
          <Icon type={Icon.Types.CHEVRON_RIGHT} />
        </div>
      </div>
    </button>
  );
};

export default FeaturedBlog;
