import { useState } from "react";
import Calendar from "./Calendar";
import dayjs from "dayjs";
import Button from "@/modules/core/components/ui/Button";
import { DAYS } from "../data/days";
import { MONTHS } from "../data/months";

const CalendarColumn = () => {
  const actual = dayjs();
  const nextMonth = actual.add(1, "month");

  const [fechaActual, setFechaActual] = useState(actual);

  const handleCurrentMonth = () => {
    setFechaActual(actual);
  };

  const handleNextMonth = () => {
    setFechaActual(nextMonth);
  };

  const diaActual = DAYS[actual.day() === 0 ? 6 : actual.day() - 1];
  const mesActual = MONTHS[actual.month()];
  const mesSiguiente = MONTHS[nextMonth.month()];
  return (
    <div className="w-72 flex flex-col gap-8">
      <header className="flex gap-4 items-center justify-between">
        <strong className="text-primary-900">
          {mesActual} {fechaActual.format("YYYY")}
        </strong>
        <div className="bg-primary-200 h-10 aspect-square flex flex-col items-center justify-center rounded-md">
          <small className="text-[10px] font-medium opacity-60">
            {diaActual.abrev.toUpperCase()}
          </small>
          <p className="font-bold text-primary-900 -mt-1">
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
      <p className="text-alto-400 text-sm text-center px-10 leading-relaxed">
        Selecciona una fecha y un horario para una cita
      </p>
    </div>
  );
};

export default CalendarColumn;
