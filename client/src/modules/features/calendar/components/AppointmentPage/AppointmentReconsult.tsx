import Button from "@/modules/core/components/ui/Button";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import AppointmentForm from "./AppointmentForm";
import { Appointment } from "../../api/responses";
import { User } from "@/modules/features/users/api/responses";
import { SetData } from "@/modules/core/hooks/useFetch/getSetData";
import Icon from "@/modules/core/components/icons/Icon";
import { useUserContext } from "@/modules/features/auth/context/UserContext";
import { stringFromDate } from "../../utils/stringFromDate";
import dayjs from "dayjs";

interface Props {
  cita: Appointment;
  user: User;
  setData: SetData<{
    cita: Appointment;
    paciente: User;
  }>;
}

const AppointmentReconsult = ({ cita, user, setData }: Props) => {
  const { modal, setOpen } = useModal();
  const { user: me } = useUserContext();

  const { cita_proxima } = cita;
  const { year, date, day, month } = cita_proxima
    ? stringFromDate(dayjs(cita_proxima.fecha))
    : {};

  return (
    <>
      {modal(
        "Formulario de cita",
        <AppointmentForm
          cita={cita}
          user={user}
          onSuccess={(res) => {
            setData((prev) => ({
              ...prev,
              cita: { ...prev.cita, cita_proxima: res },
            }));
            setOpen(false);
          }}
        />
      )}
      <div className="flex h-full w-full overflow-hidden">
        <div className="flex flex-col justify-between gap-4 flex-1 h-full py-4 overflow-hidden">
          <div className="flex flex-col items-center justify-center flex-1 gap-4 overflow-auto px-4">
            {cita_proxima ? (
              <>
                <small className="max-w-80 w-full text-alto-950 dark:text-alto-50 opacity-60 leading-relaxed text-center text-xs">
                  Tienes una cita con el paciente próximamente
                </small>
                <div className="flex">
                  <div className="flex flex-col justify-center items-center w-20 h-20">
                    <p className="text-xs">
                      {day?.toLocaleLowerCase().slice(0, 3)}
                    </p>
                    <strong className="text-3xl">{date}</strong>
                  </div>
                  <span className="h-full w-1 rounded-full bg-primary-400" />
                  <div className="flex flex-col justify-center flex-1 px-4 gap-3 overflow-hidden">
                    <span className="flex items-center gap-2 text-xs">
                      <div className="w-4 h-4">
                        <Icon type={Icon.Types.CLOCK} />
                      </div>
                      {cita_proxima.hora_inicio.slice(0, 5)} -
                      {cita_proxima.hora_final.slice(0, 5)}
                    </span>
                    <span className="flex items-center gap-2 text-xs">
                      <div className="w-4 h-4">
                        <Icon type={Icon.Types.CALENDAR} />
                      </div>
                      <p className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis">
                        {month} {year}
                      </p>
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    window.open(
                      cita_proxima.html_link_calendar +
                        `&authuser=${me?.email}`,
                      "_blank"
                    );
                  }}
                  btnSize="small"
                  btnType="secondary"
                  icon={Icon.Types.GOOGLE_CALENDAR}
                >
                  Ver evento
                </Button>
              </>
            ) : (
              <>
                <small className="max-w-80 w-full text-alto-950 dark:text-alto-50 opacity-60 leading-relaxed text-center text-xs">
                  Cuando hayas terminado de atender al paciente, puedes generar
                  una nueva cita informándole y preguntando su disponibilidad.
                </small>
                <Button
                  onClick={() => setOpen(true)}
                  btnSize="small"
                  btnType="secondary"
                >
                  Generar nueva cita
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AppointmentReconsult;
