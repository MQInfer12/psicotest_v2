import Icon from "@/modules/core/components/icons/Icon";
import IconMessage from "@/modules/core/components/icons/IconMessage";
import Button from "@/modules/core/components/ui/Button";
import { CanvasType } from "@/modules/core/components/ui/canvas/types/Canvas";
import Checkboxes from "@/modules/core/components/ui/Checkboxes";
import Loader from "@/modules/core/components/ui/loader/Loader";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMeasureContext } from "../../_layout/context/MeasureContext";
import { RespuestaEstado } from "../../answers/types/RespuestaEstado";
import { usePermiso } from "../../auth/hooks/usePermiso";
import { Permisos } from "../../auth/types/Permisos";
import { T_Tests, T_Tests_Respuestas } from "../api/responses";
import ShareForm from "../components/ShareForm";
import TestCard from "../components/TestCard";
import { useUpdateTests } from "../hooks/useUpdateTests";
import { isForResolveTests } from "../utils/isForResolve";

interface Props {
  respuestas?: boolean;
}

const TestPage = ({ respuestas = false }: Props) => {
  const { fetchData } = useFetch();
  const { data } = fetchData(
    respuestas ? "GET /respuesta/for/resolve" : "GET /test"
  );
  const [loading, setLoading] = useState<number | null>(null);
  const { modal, setOpen } = useModal();
  const [sharedIds, setSharedIds] = useState<number[]>([]);

  const { PRIVATE_PADDING_INLINE } = useMeasureContext();

  const navigate = useNavigate();
  const navigateToTest = (test: T_Tests | T_Tests_Respuestas) => {
    if (isForResolveTests(test)) {
      setLoading(test.id_respuesta);
      navigate({
        to: "/resolve/$idRespuesta",
        params: {
          idRespuesta: String(test.id_respuesta),
        },
      });
    } else {
      setLoading(test.id);
      navigate({
        to: "/tests/$idTest",
        params: {
          idTest: String(test.id),
        },
      });
    }
  };

  useUpdateTests();

  /* const canAdd = usePermiso([Permisos.CREAR_TEST]); */
  const canEdit = usePermiso([Permisos.EDITAR_TEST]);
  const canShare = usePermiso([Permisos.COMPARTIR_TEST]);

  return (
    <div
      style={{
        paddingInline: PRIVATE_PADDING_INLINE,
      }}
      className="w-full flex flex-col items-center pb-20 gap-12 flex-1 h-full overflow-y-scroll overflow-x-hidden"
    >
      {!respuestas && (
        <div className="w-full flex justify-between">
          <span />
          {/* <div>
            {canAdd && (
              <Button btnType="secondary" onClick={() => {}}>
                Añadir test
              </Button>
            )}
          </div> */}
          <Button
            btnType="secondary"
            btnSize="small"
            onClick={() => setOpen(true)}
            icon={Icon.Types.QR}
          >
            Compartir varios
          </Button>
          {modal(
            "Compartir tests",
            <ShareForm nombreTest="many" idTests={sharedIds}>
              <Checkboxes
                label="Tests"
                value={sharedIds}
                onChange={setSharedIds}
                options={
                  data?.map((test) => {
                    return {
                      label: test.nombre_test,
                      value: test.id,
                    };
                  }) ?? []
                }
              />
            </ShareForm>
          )}
        </div>
      )}
      {data ? (
        data.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <IconMessage
              icon={Icon.Types.BRAIN}
              message="Aún no se te asignó ningún test."
            />
          </div>
        ) : (
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
                  key={isForResolveTests(v) ? v.id_respuesta : v.id}
                  idTest={v.id}
                  layoutId={
                    isForResolveTests(v)
                      ? `respuesta-${v.id_respuesta}`
                      : `test-${v.id}`
                  }
                  starred={v.nombre_autor_creador === null}
                  title={v.nombre_test}
                  description={
                    canvas.find((c) => c.type === "paragraph")?.content || ""
                  }
                  author={v.nombre_autor || v.nombre_autor_creador!}
                  psychologist={
                    isForResolveTests(v) ? v.nombre_asignador : undefined
                  }
                  users={isForResolveTests(v) ? undefined : v.fotos}
                  resolve={() => navigateToTest(v)}
                  edit={!respuestas && canEdit ? () => {} : undefined}
                  share={!respuestas && canShare}
                  loading={
                    isForResolveTests(v)
                      ? loading === v.id_respuesta
                      : loading === v.id
                  }
                  finished={
                    isForResolveTests(v)
                      ? v.estado === RespuestaEstado.ENVIADO
                      : undefined
                  }
                />
              );
            })}
          </div>
        )
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <Loader />
        </div>
      )}
    </div>
  );
};
export default TestPage;
