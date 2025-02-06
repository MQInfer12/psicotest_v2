import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import {
  CanvasItem,
  CanvasType,
} from "@/modules/core/components/ui/canvas/types/Canvas";
import Input from "@/modules/core/components/ui/Input";
import InputFile from "@/modules/core/components/ui/InputFile";
import TextArea from "@/modules/core/components/ui/TextArea";
import { toastError, toastSuccess } from "@/modules/core/utils/toasts";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import { v4 } from "uuid";
import { useMeasureContext } from "../../_layout/context/MeasureContext";
import { API_URL, STORAGE_URL } from "@/modules/core/constants/ENVIRONMENT";
import { getTokens } from "../../auth/utils/localStorageToken";
import { useNavigate } from "@tanstack/react-router";
import { Blog } from "../api/responses";
import { BlogsView } from "@/routes/_private/blogs";
import BlogPage from "./BlogPage";
import { useUserContext } from "../../auth/context/UserContext";
import { getTodayUtc } from "@/modules/core/utils/getTodayUtc";

interface Props {
  blog?: Blog;
}

const CreateBlogPage = ({ blog }: Props) => {
  const { user } = useUserContext();
  const { PRIVATE_PADDING_INLINE } = useMeasureContext();
  const navigate = useNavigate();
  const [preview, setPreview] = useState(false);

  const [inputs, setInputs] = useState({
    titulo: blog?.titulo ?? "",
    descripcion: blog?.descripcion ?? "",
  });
  const [img, setImg] = useState<File | null>(null);
  const [config, setConfig] = useState<CanvasType>(blog?.config ?? []);

  const handleSend = async () => {
    if (!inputs.titulo.trim()) {
      return toastError("El título es requerido");
    }
    if (!img && !blog) {
      return toastError("La portada es requerida");
    }
    if (
      !config.some((item) => item.type === "paragraph" && !!item.content.trim())
    ) {
      return toastError("Tiene que haber al menos un párrafo");
    }

    const data = new FormData();
    data.append("titulo", inputs.titulo);
    data.append("descripcion", inputs.descripcion);
    if (img) {
      data.append("portada", img);
    }
    data.append("config", JSON.stringify(config));

    const tokens = getTokens();
    try {
      const response = await fetch(
        API_URL + (blog ? `/blog/${blog.id}?_method=PUT` : "/blog"),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokens?.token}`,
          },
          body: data,
        }
      );
      if (response.ok) {
        const json = await response.json();
        toastSuccess(json.message);
        navigate({
          to: "/blogs",
          search: {
            view: BlogsView.OWN,
          },
        });
      }
    } catch (e) {
      toastError("Error al crear el blog");
    }
  };

  const handleInputs = useCallback((item: CanvasItem) => {
    switch (item.type) {
      case "subtitle":
        return (
          <Input
            required
            type="text"
            label="Subtítulo"
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
            onClick={() => {
              setPreview((prev) => !prev);
            }}
            btnType="tertiary"
            icon={preview ? Icon.Types.PENCIL : Icon.Types.EYE}
          >
            {preview ? "Editar" : "Previsualizar"}
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleSend();
            }}
            btnSize="small"
            icon={Icon.Types.SAVE}
          >
            Guardar
          </Button>
        </div>
      </div>
      {preview ? (
        <BlogPage
          blog={{
            id: 0,
            autor: user!,
            config,
            titulo: inputs.titulo,
            descripcion: inputs.descripcion,
            portada: blog ? blog.portada : img ? URL.createObjectURL(img) : "",
            destacado: false,
            created_at: getTodayUtc(),
            updated_at: getTodayUtc(),
          }}
          preview={!blog}
        />
      ) : (
        <>
          <div className="flex gap-4 w-full min-h-80 max-h-80 mb-4">
            <div className="flex-1 flex flex-col gap-4">
              <Input
                type="text"
                value={inputs.titulo}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, titulo: e.target.value }))
                }
                label="Título"
                required
              />
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
              />
            </div>
            <InputFile
              label="Portada"
              required
              state={img}
              setState={setImg}
              defaultSrc={blog ? STORAGE_URL + blog.portada : undefined}
            />
          </div>
          {config.length > 0 && (
            <AnimatePresence initial={false}>
              <div className="flex flex-col gap-4">
                {config.map((item) => (
                  <motion.div
                    key={item.id}
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
                        />
                        <Button
                          type="button"
                          tabIndex={-1}
                          icon={Icon.Types.CARET_DOWN}
                          btnType="secondary"
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
              <Button
                icon={Icon.Types.FILE}
                subicon={Icon.Types.ADD}
                btnSize="small"
                btnType="secondary"
                type="button"
              >
                Media
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default CreateBlogPage;
