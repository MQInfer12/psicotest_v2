import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useMeasureContext } from "../../_layout/context/MeasureContext";
import { usePermiso } from "../../auth/hooks/usePermiso";
import { Permisos } from "../../auth/types/Permisos";
import BlogCard from "../components/BlogCard";
import FeaturedBlog from "../components/FeaturedBlog";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { BlogsView } from "@/routes/_private/blogs";

const BlogsPage = () => {
  const { PRIVATE_PADDING_INLINE } = useMeasureContext();
  const navigate = useNavigate();
  const { fetchData } = useFetch();

  const { view = BlogsView.ALL } = useSearch({
    from: "/_private/blogs/",
  });

  const canCreate = usePermiso([Permisos.CREAR_BLOGS]);

  const { data } = fetchData("GET /blog");
  const { data: ownData } = fetchData("GET /blog/for/me", {
    queryOptions: {
      //@ts-expect-error: enabled should be a valid option
      enabled: canCreate,
    },
  });

  const viewOwns = view === BlogsView.OWN;
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
      className="flex flex-col gap-8 h-full overflow-scroll"
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
              onClick={() =>
                navigate({
                  to: "/blogs/create",
                  search: {
                    view,
                  },
                })
              }
              btnSize="small"
              icon={Icon.Types.ADD}
            >
              Crear blog
            </Button>
          </div>
        </div>
      )}
      {!viewOwns && destacado && <FeaturedBlog blog={destacado} view={view} />}
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
            <BlogCard key={b.id} blog={b} viewOwns={viewOwns} view={view} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
