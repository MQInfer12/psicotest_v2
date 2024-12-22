import Loader from "@/modules/core/components/ui/loader/Loader";
import dayjs from "dayjs";
import { useCalendarContext } from "../context/CalendarContext";
import { stringFromDate } from "../utils/stringFromDate";
import ScheduleCard from "./ScheduleCard";

const DAYS_FROM_NOW = 7;

const AgendaColumn = () => {
  const { dateSelected, horariosDisponibles } = useCalendarContext();

  const today = dayjs();
  const now = new Date();

  return (
    <section className="flex flex-col gap-6 flex-1 overflow-hidden">
      <header className="h-10 flex items-center px-4">
        <strong className="text-primary-900">
          Horarios disponibles de la semana
        </strong>
      </header>
      {!dateSelected ? (
        <Loader text="Cargando horarios..." />
      ) : (
        <main className="flex flex-col flex-1 overflow-x-hidden overflow-y-scroll gap-8">
          {[...Array(DAYS_FROM_NOW)].map((_, i) => {
            const currentDay = dateSelected.clone().add(i, "days");

            const dayIndex = currentDay.day() === 0 ? 6 : currentDay.day() - 1;
            const disponibles = horariosDisponibles
              ?.filter((h) => {
                const [hours, minutes] = h.hora_inicio.split(":").map(Number);
                const targetTime = new Date();
                targetTime.setHours(hours, minutes, 0, 0);
                return (
                  h.dia === dayIndex &&
                  (today.isSame(currentDay, "day") ? now < targetTime : true)
                );
              })
              ?.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
            if (disponibles?.length === 0) return;

            const { date, day, month } = stringFromDate(currentDay);
            return (
              <div key={i} className="flex flex-col gap-6">
                <header className="text-alto-400 text-sm px-4">
                  <span className="text-primary-400">{day}</span>, {date} de{" "}
                  {month}
                </header>
                <div className="flex flex-col gap-4 px-4">
                  {disponibles?.map((h, index) => (
                    <ScheduleCard
                      key={index}
                      horario={h}
                      fecha={currentDay.format("YYYY-MM-DD")}
                      dia={day}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </main>
      )}
    </section>
  );
};

export default AgendaColumn;
