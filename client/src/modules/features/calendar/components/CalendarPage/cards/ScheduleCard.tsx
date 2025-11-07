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
        {/* <CalendarCard.Aside date={fecha} responsive={false} /> */}
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
                  text: horario.tipo,
                  icon: {
                    Presencial: Icon.Types.UNIVERSITY,
                    Virtual: Icon.Types.VIDEOCALL,
                  }[horario.tipo],
                },
              ],
              [
                {
                  text: hora_inicio,
                  icon: Icon.Types.CLOCK_PLAY,
                },
                {
                  text: hora_final,
                  icon: Icon.Types.CLOCK_PAUSE,
                },
              ],
            ]}
          />
        </CalendarCard.Body>
      </CalendarCard>
    </>
  );
};

export default ScheduleCard;
