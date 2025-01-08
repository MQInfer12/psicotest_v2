import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { Appointment, Schedule } from "../api/responses";
import { calcularTiempo } from "../utils/calcularTiempo";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toasts";
import { useUserContext } from "../../auth/context/UserContext";
import DefaultPhoto from "@/assets/images/defaultPhoto.jpg";
import { stringFromDate } from "../utils/stringFromDate";
import dayjs from "dayjs";
import { getTokens } from "../../auth/utils/localStorageToken";
import { SetData } from "@/modules/core/hooks/useFetch/getSetData";
import clsx from "clsx";
import Button from "@/modules/core/components/ui/Button";
import Icon from "@/modules/core/components/icons/Icon";
import { useState } from "react";

interface Props {
  horario: Schedule;
  fecha: string;
  estado?: "accepted" | "declined" | "needsAction" | null;
  esCita?: boolean;
  setData?: SetData<Appointment[]>;
  link?: string;
}

const ScheduleCard = ({
  horario,
  fecha,
  estado,
  esCita,
  setData,
  link,
}: Props) => {
  const { user, setUser } = useUserContext();
  const { postData } = useFetch();
  const mutation = postData("POST /cita");
  const patchMutation = postData("PATCH /cita/respuesta/:id");
  const [patched, setPatched] = useState(false);
  const [loading, setLoading] = useState(false);

  const hora_inicio = horario.hora_inicio.slice(0, 5);
  const hora_final = horario.hora_final.slice(0, 5);

  const handleRequestAppointment = () => {
    const { date, day, month } = stringFromDate(dayjs(fecha));
    toastConfirm(
      `¿Quieres solicitar una cita el día ${day.toLocaleLowerCase()}, ${date} de ${month} a las ${hora_inicio}?`,
      () => {
        const tokens = getTokens();
        if (!tokens) return;
        setLoading(true);
        mutation(
          {
            id_horario: horario.id,
            fecha,
            access_token: tokens.access_token,
          },
          {
            onSuccess: (res) => {
              toastSuccess("Cita solicitada con éxito");
              setUser(res.data);
            },
            onSettled() {
              setLoading(false);
            },
          }
        );
      }
    );
  };

  const handleRespuesta = (estado: "accepted" | "declined") => {
    if (!setData) return;
    patchMutation(
      {
        access_token: getTokens()?.access_token ?? "",
        estado: "accepted",
      },
      {
        params: {
          id: horario.id,
        },
        onSuccess: (res) => {
          toastSuccess(
            {
              accepted: "Cita aceptada con éxito",
              declined: "Cita rechazada con éxito",
            }[estado]
          );
          setPatched(true);
          setData((prev) =>
            prev.map((cita) => (cita.id === res.data.id ? res.data : cita))
          );
        },
      }
    );
  };

  return (
    <div
      onClick={esCita ? () => {} : handleRequestAppointment}
      className={clsx(
        "flex flex-wrap items-center justify-between gap-10 bg-alto-50 dark:bg-alto-1000 px-4 py-2 border border-alto-300/70 dark:border-alto-800 rounded-md shadow-md transition-all duration-300",
        {
          "cursor-pointer hover:shadow-primary-200 dark:hover:shadow-primary-800/20 hover:-translate-y-1":
            !esCita,
          "cursor-default": esCita,
        }
      )}
    >
      <div className="flex-1 flex items-center h-full gap-8 overflow-hidden max-lg:gap-5">
        <div className="flex flex-col w-12">
          <strong className="text-xl text-primary-900 dark:text-primary-400">
            {hora_inicio}
          </strong>
          <small className="text-alto-500 dark:text-alto-400">
            ~ {hora_final}
          </small>
        </div>
        <span className="h-[80%] w-1 rounded-full bg-primary-400" />
        <div className="flex-1 justify-end overflow-hidden flex items-center flex-wrap gap-2">
          <div className="flex-1 flex items-center gap-4 overflow-hidden min-w-52">
            <img
              className="h-10 w-10 object-cover rounded-md border-2 border-primary-200"
              src={horario.foto_user ?? DefaultPhoto}
              onError={(event) => {
                event.currentTarget.src = DefaultPhoto;
              }}
            />
            <div className="flex flex-col gap-1 items-start overflow-hidden">
              <small className="text-alto-500 dark:text-alto-400 text-xs whitespace-nowrap overflow-hidden text-ellipsis w-full">
                {calcularTiempo(hora_inicio, hora_final)} apróx. con:
              </small>
              <p className="font-medium text-start whitespace-nowrap overflow-hidden text-ellipsis w-full max-md:text-xs text-alto-950 dark:text-alto-50">
                {horario.nombre_user}
              </p>
            </div>
          </div>
          {esCita && (
            <div className="flex gap-2 items-center">
              <Button
                btnType="secondary"
                btnSize="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRespuesta("accepted");
                }}
                disabled={loading || estado === "accepted"}
                title="Aceptar la cita en el calendario"
                icon={
                  estado === "accepted"
                    ? patched
                      ? Icon.Types.CHECK_ANIMATED
                      : Icon.Types.CHECK
                    : undefined
                }
              >
                {estado === "accepted" ? "" : "Aceptar"}
              </Button>
              <Button
                btnType="secondary"
                btnSize="small"
                icon={Icon.Types.GOOGLE_CALENDAR}
                title="Ver en mi calendario de Google"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(link + `&authuser=${user?.email}`, "_blank");
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;
