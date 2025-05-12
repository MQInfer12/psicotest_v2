import { useCallback } from "react";
import clsx from "clsx";
import dayjs, { Dayjs } from "dayjs";
import { useCalendarContext } from "../../context/CalendarContext";
import { DAYS } from "../../data/days";

interface Props {
  fechaActual: Dayjs;
}

const Calendar = ({ fechaActual }: Props) => {
  const { daysFromSelected, dateSelected, setDateSelected } =
    useCalendarContext();

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
        "grid border border-alto-300/70 dark:border-alto-800 p-2 rounded-md bg-alto-50 dark:bg-alto-1000 shadow-md"
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
        const isCurrentMonth = dia.month() === fechaActual.month();
        const isPastToday = dia.isBefore(today, "day");

        const markSelected = dia.isSame(dateSelected, "day");
        const markLastDate = dia.isSame(
          dateSelected.add(daysFromSelected, "day"),
          "day"
        );
        const isBetween =
          dia.isAfter(dateSelected, "day") &&
          dia.isBefore(dateSelected.add(daysFromSelected, "day"), "day");

        return (
          <button
            key={i}
            className={clsx(
              "flex group relative items-center justify-center isolate hover:opacity-60 aspect-square select-none",
              !isCurrentMonth && "opacity-40",
              isPastToday && "pointer-events-none !opacity-10",
              "text-alto-950 dark:text-alto-50"
            )}
            onClick={() => setDateSelected(dia)}
            disabled={isPastToday}
          >
            {isToday && (
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[90%] rounded-full bg-warning/20" />
            )}
            {markSelected && (
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[90%] rounded-full bg-primary-500/40 z-10" />
            )}
            {markLastDate && (
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[90%] rounded-full rounded-tl-none rounded-bl-none bg-primary-500/10 z-10" />
            )}
            {(isBetween || markSelected) && (
              <span
                className={clsx(
                  "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[90%] bg-primary-500/10 z-10",
                  markSelected && "rounded-full rounded-tr-none rounded-br-none"
                )}
              />
            )}
            <p
              className={clsx("text-nowrap text-[12px] font-bold z-50", {
                "text-black/60 dark:text-alto-50/60":
                  !markLastDate && !markSelected,
                "text-alto-50": markSelected,
              })}
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
