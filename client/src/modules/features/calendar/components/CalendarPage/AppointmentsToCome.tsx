import Loader from "@/modules/core/components/ui/loader/Loader";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import dayjs from "dayjs";
import { stringFromDate } from "../../utils/stringFromDate";
import ScheduleCard from "./ScheduleCard";
import { getDayIndex } from "../../utils/getDayIndex";

const AppointmentsToCome = () => {
  const { fetchData } = useFetch();
  const { data, setData } = fetchData("GET /cita");

  const groupedData = Object.groupBy(data ?? [], (v) => v.fecha);

  if (!data)
    return (
      <div className="flex-1">
        <Loader text="Cargando tus citas próximas..." />
      </div>
    );
  if (data.length === 0)
    return (
      <p className="text-center text-sm text-alto-500 dark:text-alto-400 flex items-center justify-center flex-1">
        No tienes citas próximamente
      </p>
    );

  return (
    <main className="flex flex-col flex-1 overflow-x-hidden overflow-y-scroll gap-8 max-lg:overflow-y-hidden">
      {Object.keys(groupedData).map((appointmentsDate) => {
        const today = dayjs();
        const currentDay = dayjs(appointmentsDate);
        const { date, day, month } = stringFromDate(currentDay);
        const isToday = today.isSame(currentDay, "day");
        return (
          <div key={date} className="flex flex-col gap-6">
            <header className="text-alto-400 text-sm px-4 max-lg:px-0">
              <span className="text-primary-400">{day}</span>, {date} de {month}
              {isToday ? " (Hoy)" : ""}
            </header>
            <div className="flex flex-col gap-4 pr-4 max-lg:px-0">
              {groupedData[appointmentsDate]?.map((h, index) => (
                <ScheduleCard
                  key={index}
                  horario={{
                    id: h.id,
                    hora_inicio: h.hora_inicio,
                    hora_final: h.hora_final,
                    nombre_user: h.nombre_paciente,
                    email_user: h.email_paciente,
                    foto_user: h.foto_paciente,
                    dia: getDayIndex(currentDay),
                  }}
                  fecha={currentDay.format("YYYY-MM-DD")}
                  esCita
                  citaCorregida={!!h.metodo}
                  citaDerivada={h.derivado_a}
                  estado={h.estado}
                  setData={setData}
                  link={h.html_link_calendar}
                />
              ))}
            </div>
          </div>
        );
      })}
    </main>
  );
};

export default AppointmentsToCome;
