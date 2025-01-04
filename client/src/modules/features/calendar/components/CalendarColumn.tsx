import { useState } from "react";
import Calendar from "./Calendar";
import dayjs from "dayjs";
import Button from "@/modules/core/components/ui/Button";
import { DAYS } from "../data/days";
import { MONTHS } from "../data/months";
import { useCalendarContext } from "../context/CalendarContext";
import { getDayIndex } from "../utils/getDayIndex";

const CalendarColumn = () => {
  const actual = dayjs();

  const { dateSelected } = useCalendarContext();

  const nextMonth = actual.add(1, "month");

  const [fechaActual, setFechaActual] = useState(actual);

  const handleCurrentMonth = () => {
    setFechaActual(actual);
  };

  const handleNextMonth = () => {
    setFechaActual(nextMonth);
  };

  const diaActual = DAYS[getDayIndex(actual)];
  const mesActual = MONTHS[actual.month()];
  const mesSiguiente = MONTHS[nextMonth.month()];

  return (
    <div className="w-72 flex flex-col gap-8">
      <header className="flex gap-4 items-center justify-between">
        <strong className="text-primary-900 dark:text-primary-400">
          {mesActual} {fechaActual.format("YYYY")}
        </strong>
        <div className="bg-primary-200 dark:bg-primary-1000 h-10 aspect-square flex flex-col items-center justify-center rounded-md">
          <small className="text-[10px] font-medium opacity-60 text-alto-950 dark:text-alto-50">
            {diaActual.abrev.toUpperCase()}
          </small>
          <p className="font-bold text-primary-900 dark:text-primary-400 -mt-1">
            {fechaActual.format("D")}
          </p>
        </div>
      </header>
      <div className="flex gap-2">
        <Button
          width="100%"
          onClick={handleCurrentMonth}
          btnType={
            fechaActual.isSame(actual, "month") ? "primary" : "secondary"
          }
        >
          {mesActual}
        </Button>
        <Button
          width="100%"
          onClick={handleNextMonth}
          btnType={
            fechaActual.isSame(nextMonth, "month") ? "primary" : "secondary"
          }
        >
          {mesSiguiente}
        </Button>
      </div>
      <Calendar fechaActual={fechaActual} />
      <div className="flex flex-col gap-4">
        <p className="text-alto-400 text-sm text-center px-8 leading-relaxed flex flex-col">
          Mostrando resultados desde el:{" "}
          <span className="font-bold text-primary-400">
            {DAYS[getDayIndex(dateSelected)]?.dia}, {dateSelected.format("D")}{" "}
            de {MONTHS[dateSelected.month()]}
          </span>
        </p>
        <small className="text-xs text-alto-400 text-center">
          Selecciona un horario para agendar una cita
        </small>
      </div>
    </div>
  );
};

export default CalendarColumn;
