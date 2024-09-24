import Button from "@/modules/core/components/ui/Button";
import { PRIVATE_PADDING_INLINE } from "../../_layout/constants/LAYOUT_SIZES";
import TestCard from "../components/TestCard";
import { useNavigate } from "@tanstack/react-router";
import { CanvasType } from "@/modules/core/components/ui/canvas/types/Canvas";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import Loader from "@/modules/core/components/ui/loader/Loader";
import { T_Tests } from "../api/responses";
import { useState } from "react";

interface Props {
  respuestas?: boolean;
}

const TestPage = ({ respuestas = false }: Props) => {
  const { fetchData } = useFetch();
  const { data } = fetchData(
    respuestas ? "GET /respuesta/for/resolve" : "GET /test"
  );
  const [loading, setLoading] = useState<number | null>(null);

  const navigate = useNavigate();
  const navigateToTest = (test: T_Tests) => {
    setLoading(respuestas ? test.id_respuesta : test.id);
    if (!respuestas) {
      navigate({
        to: "/tests/$idTest",
        params: {
          idTest: String(test.id),
        },
      });
    } else {
      navigate({
        to: "/resolve/$idRespuesta",
        params: {
          idRespuesta: String(test.id_respuesta),
        },
      });
    }
  };

  return (
    <div
      style={{
        paddingInline: PRIVATE_PADDING_INLINE,
      }}
      className="w-full flex flex-col items-center pb-20 gap-12 flex-1"
    >
      {!respuestas && (
        <Button btnType="secondary" onClick={() => {}}>
          Añadir test
        </Button>
      )}
      {data ? (
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
                idTest={v.id}
                layoutId={
                  !respuestas ? `test-${v.id}` : `respuesta-${v.id_respuesta}`
                }
                starred={v.nombre_autor_creador === null}
                title={v.nombre_test}
                description={
                  canvas.find((c) => c.type === "paragraph")?.content || ""
                }
                author={v.nombre_autor || v.nombre_autor_creador!}
                psychologist={v.nombre_asignador || undefined}
                users={
                  !respuestas
                    ? [
                        "https://www.purina.es/sites/default/files/styles/ttt_image_510/public/2024-02/sitesdefaultfilesstylessquare_medium_440x440public2022-06Siamese201.jpg?itok=j9A2IvjN",
                        "https://www.elmueble.com/medio/2022/06/16/gato-comun-europeo_ead1005b_1000x666.jpg",
                        "https://www.lavanguardia.com/files/image_990_484/files/fp/uploads/2022/12/09/6393714e2ee61.r_d.960-640-5156.jpeg",
                        "https://www.elmueble.com/medio/2022/06/16/gato-comun-europeo_ead1005b_1000x666.jpg",
                        "https://www.lavanguardia.com/files/image_990_484/files/fp/uploads/2022/12/09/6393714e2ee61.r_d.960-640-5156.jpeg",
                        "https://www.elmueble.com/medio/2022/06/16/gato-comun-europeo_ead1005b_1000x666.jpg",
                        "https://www.lavanguardia.com/files/image_990_484/files/fp/uploads/2022/12/09/6393714e2ee61.r_d.960-640-5156.jpeg",
                        "https://www.elmueble.com/medio/2022/06/16/gato-comun-europeo_ead1005b_1000x666.jpg",
                        "https://www.purina.es/sites/default/files/styles/ttt_image_510/public/2024-02/sitesdefaultfilesstylessquare_medium_440x440public2022-06Siamese201.jpg?itok=j9A2IvjN",
                      ]
                    : undefined
                }
                resolve={() => navigateToTest(v)}
                edit={!respuestas ? () => {} : undefined}
                share={!respuestas}
                loading={
                  respuestas ? loading === v.id_respuesta : loading === v.id
                }
                finished={v.estado === "Enviado"}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <Loader />
        </div>
      )}
    </div>
  );
};
export default TestPage;
