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
import { EventDTO } from "../validations/EventDTO.schema";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import EventForm from "../components/EventForm";

interface Props {
  blog?: Blog;
}

const CreateBlogPage = ({ blog }: Props) => {
  const { user } = useUserContext();
  const { PRIVATE_PADDING_INLINE } = useMeasureContext();
  const navigate = useNavigate();
  const [preview, setPreview] = useState(false);

  const [loading, setLoading] = useState(false);

  const [inputs, setInputs] = useState({
    titulo: blog?.titulo ?? "",
    descripcion: blog?.descripcion ?? "",
  });
  const [img, setImg] = useState<File | null>(null);
  const [config, setConfig] = useState<CanvasType>(blog?.config ?? []);
  const [files, setFiles] = useState<Record<string, File | null>>({});

  const [event, setEvent] = useState<EventDTO | null>(
    blog?.evento
      ? {
          nombre: blog.evento.nombre,
          fecha: blog.evento.fecha.split("T")[0],
          hora: blog.evento.fecha.split("T")[1].slice(0, 5),
          latitud: blog.evento.latitud,
          longitud: blog.evento.longitud,
        }
      : null
  );
  const { modal, setOpen } = useModal();

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
    if (
      !config.every(
        (item) =>
          item.type === "image" || item.type === "pdf" || !!item.content.trim()
      )
    ) {
      return toastError("Revisar los campos requeridos");
    }
    if (
      !config.every(
        (item) =>
          item.type !== "image" ||
          ((item.src || files[item.id]) && item.title.trim())
      )
    ) {
      return toastError("Revisar las imágenes y sus títulos");
    }
    if (
      !config.every((item) => item.type !== "pdf" || item.src || files[item.id])
    ) {
      return toastError("Revisar los PDFs");
    }

    setLoading(true);

    const data = new FormData();
    data.append("titulo", inputs.titulo);
    data.append("descripcion", inputs.descripcion);
    if (img) {
      data.append("portada", img);
    }
    data.append("config", JSON.stringify(config));

    Object.keys(files).forEach((key) => {
      if (files[key]) {
        data.append(key, files[key]!);
      }
    });

    if (event) {
      data.append("evento", JSON.stringify(event));
    }

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
    } finally {
      setLoading(false);
    }
  };

  const handleInputs = useCallback(
    (item: CanvasItem) => {
      switch (item.type) {
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
              <div className="flex-1 max-w-64">
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
        case "image":
          return (
            <div className="flex w-full flex-col gap-4">
              <div className="flex gap-4">
                <div className="flex-1 max-w-64">
                  <Input
                    required
                    type="text"
                    label="Título de la imagen"
                    icon={Icon.Types.IMAGE}
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
                    type="text"
                    label="Contenido de la imagen"
                    value={item.description}
                    onChange={(e) => {
                      setConfig((prev) =>
                        prev.map((i) =>
                          i.id === item.id
                            ? { ...i, description: e.target.value }
                            : i
                        )
                      );
                    }}
                  />
                </div>
              </div>
              <InputFile
                label="Imagen"
                accept=".png,.jpg,.jpeg"
                state={files[item.id] ?? null}
                setstate={(file) => {
                  setFiles((prev) => ({ ...prev, [item.id]: file }));
                }}
                defaultsrc={
                  blog
                    ? item.src
                      ? STORAGE_URL + item.src
                      : undefined
                    : undefined
                }
                row
                required
                maxsize={5 * 1024}
              />
            </div>
          );
        case "pdf":
          return (
            <InputFile
              label="Documento PDF"
              accept=".pdf"
              state={files[item.id] ?? null}
              setstate={(file) => {
                setFiles((prev) => ({ ...prev, [item.id]: file }));
              }}
              defaultsrc={
                blog
                  ? item.src
                    ? STORAGE_URL + item.src
                    : undefined
                  : undefined
              }
              inputType="inline"
              required
              maxsize={5 * 1024}
              icon={Icon.Types.FILE}
            />
          );
      }
    },
    [files]
  );

  return (
    <>
      {modal(
        "Formulario de evento",
        <EventForm
          event={event ?? { nombre: inputs.titulo }}
          onSuccess={(form) => {
            setEvent(form);
            setOpen(false);
          }}
          onDelete={() => {
            setEvent(null);
            setOpen(false);
          }}
        />,
        {
          width: 640,
        }
      )}
      <div
        className="flex h-full flex-col  overflow-scroll isolate"
        style={{
          paddingInline: PRIVATE_PADDING_INLINE,
          paddingBottom: PRIVATE_PADDING_INLINE,
        }}
      >
        <div className="flex gap-4 justify-between items-center sticky top-0 bg-alto-100 dark:bg-alto-950 pb-4 z-10 flex-wrap-reverse">
          <div className="flex gap-4 items-center">
            <Button
              onClick={() => {
                setOpen(true);
              }}
              btnType="secondary"
              icon={Icon.Types.GOOGLE_CALENDAR}
              btnSize="small"
              primary={!!event}
              textClassname="max-sm:max-w-[100px]"
            >
              {event ? event.nombre : "Añadir evento"}
            </Button>
          </div>
          <div className="flex gap-4 flex-1 justify-end">
            <Button
              onClick={() => {
                setPreview((prev) => !prev);
              }}
              btnSize="small"
              btnType="tertiary"
              icon={preview ? Icon.Types.PENCIL : Icon.Types.EYE}
              textClassname="max-sm:hidden"
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
              disabled={loading}
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
              config: config.map((item) => {
                if (item.type === "image" || item.type === "pdf") {
                  return {
                    ...item,
                    src: files[item.id]
                      ? URL.createObjectURL(files[item.id]!)
                      : STORAGE_URL + item.src,
                  };
                }
                return item;
              }),
              titulo: inputs.titulo || "-",
              descripcion: inputs.descripcion,
              portada: img
                ? URL.createObjectURL(img)
                : blog
                ? STORAGE_URL + blog.portada
                : "",
              destacado: false,
              evento: event
                ? {
                    id: 0,
                    nombre: event.nombre,
                    fecha: `${event.fecha}T${event.hora}`,
                    direccion: "(Lugar generado automáticamente)",
                    latitud: event.latitud,
                    longitud: event.longitud,
                  }
                : null,
              asistencias: [],
              created_at: getTodayUtc(),
              updated_at: getTodayUtc(),
            }}
            preview
          />
        ) : (
          <>
            <motion.div
              layout
              layoutId="blog-editor-header-form"
              className="flex gap-4 w-full min-h-80 max-h-80 max-sm:max-h-[480px] max-sm:min-h-[480px] mb-4 max-sm:flex-col"
            >
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
                accept=".png,.jpg,.jpeg"
                label="Portada"
                required
                state={img}
                setstate={(file) => {
                  setImg(file);
                }}
                defaultsrc={blog ? STORAGE_URL + blog.portada : undefined}
                maxsize={5 * 1024}
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
                      <div className="flex gap-4 max-sm:flex-col max-sm:gap-2">
                        {handleInputs(item)}
                        <div className="flex gap-2 pt-6 max-sm:pt-0 max-sm:self-end">
                          <Button
                            type="button"
                            tabIndex={-1}
                            icon={Icon.Types.CARET_UP}
                            btnType="secondary"
                            onClick={() => {
                              const index = config.findIndex(
                                (i) => i.id === item.id
                              );
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
                              const index = config.findIndex(
                                (i) => i.id === item.id
                              );
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
                              setFiles((prev) => {
                                const copy = { ...prev };
                                delete copy[item.id ?? "-"];
                                return copy;
                              });
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
                  textClassname="max-sm:hidden"
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
                  textClassname="max-sm:hidden"
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
                  textClassname="max-sm:hidden"
                >
                  Viñeta
                </Button>
                <Button
                  icon={Icon.Types.IMAGE}
                  subicon={Icon.Types.ADD}
                  btnSize="small"
                  btnType="secondary"
                  type="button"
                  textClassname="max-sm:hidden"
                  onClick={() => {
                    setConfig((prev) => [
                      ...prev,
                      {
                        id: v4(),
                        type: "image",
                        src: "",
                        title: "",
                        description: "",
                      },
                    ]);
                  }}
                >
                  Imagen
                </Button>
                <Button
                  icon={Icon.Types.FILE}
                  subicon={Icon.Types.ADD}
                  btnSize="small"
                  btnType="secondary"
                  type="button"
                  textClassname="max-sm:hidden"
                  onClick={() => {
                    setConfig((prev) => [
                      ...prev,
                      {
                        id: v4(),
                        type: "pdf",
                        src: "",
                      },
                    ]);
                  }}
                >
                  PDF
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </>
  );
};

export default CreateBlogPage;
