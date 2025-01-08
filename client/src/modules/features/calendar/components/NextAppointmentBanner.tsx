import Icon from "@/modules/core/components/icons/Icon";
import IconMessage from "@/modules/core/components/icons/IconMessage";
import Button from "@/modules/core/components/ui/Button";
import { useUserContext } from "../../auth/context/UserContext";
import { stringFromDate } from "../utils/stringFromDate";
import dayjs from "dayjs";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import {
  toastConfirm,
  toastError,
  toastSuccess,
} from "@/modules/core/utils/toasts";
import { getTokens } from "../../auth/utils/localStorageToken";
import { useEffect, useState } from "react";
import DefaultPhoto from "@/assets/images/defaultPhoto.jpg";
import clsx from "clsx";

const getIsCurrent = (fecha_cita: string, hora_cita: string) => {
  const appointmentHour = dayjs(fecha_cita + "T" + hora_cita);
  const currentHour = dayjs();
  return currentHour.isAfter(appointmentHour, "second");
};

const NextAppointmentBanner = () => {
  const { user, setUser } = useUserContext();
  const { fetchData, postData } = useFetch();
  const cancelMutation = postData("PUT /cita/destroy/:id");
  const { data } = fetchData("GET /cita/respuesta/status", {
    params: {
      access_token: getTokens()?.access_token ?? "",
      id_calendar: user?.cita_proxima?.id_calendar ?? "",
    },
  });

  const [loading, setLoading] = useState(false);

  const cita_proxima = user?.cita_proxima!;
  const { day, date, month } = stringFromDate(dayjs(cita_proxima.fecha));
  const hora_inicio = cita_proxima.hora_inicio.slice(0, 5);
  const hora_final = cita_proxima.hora_final.slice(0, 5);

  const [isCurrent, setIsCurrent] = useState(
    getIsCurrent(cita_proxima.fecha, hora_inicio)
  );
  const [hasPassed, setHasPassed] = useState(
    getIsCurrent(cita_proxima.fecha, hora_final)
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setIsCurrent(getIsCurrent(cita_proxima.fecha, hora_inicio));
      setHasPassed(getIsCurrent(cita_proxima.fecha, hora_final));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleCancelAppointment = () => {
    toastConfirm("¿Estás seguro de cancelar tu cita?", () => {
      if (loading) {
        toastError("No puedes cancelar la cita en este momento");
      }
      const tokens = getTokens();
      if (!tokens) return;
      setLoading(true);
      cancelMutation(
        {
          access_token: tokens.access_token,
        },
        {
          params: {
            id: cita_proxima.id,
          },
          onSuccess(res) {
            toastSuccess(res.message);
            setUser(res.data);
          },
          onSettled() {
            setLoading(false);
          },
        }
      );
    });
  };

  console.log(data);

  return (
    <section className="flex flex-col gap-6 flex-1 overflow-hidden w-full">
      <header className="h-10 flex items-center">
        <strong className="text-primary-900 dark:text-primary-400">
          Cita programada
        </strong>
      </header>
      <div className="flex-1 flex flex-col gap-8 items-center justify-center">
        <IconMessage
          key={JSON.stringify(hasPassed)}
          textColor={hasPassed ? "success" : "primary"}
          icon={hasPassed ? Icon.Types.CHECK : Icon.Types.CALENDAR}
          message={
            hasPassed
              ? "Tu cita ha finalizado"
              : isCurrent
                ? "¡Actualmente en cita!"
                : "¡Tienes una cita!"
          }
        >
          {!hasPassed && (
            <p className="font-bold text-alto-950 dark:text-alto-50">
              {cita_proxima.nombre_psicologo}
            </p>
          )}
          {hasPassed ? (
            <div className="flex flex-col items-center gap-4 max-w-80">
              <small className="text-alto-600 dark:text-alto-400 [&>span]:text-primary-400 text-center text-balance">
                Muchas gracias por ser parte del gabinete psicológico,
                ¡esperamos que te sientas mejor y podamos verte pronto
                nuevamente!
              </small>
            </div>
          ) : isCurrent ? (
            <div className="flex flex-col items-center gap-4 max-w-80">
              <small className="text-alto-600 dark:text-alto-400 [&>span]:text-primary-400 text-center text-balance">
                Desde las <span>{hora_inicio}</span> hasta las{" "}
                <span>{hora_final}</span>
              </small>
              <small className="text-alto-600 dark:text-alto-400 [&>span]:text-primary-400 text-center text-balance leading-relaxed">
                Por favor responde con sinceridad todo lo que el psicólogo te
                pregunte, recuerda que es para tu bienestar.
              </small>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 max-w-80">
              <small className="text-alto-600 dark:text-alto-400 [&>span]:text-primary-400 text-center text-balance">
                <span>{day}</span>, {date} de {month} a las {hora_inicio}
              </small>
              <small className="text-alto-600 dark:text-alto-400 [&>span]:text-primary-400 text-center text-balance leading-relaxed">
                Creamos un evento en tu calendario para hacerte recuerdo una
                hora antes de tu cita.
              </small>
              <div className="flex flex-col items-center gap-4">
                <small className="text-alto-600 dark:text-alto-400 [&>span]:text-primary-400 text-center text-balance leading-relaxed">
                  Google te enviará un correo cuando tu psicólogo acepte tu
                  invitación.
                </small>
                <div className="flex items-center gap-4">
                  <img
                    className="w-10 h-10 rounded-md border-2 bg-alto-100 border-alto-200 dark:border-alto-600"
                    src={cita_proxima.foto_psicologo || DefaultPhoto}
                    onError={(event) => {
                      event.currentTarget.src = DefaultPhoto;
                    }}
                  />
                  <span
                    className={clsx(
                      "w-28 flex justify-center text-xs px-4 py-1 rounded-md border transition-colors duration-500",
                      {
                        "bg-alto-700/10 text-alto-700 border-alto-700/40 dark:bg-alto-400/10 dark:text-alto-400 dark:border-alto-400/40":
                          data === "needsAction" || !data,
                        "bg-success/10 text-success border-success/40":
                          data === "accepted",
                        "bg-danger/10 text-danger border-danger/40":
                          data === "declined",
                      }
                    )}
                  >
                    {!data
                      ? "..."
                      : {
                          needsAction: "Pendiente",
                          accepted: "Aceptada",
                          declined: "Rechazada",
                        }[data]}
                  </span>
                </div>
              </div>
            </div>
          )}
        </IconMessage>
        {hasPassed && (
          <Button
            onClick={() =>
              setUser((prev) => (prev ? { ...prev, cita_proxima: null } : prev))
            }
          >
            Regresar
          </Button>
        )}
        {!isCurrent && (
          <div className="flex gap-4">
            <Button
              btnType="secondary"
              icon={Icon.Types.GOOGLE_CALENDAR}
              title="Ver en mi calendario de Google"
              onClick={(e) => {
                e.stopPropagation();
                window.open(
                  cita_proxima.html_link_calendar + `&authuser=${user?.email}`,
                  "_blank"
                );
              }}
            >
              Revisar
            </Button>
            <Button btnType="secondary" onClick={handleCancelAppointment}>
              Cancelar
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default NextAppointmentBanner;
