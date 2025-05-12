import Loader from "@/modules/core/components/ui/loader/Loader";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import IconMessage from "@/modules/core/components/icons/IconMessage";
import Icon from "@/modules/core/components/icons/Icon";
import { useCalendarContext } from "../../context/CalendarContext";
import { getDayIndex } from "../../utils/getDayIndex";
import { getTimeObject } from "../../utils/getTimeObject";
import { stringFromDate } from "../../utils/stringFromDate";
import ScheduleCard from "./cards/ScheduleCard";

const DAYS_FROM_NOW = 7;

const checkOverlaping = (
  horaInicio1: Date,
  horaFin1: Date,
  horaInicio2: Date,
  horaFin2: Date
) => {
  const inicioOverlaping = horaInicio1 >= horaInicio2 && horaInicio1 < horaFin2;
  const finalOverlaping = horaFin1 > horaInicio2 && horaFin1 <= horaFin2;
  const insideOverlaping = inicioOverlaping || finalOverlaping;
  const outsideOverLaping = horaInicio1 < horaInicio2 && horaFin1 > horaFin2;
  return insideOverlaping || outsideOverLaping;
};

const AgendaColumn = () => {
  const {
    dateSelected,
    horariosDisponibles,
    citasProximas,
    ocupacionesProximas,
  } = useCalendarContext();

  const today = dayjs();
  const now = new Date();

  const horariosPorDia = [...Array(DAYS_FROM_NOW)].map((_, i) => {
    const currentDay = dateSelected.clone().add(i, "days");

    const dayIndex = getDayIndex(currentDay);
    const disponibles =
      horariosDisponibles
        ?.filter((h) => {
          const elPsicologoEstaOcupado = ocupacionesProximas?.some((o) => {
            if (o.fecha !== currentDay.format("YYYY-MM-DD")) return false;
            if (o.email_user !== h.email_user) return false;
            return checkOverlaping(
              getTimeObject(o.hora_inicio),
              getTimeObject(o.hora_final),
              getTimeObject(h.hora_inicio),
              getTimeObject(h.hora_final)
            );
          });

          if (elPsicologoEstaOcupado) return false;
          if (h.dia !== dayIndex) return false;

          const initialTargetTime = getTimeObject(h.hora_inicio);

          if (today.isSame(currentDay, "day") && now >= initialTargetTime) {
            return false;
          }

          const overlap = citasProximas?.some((cita) => {
            if (cita.fecha !== currentDay.format("YYYY-MM-DD")) return false;
            if (cita.email_psicologo !== h.email_user) return false;
            return checkOverlaping(
              getTimeObject(cita.hora_inicio),
              getTimeObject(cita.hora_final),
              initialTargetTime,
              getTimeObject(h.hora_final)
            );
          });

          return !overlap;
        })
        ?.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio)) ?? [];

    return disponibles;
  });

  return (
    <section className="flex flex-col gap-6 flex-1 overflow-hidden max-lg:w-full">
      <header className="h-10 flex items-center px-4 max-lg:px-0">
        <strong className="text-primary-900 dark:text-primary-400">
          Horarios disponibles de la semana
        </strong>
      </header>
      {!horariosDisponibles ? (
        <Loader text="Cargando horarios..." delay />
      ) : horariosPorDia.every((disponibles) => disponibles.length === 0) ? (
        <div className="w-full h-full flex items-center justify-center">
          <IconMessage
            message="No existen horarios disponibles próximamente"
            icon={Icon.Types.CALENDAR}
            small="Selecciona otra fecha"
          />
        </div>
      ) : (
        <ul className="flex flex-col flex-1 overflow-x-hidden overflow-y-scroll gap-8 max-lg:overflow-y-hidden">
          <AnimatePresence>
            {horariosPorDia.map((disponibles, i) => {
              const currentDay = dateSelected.clone().add(i, "days");
              if (disponibles?.length === 0) return;
              const { date, day, month } = stringFromDate(currentDay);
              return (
                <motion.li
                  key={`${date} de ${month}`}
                  initial={{
                    opacity: 0,
                    x: 200,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -200,
                  }}
                  className="flex flex-col gap-6"
                >
                  <header className="text-alto-400 text-sm px-4 max-lg:px-0">
                    <span className="text-primary-400">{day}</span>, {date} de{" "}
                    {month}
                  </header>
                  <div className="flex flex-col gap-4 px-4 max-lg:px-0">
                    {disponibles?.map((h, index) => (
                      <ScheduleCard
                        key={index}
                        horario={h}
                        fecha={currentDay.format("YYYY-MM-DD")}
                      />
                    ))}
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
};

export default AgendaColumn;
