import { useCallback } from "react";
import { DAYS } from "../data/days";
import clsx from "clsx";
import dayjs, { Dayjs } from "dayjs";
import { useCalendarContext } from "../context/CalendarContext";

interface Props {
  fechaActual: Dayjs;
}

const Calendar = ({ fechaActual }: Props) => {
  const { dateSelected, setDateSelected } = useCalendarContext();

  const getMes = useCallback((fecha: Dayjs) => {
    const year = fecha.year();
    const mes = fecha.month();
    const primerDiaDelMes = dayjs(new Date(year, mes, 1)).day();
    let diaActual = primerDiaDelMes === 0 ? -6 : 1 - primerDiaDelMes;

    const dias = new Array(6).fill(null).map(() => {
      return new Array(7).fill(null).map(() => {
        diaActual++;
        return dayjs(new Date(year, mes, diaActual));
      });
    });

    return dias;
  }, []);

  const today = dayjs();
  const dias = getMes(fechaActual);
  return (
    <div
      className={
        "grid border border-alto-300 p-2 rounded-md bg-alto-50 shadow-md"
      }
      style={{
        gridTemplateColumns: "repeat(7, 1fr)",
        gridTemplateRows: "auto repeat(6, 1fr)",
      }}
    >
      {DAYS.map((dia, i) => (
        <div key={i} className="flex items-center justify-center pb-8">
          <p className="text-nowrap text-alto-400 text-xs">{dia.abrev}</p>
        </div>
      ))}
      {dias.flat().map((dia, i) => {
        const isToday = dia.isSame(today, "day");
        const marked = dia.isSame(dateSelected, "day");
        const isCurrentMonth = dia.month() === fechaActual.month();
        const isPast = dia.isBefore(today, "day");
        return (
          <button
            key={i}
            className={clsx(
              "flex group relative items-center justify-center isolate hover:opacity-60 aspect-square select-none",
              !isCurrentMonth && "opacity-40",
              isPast && "pointer-events-none !opacity-10"
            )}
            onClick={() => setDateSelected(dia)}
            disabled={isPast}
          >
            {isToday && (
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] aspect-square rounded-full bg-primary-500/20" />
            )}
            {marked && (
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] aspect-square rounded-full bg-primary-500/70 z-10" />
            )}
            <p
              className={clsx(
                "text-nowrap text-[12px] font-bold z-50",
                marked ? "text-white" : "text-black/60"
              )}
            >
              {dia.format("D")}
            </p>
          </button>
        );
      })}
    </div>
  );
};

export default Calendar;
