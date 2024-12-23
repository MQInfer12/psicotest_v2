import Loader from "@/modules/core/components/ui/loader/Loader";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import dayjs from "dayjs";
import { stringFromDate } from "../utils/stringFromDate";
import ScheduleCard from "./ScheduleCard";
import { getDayIndex } from "../utils/getDayIndex";

const AppointmentColumn = () => {
  const { fetchData } = useFetch();
  const { data } = fetchData("GET /cita");
  const groupedData = Object.groupBy(data ?? [], (v) => v.fecha);
  return (
    <section className="flex flex-col gap-6 flex-1 overflow-hidden max-lg:w-full">
      <header className="h-10 flex items-center px-4 max-lg:px-0">
        <strong className="text-primary-900">Mis citas programadas</strong>
      </header>
      {!data ? (
        <Loader text="Cargando horarios..." />
      ) : data.length === 0 ? (
        <p className="text-center text-sm text-alto-500">
          No tienes citas próximamente
        </p>
      ) : (
        <main className="flex flex-col flex-1 overflow-x-hidden overflow-y-scroll gap-8 max-lg:overflow-y-hidden">
          {Object.keys(groupedData).map((appointmentsDate) => {
            const currentDay = dayjs(appointmentsDate);
            const { date, day, month } = stringFromDate(currentDay);
            return (
              <div key={date} className="flex flex-col gap-6">
                <header className="text-alto-400 text-sm px-4 max-lg:px-0">
                  <span className="text-primary-400">{day}</span>, {date} de{" "}
                  {month}
                </header>
                <div className="flex flex-col gap-4 px-4 max-lg:px-0">
                  {groupedData[appointmentsDate]?.map((h, index) => (
                    <ScheduleCard
                      key={index}
                      horario={{
                        id: 0,
                        hora_inicio: h.hora_inicio,
                        hora_final: h.hora_final,
                        nombre_user: h.nombre_paciente,
                        email_user: h.email_paciente,
                        foto_user: h.foto_paciente,
                        dia: getDayIndex(currentDay),
                      }}
                      fecha={currentDay.format("YYYY-MM-DD")}
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

export default AppointmentColumn;
