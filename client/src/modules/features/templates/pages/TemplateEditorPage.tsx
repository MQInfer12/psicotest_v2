import Button from "@/modules/core/components/ui/Button";
import { useMeasureContext } from "../../_layout/context/MeasureContext";
import Icon from "@/modules/core/components/icons/Icon";
import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Input from "@/modules/core/components/ui/Input";
import TextArea from "@/modules/core/components/ui/TextArea";
import Checkboxes from "@/modules/core/components/ui/Checkboxes";
import { TemplateItem, TemplateType } from "../types/TemplateType";
import { v4 } from "uuid";
import { TemplateDTOSchema } from "../validations/TemplateDTO.schema";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { toastError, toastSuccess } from "@/modules/core/utils/toasts";
import { useNavigate } from "@tanstack/react-router";
import { IA_Plantilla } from "../api/responses";

interface Props {
  template?: IA_Plantilla;
}

const TemplateEditorPage = ({ template }: Props) => {
  const { PRIVATE_PADDING_INLINE } = useMeasureContext();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<TemplateType>(template?.plantilla ?? []);
  const [inputs, setInputs] = useState({
    nombre: template?.nombre ?? "",
    descripcion: template?.descripcion ?? "",
    idTests: template ? Object.values(template.id_tests) : ([] as number[]),
  });

  const { fetchData, postData } = useFetch();

  const { data: tests } = fetchData("GET /test");

  const postMutation = postData("POST /plantilla");
  const putMutation = postData("PUT /plantilla/:id");

  const navigate = useNavigate();

  const handleSend = () => {
    try {
      const body = TemplateDTOSchema.validateSync({
        nombre: inputs.nombre,
        descripcion: inputs.descripcion,
        plantilla: JSON.stringify(config),
        idTests: inputs.idTests,
      });

      if (
        !config.some(
          (item) => item.type === "paragraph" && !!item.content.trim()
        )
      ) {
        throw new Error("Tiene que haber al menos un párrafo");
      }
      if (!config.every((item) => item.content.trim())) {
        throw new Error("Revisar los campos requeridos");
      }

      if (template) {
        putMutation(body, {
          params: {
            id: template.id,
          },
          onSuccess: (res) => {
            toastSuccess(res.message);
            navigate({
              to: "/templates",
            });
          },
          onSettled: () => {
            setLoading(false);
          },
        });
      } else {
        postMutation(body, {
          onSuccess: (res) => {
            toastSuccess(res.message);
            navigate({
              to: "/templates",
            });
          },
          onSettled: () => {
            setLoading(false);
          },
        });
      }
    } catch (error) {
      const e = error as Error;
      toastError(e.message);
    }
  };

  const handleInputs = useCallback((item: TemplateItem) => {
    switch (item.type) {
      case "title":
        return (
          <Input
            required
            type="text"
            label="Título"
            icon={Icon.Types.BADGE}
            value={item.content}
            onChange={(e) => {
              setConfig((prev) =>
                prev.map((i) =>
                  i.id === item.id ? { ...i, content: e.target.value } : i
                )
              );
            }}
          />
        );
      case "subtitle":
        return (
          <Input
            required
            type="text"
            label="Subtítulo"
            icon={Icon.Types.LABEL}
            value={item.content}
            onChange={(e) => {
              setConfig((prev) =>
                prev.map((i) =>
                  i.id === item.id ? { ...i, content: e.target.value } : i
                )
              );
            }}
          />
        );
      case "paragraph":
        return (
          <TextArea
            required
            label="Párrafo"
            height={78}
            icon={Icon.Types.TEXT}
            value={item.content}
            onChange={(e) => {
              setConfig((prev) =>
                prev.map((i) =>
                  i.id === item.id ? { ...i, content: e.target.value } : i
                )
              );
            }}
          />
        );
      case "vignette":
        return (
          <div className="flex-1 flex gap-4">
            <div>
              <Input
                type="text"
                label="Título de la viñeta"
                icon={Icon.Types.LIST}
                value={item.title}
                onChange={(e) => {
                  setConfig((prev) =>
                    prev.map((i) =>
                      i.id === item.id ? { ...i, title: e.target.value } : i
                    )
                  );
                }}
              />
            </div>
            <div className="flex-1">
              <Input
                required
                type="text"
                label="Contenido de la viñeta"
                value={item.content}
                onChange={(e) => {
                  setConfig((prev) =>
                    prev.map((i) =>
                      i.id === item.id ? { ...i, content: e.target.value } : i
                    )
                  );
                }}
              />
            </div>
          </div>
        );
    }
  }, []);

  return (
    <div
      className="flex h-full flex-col  overflow-scroll isolate"
      style={{
        paddingInline: PRIVATE_PADDING_INLINE,
        paddingBottom: PRIVATE_PADDING_INLINE,
      }}
    >
      <div className="flex gap-4 justify-between items-center sticky top-0 bg-alto-100 dark:bg-alto-950 pb-4 z-10">
        <span />
        <div className="flex gap-4">
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleSend();
            }}
            btnSize="small"
            icon={Icon.Types.SAVE}
            disabled={loading}
          >
            Guardar
          </Button>
        </div>
      </div>
      <motion.div
        layout
        layoutId="blog-editor-header-form"
        className="flex gap-4 w-full mb-4"
      >
        <div className="flex-1 flex flex-col gap-4">
          <Input
            type="text"
            value={inputs.nombre}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, nombre: e.target.value }))
            }
            label="Título"
            required
          />
          <Checkboxes
            options={
              tests?.map((t) => ({
                label: t.nombre_test,
                value: t.id,
              })) ?? [
                {
                  value: 0,
                  label: "Cargando...",
                },
              ]
            }
            label="Tests objetivo (max. 2)"
            value={inputs.idTests}
            onChange={(newIdTests) =>
              setInputs((prev) => ({ ...prev, idTests: newIdTests }))
            }
            disabled={!tests}
            max={2}
            required
          />
        </div>
        <TextArea
          value={inputs.descripcion}
          onChange={(e) =>
            setInputs((prev) => ({
              ...prev,
              descripcion: e.target.value,
            }))
          }
          className="resize-none flex-1"
          containerClassName="flex-1"
          label="Descripción"
          required
        />
      </motion.div>
      {config.length > 0 && (
        <AnimatePresence initial={false}>
          <div className="flex flex-col gap-4">
            {config.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                layoutId={item.id}
                initial={{ y: -80, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex gap-4">
                  {handleInputs(item)}
                  <div className="flex gap-2 pt-6">
                    <Button
                      type="button"
                      tabIndex={-1}
                      icon={Icon.Types.CARET_UP}
                      btnType="secondary"
                      onClick={() => {
                        const index = config.findIndex((i) => i.id === item.id);
                        if (index === 0) return;
                        setConfig((prev) => {
                          const copy = [...prev];
                          const temp = copy[index];
                          copy[index] = copy[index - 1];
                          copy[index - 1] = temp;
                          return copy;
                        });
                      }}
                      disabled={i === 0}
                    />
                    <Button
                      type="button"
                      tabIndex={-1}
                      icon={Icon.Types.CARET_DOWN}
                      btnType="secondary"
                      onClick={() => {
                        const index = config.findIndex((i) => i.id === item.id);
                        if (index === config.length - 1) return;
                        setConfig((prev) => {
                          const copy = [...prev];
                          const temp = copy[index];
                          copy[index] = copy[index + 1];
                          copy[index + 1] = temp;
                          return copy;
                        });
                      }}
                      disabled={i === config.length - 1}
                    />
                    <Button
                      type="button"
                      tabIndex={-1}
                      onClick={() => {
                        setConfig((prev) =>
                          prev.filter((i) => i.id !== item.id)
                        );
                      }}
                      icon={Icon.Types.TRASH}
                      danger
                      btnType="secondary"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
      <motion.div
        layoutId="controles"
        transition={{ duration: 0.3 }}
        className="w-full relative py-4 group mt-4"
      >
        <span className="h-[1px] w-full absolute left-0 top-1/2 -translate-y-1/2 bg-alto-300/80 group-hover:bg-alto-300/80 transition-all duration-100" />
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex gap-4 group-hover:opacity-100 opacity-100 transition-all duration-100">
          <Button
            icon={Icon.Types.BADGE}
            subicon={Icon.Types.ADD}
            btnSize="small"
            btnType="secondary"
            type="button"
            onClick={() => {
              setConfig((prev) => [
                ...prev,
                {
                  id: v4(),
                  type: "title",
                  content: "",
                },
              ]);
            }}
          >
            Título
          </Button>
          <Button
            icon={Icon.Types.LABEL}
            subicon={Icon.Types.ADD}
            btnSize="small"
            btnType="secondary"
            type="button"
            onClick={() => {
              setConfig((prev) => [
                ...prev,
                {
                  id: v4(),
                  type: "subtitle",
                  content: "",
                },
              ]);
            }}
          >
            Subtítulo
          </Button>
          <Button
            icon={Icon.Types.TEXT}
            subicon={Icon.Types.ADD}
            btnSize="small"
            btnType="secondary"
            type="button"
            onClick={() => {
              setConfig((prev) => [
                ...prev,
                {
                  id: v4(),
                  type: "paragraph",
                  content: "",
                },
              ]);
            }}
          >
            Párrafo
          </Button>
          <Button
            icon={Icon.Types.LIST}
            subicon={Icon.Types.ADD}
            btnSize="small"
            btnType="secondary"
            type="button"
            onClick={() => {
              setConfig((prev) => [
                ...prev,
                {
                  id: v4(),
                  type: "vignette",
                  title: "",
                  content: "",
                },
              ]);
            }}
          >
            Viñeta
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default TemplateEditorPage;
