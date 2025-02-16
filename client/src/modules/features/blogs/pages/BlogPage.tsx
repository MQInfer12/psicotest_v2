import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import Canvas from "@/modules/core/components/ui/canvas/Canvas";
import { STORAGE_URL } from "@/modules/core/constants/ENVIRONMENT";
import { formatDate } from "@/modules/core/utils/formatDate";
import dayjs from "dayjs";
import { DAYS } from "../../calendar/data/days";
import { Blog } from "../api/responses";
import clsx from "clsx";
import DefaultPhoto from "@/assets/images/defaultPhoto.jpg";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toasts";
import { useUserContext } from "../../auth/context/UserContext";
import { useRef, useState } from "react";
import { validateRoute } from "../../_layout/components/breadcrumb/utils/validateRoute";

interface Props {
  blog: Blog;
  onSuccessAssist?: (newBlog: Blog) => void;
  preview?: boolean;
}

const BlogPage = ({ blog, preview, onSuccessAssist }: Props) => {
  const fechaActual = blog.evento ? dayjs(blog.evento.fecha) : null;
  const diaActual = fechaActual ? DAYS[fechaActual.day()] : null;

  const { postData } = useFetch();
  const patchMutation = postData("PATCH /blog/attend/:id");
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);

  const { user } = useUserContext();
  const im_assisting = blog.asistencias.find(
    (a) => a.email_user === user?.email
  );

  const assist = () => {
    setLoading(true);
    if (!loadingRef.current) {
      loadingRef.current = true;
      patchMutation(null, {
        params: {
          id: blog.id,
        },
        onSuccess: (res) => {
          toastSuccess(res.message);
          onSuccessAssist?.(res.data);
        },
        onSettled: () => {
          setLoading(false);
          loadingRef.current = false;
        },
      });
    }
  };

  const handleAssist = () => {
    if (im_assisting) {
      toastConfirm("¿Quieres dejar de asistir al evento?", assist);
    } else {
      assist();
    }
  };

  const shareLink =
    window.location.protocol +
    "//" +
    window.location.host +
    validateRoute("/daily/$id", { id: String(blog.id) });

  return (
    <Canvas type="blog" withFooter shareLink={shareLink}>
      <Canvas.Title
        photoSrc={blog.autor.foto}
        subtitle={`${blog.autor.nombre} • ${formatDate(blog.updated_at)}`}
        coverSrc={preview ? blog.portada : STORAGE_URL + blog.portada}
        description={blog.descripcion}
        showCover
        coverJsx={
          blog.evento && (
            <div className="w-full flex justify-end z-10 p-6">
              <article className="min-w-[270px] max-w-80 overflow-hidden bg-alto-50/70 dark:bg-alto-1000/40 text-alto-950 dark:text-alto-50 border-alto-50/30 border backdrop-blur-md flex flex-col px-2 py-2 rounded-md gap-2">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="dark:bg-primary-200 bg-primary-700 h-10 aspect-square flex flex-col items-center justify-center rounded-md">
                    <small className="text-[10px] font-medium opacity-60 dark:text-alto-950 text-alto-50">
                      {diaActual?.abrev.toUpperCase()}
                    </small>
                    <p className="font-bold dark:text-primary-900 text-primary-100 -mt-1">
                      {fechaActual?.format("D")}
                    </p>
                  </div>
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <strong
                      title={blog.evento.nombre}
                      className="text-xs whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                      {blog.evento.nombre}
                    </strong>
                    <small
                      title={blog.evento.direccion}
                      className="text-[10px] opacity-80 whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                      {blog.evento.direccion}
                    </small>
                  </div>
                  <div className="self-start">
                    <strong className="text-xs">
                      {blog.evento.fecha.split("T")[1].slice(0, 5)}
                    </strong>
                  </div>
                </div>
                <div className="flex self-end items-center gap-3">
                  <div className="flex">
                    {blog.asistencias
                      .filter((_, i) => i < 8)
                      .map((u, i) => (
                        <div
                          key={u.id}
                          className={clsx(
                            "w-7 aspect-square rounded-full overflow-hidden border-2 border-white dark:border-alto-400",
                            {
                              "-ml-4": i > 0,
                            }
                          )}
                        >
                          <img
                            className="w-full h-full bg-alto-50"
                            src={u.foto_user ?? DefaultPhoto}
                            onError={(event) => {
                              event.currentTarget.src = DefaultPhoto;
                            }}
                          />
                        </div>
                      ))}
                    <button
                      className={clsx(
                        "w-7 aspect-square rounded-full overflow-hidden border-2 border-white bg-alto-100 text-alto-800 p-2 hover:bg-alto-300 transition-all duration-300",
                        {
                          "-ml-4": blog.asistencias.length > 0,
                        }
                      )}
                    >
                      <Icon type={Icon.Types.DOTS} />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {im_assisting && (
                      <Button
                        textClassname="text-start"
                        btnSize="small"
                        btnType="secondary"
                        danger
                        icon={Icon.Types.GOOGLE_CALENDAR}
                        disabled={preview}
                        onClick={() => {
                          window.open(
                            im_assisting.link_calendar +
                              `&authuser=${user?.email}`,
                            "_blank"
                          );
                        }}
                      />
                    )}
                    <Button
                      textClassname="text-start"
                      btnSize="small"
                      icon={
                        im_assisting
                          ? Icon.Types.CANCEL
                          : Icon.Types.GOOGLE_CALENDAR
                      }
                      danger={!!im_assisting}
                      disabled={preview || loading}
                      onClick={handleAssist}
                      btnType={im_assisting ? "tertiary" : "primary"}
                    >
                      {im_assisting ? "" : "Asistir"}
                    </Button>
                  </div>
                </div>
              </article>
            </div>
          )
        }
      >
        {blog.titulo}
      </Canvas.Title>
      {blog.config.map((item, i) => {
        switch (item.type) {
          case "paragraph":
            return <Canvas.Paragraph key={i}>{item.content}</Canvas.Paragraph>;
          case "subtitle":
            return <Canvas.Subtitle key={i}>{item.content}</Canvas.Subtitle>;
          case "vignette":
            return (
              <Canvas.Vignette key={i} subtitle={item.title}>
                {item.content}
              </Canvas.Vignette>
            );
          case "image":
            return (
              <Canvas.Image
                key={i}
                src={preview ? item.src : STORAGE_URL + item.src}
                alt={item.title}
                description={item.description}
              />
            );
          case "pdf":
            return (
              <Canvas.Pdf
                key={i}
                src={preview ? item.src : STORAGE_URL + item.src}
              />
            );
        }
      })}
      {/* <Canvas.Image
        src={Stock1}
        alt="Hola"
        description="Hola, Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, eos non
        optio eligendi similique repudiandae ipsa voluptas. Incidunt rem
        repudiandae eligendi debitis fuga labore illum odio ut veniam architecto
        quasi enim"
      />
      <Canvas.Pdf src={"http://localhost:8000/storage/BULIMIA.pdf"} /> */}
    </Canvas>
  );
};

export default BlogPage;
