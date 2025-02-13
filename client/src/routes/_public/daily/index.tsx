import { PUBLIC_NAVBAR_HEIGHT } from "@/modules/features/_layout/constants/LAYOUT_SIZES";
import { MeasureContextProvider } from "@/modules/features/_layout/context/MeasureContext";
import BlogsPage from "@/modules/features/blogs/pages/BlogsPage";
import Footer from "@/modules/features/landing/components/Footer";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/daily/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <MeasureContextProvider>
      <>
        <div
          style={{
            paddingTop: PUBLIC_NAVBAR_HEIGHT + 40,
          }}
        >
          <BlogsPage />
        </div>
        <Footer secondary />
      </>
    </MeasureContextProvider>
  );
}
