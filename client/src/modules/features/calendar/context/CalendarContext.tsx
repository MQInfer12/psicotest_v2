import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import dayjs, { Dayjs } from "dayjs";
import { createContext, useContext, useState } from "react";
import { Appointment, Ocuppation, Schedule } from "../api/responses";

interface Ctx {
  dateSelected: Dayjs;
  setDateSelected: React.Dispatch<React.SetStateAction<Dayjs>>;
  horariosDisponibles: Schedule[] | undefined;
  citasProximas: Appointment[] | undefined;
  ocupacionesProximas: Ocuppation[] | undefined;
  daysFromSelected: number;
}

const CalendarContext = createContext<Ctx | null>(null);

interface Props {
  children: React.ReactNode;
}

export const CalendarContextProvider = ({ children }: Props) => {
  const [dateSelected, setDateSelected] = useState(dayjs());
  const { fetchData } = useFetch();
  const daysFromSelected = 6;

  const { data } = fetchData("GET /horario", {
    params: {
      date: dateSelected.format("YYYY-MM-DD"),
    },
    queryOptions: {
      gcTime: 0,
    },
  });

  return (
    <CalendarContext.Provider
      value={{
        daysFromSelected,
        dateSelected,
        setDateSelected,
        horariosDisponibles: data?.horarios,
        citasProximas: data?.citas,
        ocupacionesProximas: data?.ocupaciones,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendarContext = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error(
      "this contexts must be used whitin a CalendarContextProvider"
    );
  }
  return context;
};
