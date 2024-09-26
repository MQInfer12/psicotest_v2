import Button from "@/modules/core/components/ui/Button";
import { PRIVATE_PADDING_INLINE } from "../../_layout/constants/LAYOUT_SIZES";
import TestCard from "../components/TestCard";
import { useNavigate } from "@tanstack/react-router";
import { CanvasType } from "@/modules/core/components/ui/canvas/types/Canvas";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import Loader from "@/modules/core/components/ui/loader/Loader";
import { T_Tests } from "../api/responses";
import { useState } from "react";
import { RespuestaEstado } from "../../answers/types/RespuestaEstado";

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
    setLoading(test.id_respuesta ? test.id_respuesta : test.id);
    if (!test.id_respuesta) {
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
                users={v.fotos}
                resolve={() => navigateToTest(v)}
                edit={!respuestas ? () => {} : undefined}
                share={!respuestas}
                loading={
                  respuestas ? loading === v.id_respuesta : loading === v.id
                }
                finished={v.estado === RespuestaEstado.ENVIADO}
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
