import Canvas from "@/modules/core/components/ui/canvas/Canvas";
import { CanvasType } from "@/modules/core/components/ui/canvas/types/Canvas";
import { fetchOptions } from "@/modules/core/hooks/useFetch/utils/fetchFn";
import { useSuspenseQuery } from "@tanstack/react-query";
import { TestType } from "../types/TestType";
import { useParams } from "@tanstack/react-router";

const ResolvePage = () => {
  const { id } = useParams({
    from: "/_private/tests/$id",
  });
  const {
    data: { data },
  } = useSuspenseQuery(
    fetchOptions([
      "GET /test/:id",
      {
        id: Number(id),
      },
    ])
  );

  const canvas: CanvasType = JSON.parse(data.canvas);
  const test: TestType = JSON.parse(data.test);

  return (
    <Canvas>
      <Canvas.Title subtitle={data.nombre_autor || data.nombre_autor_creador!}>
        {data.nombre_test}
      </Canvas.Title>
      {canvas.map((c, i) => {
        switch (c.type) {
          case "subtitle":
            return <Canvas.Subtitle key={i}>{c.content}</Canvas.Subtitle>;
          case "paragraph":
            return <Canvas.Paragraph key={i}>{c.content}</Canvas.Paragraph>;
        }
      })}
      <Canvas.Test test={test} />
    </Canvas>
  );
};

export default ResolvePage;
