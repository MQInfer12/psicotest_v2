import Icon from "@/modules/core/components/icons/Icon";
import { formatDate } from "@/modules/core/utils/formatDate";
import { Appointment } from "@/modules/features/calendar/api/responses";
import AppointmentCard from "@/modules/features/calendar/components/CalendarPage/cards/AppointmentCard";
import clsx from "clsx";

interface Props {
  appointment: Appointment;
  last: boolean;
  activeButtonAddNote: boolean;
  onClickAddNote: () => void;
}

const TimelineAppointment = ({
  appointment,
  last,
  activeButtonAddNote,
  onClickAddNote,
}: Props) => {
  return (
    <div className="flex gap-2 flex-wrap group">
      <div className="min-w-28 flex gap-2">
        <div className="w-5 h-full relative isolate">
          <span
            className={clsx(
              "group-hover:pointer-events-none w-full h-5 rounded-full border-2 border-primary-400 absolute top-0 left-0 bg-alto-100 dark:bg-alto-950 z-10 transition-all duration-300",
              !!appointment.fecha_cierre_clinico &&
                (activeButtonAddNote
                  ? "opacity-0"
                  : "group-hover:opacity-0 opacity-100")
            )}
          />
          {!!appointment.fecha_cierre_clinico && (
            <button
              onClick={onClickAddNote}
              className={clsx(
                "outline-none text-alto-950/60 dark:text-alto-50 bg-alto-100 dark:bg-alto-950 hover:text-primary-800 dark:hover:text-primary-400 transition-all duration-300 z-20",
                activeButtonAddNote
                  ? "opacity-100"
                  : "group-hover:opacity-100 opacity-0"
              )}
            >
              <Icon type={Icon.Types.STICKY_NOTE} />
            </button>
          )}
          {!last && (
            <span className="absolute left-1/2 top-0 h-full border-l border-alto-400 dark:border-alto-800 -z-10" />
          )}
        </div>
        <div className="h-5 flex items-center">
          <p className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis text-xs text-alto-950 dark:text-alto-50">
            {formatDate(appointment.fecha)}
          </p>
        </div>
      </div>
      <div className="flex-1 flex flex-col mb-6 min-w-[400px] max-lg:min-w-[300px]">
        <AppointmentCard
          appointment={appointment}
          sidebar={false}
          psicologo={{
            nombre: appointment.nombre_psicologo,
            foto: appointment.foto_psicologo,
          }}
        />
      </div>
    </div>
  );
};

export default TimelineAppointment;
