import Loader from "@/modules/core/components/ui/loader/Loader";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { PUBLIC_NAVBAR_HEIGHT } from "@/modules/features/_layout/constants/LAYOUT_SIZES";
import { MeasureContextProvider } from "@/modules/features/_layout/context/MeasureContext";
import BlogPage from "@/modules/features/blogs/pages/BlogPage";
import Footer from "@/modules/features/landing/components/Footer";
import { createFileRoute, Navigate, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/daily/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({
    from: "/_public/daily/$id",
  });
  const { fetchData } = useFetch();
  const { data, isError } = fetchData(
    [
      `GET /blog/:id`,
      {
        id: Number(id),
      },
    ],
    {
      params: {
        count: "true",
      },
    }
  );

  if (isError) return <Navigate to="/daily" />;
  if (!data) return <Loader text="Cargando blog..." />;
  return (
    <MeasureContextProvider>
      <>
        <div
          style={{
            paddingTop: PUBLIC_NAVBAR_HEIGHT + 40,
          }}
        >
          <BlogPage blog={data} />
        </div>
        <Footer secondary />
      </>
    </MeasureContextProvider>
  );
}
