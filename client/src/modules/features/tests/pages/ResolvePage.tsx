import Canvas from "@/modules/core/components/ui/canvas/Canvas";
import { CanvasType } from "@/modules/core/components/ui/canvas/types/Canvas";
import { fetchOptions } from "@/modules/core/hooks/useFetch/utils/fetchFn";
import { useSuspenseQuery } from "@tanstack/react-query";
import { TestType } from "../types/TestType";
import { useParams } from "@tanstack/react-router";

const ResolvePage = () => {
  const { idTest, idRespuesta } = useParams({
    strict: false,
  });

  const {
    data: { data },
  } = useSuspenseQuery(
    //@ts-expect-error NO SE QUE DICE EL ERROR
    // TODO: ARREGLAR ESTE ERROR QUITAR EL EXPECT ERROR
    fetchOptions([
      idRespuesta ? "GET /test/by/respuesta/:id" : "GET /test/:id",
      {
        id: Number(idRespuesta || idTest),
      },
    ])
  );

  const canvas: CanvasType = JSON.parse(data.canvas);
  const test: TestType = JSON.parse(data.test);

  return (
    <Canvas layoutId={idTest ? `test-${idTest}` : `respuesta-${idRespuesta}`}>
      <Canvas.Title subtitle={data.nombre_autor || data.nombre_autor_creador!}>
        {data.nombre_test}
      </Canvas.Title>
      {canvas.map((c, i) => {
        switch (c.type) {
          case "subtitle":
            return <Canvas.Subtitle key={i}>{c.content}</Canvas.Subtitle>;
          case "paragraph":
            return <Canvas.Paragraph key={i}>{c.content}</Canvas.Paragraph>;
          case "vignette":
            return (
              <Canvas.Vignette subtitle={c.title} key={i}>
                {c.content}
              </Canvas.Vignette>
            );
        }
      })}
      <Canvas.Test
        data={data}
        test={test}
        idRespuesta={idRespuesta ? Number(idRespuesta) : undefined}
      />
    </Canvas>
  );
};

export default ResolvePage;
