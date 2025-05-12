import DefaultPhoto from "@/assets/images/defaultPhoto.jpg";
import Icon from "@/modules/core/components/icons/Icon";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toasts";
import dayjs from "dayjs";
import { useUserContext } from "../../../../auth/context/UserContext";
import { getTokens } from "../../../../auth/utils/localStorageToken";
import { Schedule } from "../../../api/responses";
import { stringFromDate } from "../../../utils/stringFromDate";
import PreAppointmentForm from "../PreAppointmentForm";
import CalendarCard from "./CalendarCard";

interface Props {
  horario: Schedule;
  fecha: string;
}

const ScheduleCard = ({ horario, fecha }: Props) => {
  const { user, setUser } = useUserContext();
  const { postData } = useFetch();
  const mutation = postData("POST /cita");
  const { modal, setOpen } = useModal<{
    fecha: string;
    hora: string;
  }>();

  const hora_inicio = horario.hora_inicio.slice(0, 5);
  const hora_final = horario.hora_final.slice(0, 5);

  const handleConfirmAppointment = () => {
    return new Promise((resolve) => {
      const tokens = getTokens();
      if (!tokens) return;
      mutation(
        {
          id_horario: horario.id,
          fecha,
        },
        {
          onSuccess: (res) => {
            toastSuccess("Cita solicitada con éxito");
            setUser(res.data.paciente);
            resolve(true);
          },
        }
      );
    });
  };

  const handleRequestAppointment = () => {
    if (
      !user?.carrera ||
      !user.fecha_nacimiento ||
      !user.genero ||
      !user.semestre ||
      !user.codigo_estudiantil ||
      !user.telefono
    ) {
      setOpen({
        fecha,
        hora: hora_inicio,
      });
      return;
    }

    const { date, day, month } = stringFromDate(dayjs(fecha));
    toastConfirm(
      `¿Quieres solicitar una cita el día ${day.toLocaleLowerCase()}, ${date} de ${month} a las ${hora_inicio}?`,
      handleConfirmAppointment
    );
  };

  return (
    <>
      {modal(
        "Datos requeridos",
        (data) => {
          if (!data) return;
          const { date, day, month } = stringFromDate(dayjs(data.fecha));
          return (
            <PreAppointmentForm
              user={user}
              onSuccess={async (res) => {
                setUser(res);
                await handleConfirmAppointment();
                setOpen(false);
              }}
              withName
            >
              <small className="text-alto-950 dark:text-alto-50 [&>span]:text-primary-500 dark:[&>span]:text-primary-400 text-center mb-2 leading-relaxed">
                Por favor llena tus datos personales para acceder a la cita del
                día
                <br />
                <span>{day}</span>, {date} de {month} a las {data.hora}
              </small>
            </PreAppointmentForm>
          );
        },
        {
          width: 480,
        }
      )}

      <CalendarCard
        onClick={handleRequestAppointment}
        title="Horario disponible"
        responsive={false}
      >
        <CalendarCard.Aside date={fecha} responsive={false} />
        <CalendarCard.Body>
          <CalendarCard.Header
            minWidth="0"
            imageSrc={horario.foto_user ?? DefaultPhoto}
            headerTexts={[
              [
                {
                  text: horario.nombre_user,
                },
                {
                  text: `${hora_inicio} - ${hora_final}`,
                  icon: Icon.Types.CLOCK,
                },
              ],
              [],
            ]}
          />
        </CalendarCard.Body>
      </CalendarCard>

      {/* <div
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
                <small className="text-alto-500 dark:text-alto-400 text-xs whitespace-nowrap overflow-hidden text-ellipsis w-full flex gap-2">
                  {citaCorregida ? (
                    <>
                      <span className="bg-success/10 text-success px-2 rounded-md">
                        Corregido
                      </span>
                      {citaDerivada && (
                        <span className="bg-warning/10 text-warning px-2 rounded-md">
                          Derivado a {citaDerivada}
                        </span>
                      )}
                    </>
                  ) : (
                    `${calcularTiempo(hora_inicio, hora_final)} apróx. con:`
                  )}
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
                  title="Aceptar la cita en el calendario (Enviaremos un correo de confirmación al paciente)"
                  icon={
                    estado === "accepted"
                      ? patched
                        ? Icon.Types.CHECK_ANIMATED
                        : Icon.Types.CHECK
                      : Icon.Types.MAIL
                  }
                  subicon={estado === "accepted" ? undefined : Icon.Types.SEND}
                />
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
                <Button
                  btnSize="small"
                  icon={Icon.Types.PENCIL}
                  title="Atender la cita con el paciente"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({
                      to: "/calendar/$id",
                      params: {
                        id: String(horario.id),
                      },
                    });
                  }}
                >
                  Atender
                </Button>
              </div>
            )}
          </div>
        </div>
      </div> */}
    </>
  );
};

export default ScheduleCard;
