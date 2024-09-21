import Button from "@/modules/core/components/ui/Button";
import { PRIVATE_PADDING_INLINE } from "../../_layout/constants/LAYOUT_SIZES";
import TestCard from "../components/TestCard";
import { useNavigate } from "@tanstack/react-router";
import { CanvasType } from "@/modules/core/components/ui/canvas/types/Canvas";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
const TestPage = () => {
  const { fetchData } = useFetch();
  const { data } = fetchData("GET /test");

  const navigate = useNavigate();
  const navigateToTest = (id: number) => {
    navigate({
      to: "/tests/$id",
      params: {
        id: String(id),
      },
    });
  };

  return (
    <div
      style={{
        paddingInline: PRIVATE_PADDING_INLINE,
      }}
      className="w-full flex flex-col items-center pb-20 gap-12"
    >
      <Button btnType="secondary" onClick={() => {}}>
        Añadir test
      </Button>
      <div
        className="w-full grid gap-8 place-content-center"
        style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(328px, 1fr))`,
        }}
      >
        {data?.map((v) => {
          const canvas: CanvasType = JSON.parse(v.canvas);
          return (
            <TestCard
              key={v.id}
              starred={v.nombre_autor_creador === null}
              title={v.nombre_test}
              description={
                canvas.find((c) => c.type === "paragraph")?.content || ""
              }
              author={v.nombre_autor || v.nombre_autor_creador!}
              psychologist={undefined}
              users={[
                "https://www.purina.es/sites/default/files/styles/ttt_image_510/public/2024-02/sitesdefaultfilesstylessquare_medium_440x440public2022-06Siamese201.jpg?itok=j9A2IvjN",
                "https://www.elmueble.com/medio/2022/06/16/gato-comun-europeo_ead1005b_1000x666.jpg",
                "https://www.lavanguardia.com/files/image_990_484/files/fp/uploads/2022/12/09/6393714e2ee61.r_d.960-640-5156.jpeg",
                "https://www.elmueble.com/medio/2022/06/16/gato-comun-europeo_ead1005b_1000x666.jpg",
                "https://www.lavanguardia.com/files/image_990_484/files/fp/uploads/2022/12/09/6393714e2ee61.r_d.960-640-5156.jpeg",
                "https://www.elmueble.com/medio/2022/06/16/gato-comun-europeo_ead1005b_1000x666.jpg",
                "https://www.lavanguardia.com/files/image_990_484/files/fp/uploads/2022/12/09/6393714e2ee61.r_d.960-640-5156.jpeg",
                "https://www.elmueble.com/medio/2022/06/16/gato-comun-europeo_ead1005b_1000x666.jpg",
                "https://www.purina.es/sites/default/files/styles/ttt_image_510/public/2024-02/sitesdefaultfilesstylessquare_medium_440x440public2022-06Siamese201.jpg?itok=j9A2IvjN",
              ]}
              resolve={() => navigateToTest(v.id)}
              edit={() => {}}
              share={() => {}}
            />
          );
        })}
        {/* <TestCard_MAPI /> */}
      </div>
      {/* <div className="flex gap-16 flex-wrap items-center justify-center">
        <Button onClick={() => navigate({ to: "/tests/mapi" })}>MAPI</Button>
      </div> */}
    </div>
  );
};
export default TestPage;
