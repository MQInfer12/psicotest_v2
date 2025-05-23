import DefaultPhoto from "@/assets/images/defaultPhoto.jpg";
import Icon from "@/modules/core/components/icons/Icon";
import IconMessage from "@/modules/core/components/icons/IconMessage";
import Button from "@/modules/core/components/ui/Button";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { useUserContext } from "@/modules/features/auth/context/UserContext";
import clsx from "clsx";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { calcPassedHour } from "../../utils/calcPassedHour";
import { stringFromDate } from "../../utils/stringFromDate";
import CancelationForm from "../AppointmentPage/CancelationForm";

const NextAppointmentBanner = () => {
  const { user, setUser } = useUserContext();

  const { fetchData, postData } = useFetch();
  const { data } = fetchData([
    "GET /cita/respuesta/status/:id_calendar",
    {
      id_calendar: user?.cita_proxima?.id_calendar ?? "",
    },
  ]);
  const getMutation = postData("GET /me");

  const { modal, setOpen } = useModal();

  const [loading, setLoading] = useState(false);

  const cita_proxima = user?.cita_proxima;
  if (!cita_proxima) {
    throw new Error("No hay cita programada para renderizar este componente");
  }

  const { day, date, month } = stringFromDate(dayjs(cita_proxima.fecha));
  const hora_inicio = cita_proxima.hora_inicio.slice(0, 5);
  const hora_final = cita_proxima.hora_final.slice(0, 5);

  const [isCurrent, setIsCurrent] = useState(
    calcPassedHour(cita_proxima.fecha, hora_inicio)
  );
  const [hasPassed, setHasPassed] = useState(
    calcPassedHour(cita_proxima.fecha, hora_final)
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setIsCurrent(calcPassedHour(cita_proxima.fecha, hora_inicio));
      setHasPassed(calcPassedHour(cita_proxima.fecha, hora_final));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {modal(
        "Cancelar cita",
        <CancelationForm
          idCita={cita_proxima.id}
          onSuccess={(res) => setUser(res)}
        />
      )}
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
                            /* data === "needsAction" */ false || !data,
                          "bg-success/10 text-success border-success/40":
                            /* data === "accepted" */ !!data,
                          "bg-danger/10 text-danger border-danger/40":
                            /*  data === "declined" */ false,
                        }
                      )}
                    >
                      {!data
                        ? "..."
                        : {
                            needsAction: "Pendiente",
                            accepted: "Aceptada",
                            declined: "Rechazada",
                          }["accepted"]}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </IconMessage>
          {hasPassed && (
            <Button
              onClick={() => {
                setLoading(true);
                getMutation(null, {
                  onSuccess: (res) => {
                    console.log(res.data);
                    setUser(res.data);
                  },
                  onSettled: () => {
                    setLoading(false);
                  },
                });
              }}
              disabled={loading}
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
                    cita_proxima.html_link_calendar +
                      `&authuser=${user?.email}`,
                    "_blank"
                  );
                }}
              >
                Revisar
              </Button>
              <Button
                btnType="secondary"
                onClick={() => {
                  setOpen(true);
                }}
              >
                Cancelar
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default NextAppointmentBanner;
