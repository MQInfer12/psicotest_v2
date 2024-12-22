import Button from "@/modules/core/components/ui/Button";
import { useCalendarContext } from "../context/CalendarContext";
import { MONTHS } from "../data/months";
import { DAYS } from "../data/days";
import Loader from "@/modules/core/components/ui/loader/Loader";
import dayjs from "dayjs";

const DAYS_FROM_NOW = 7;

const calcularTiempo = (horaInicio: string, horaFinal: string) => {
  const inicio = horaInicio.split(":");
  const final = horaFinal.split(":");

  const hora = parseInt(final[0]) - parseInt(inicio[0]);
  const minuto = parseInt(final[1]) - parseInt(inicio[1]);

  return `${hora} hora${hora > 1 ? "s" : ""}${minuto > 0 ? `${minuto} minuto${minuto > 1 ? "s" : ""}` : ""}`;
};

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

            return (
              <div key={i} className="flex flex-col gap-6">
                <header className="text-alto-400 text-sm px-4">
                  {DAYS[currentDay.day() === 0 ? 6 : currentDay.day() - 1]?.dia}
                  , {currentDay.format("D")} de {MONTHS[currentDay.month()]}
                </header>
                <ul className="flex flex-col gap-4 px-4">
                  {disponibles?.map((h, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between gap-10 bg-alto-50 px-4 py-2 border border-alto-300 rounded-md shadow-md"
                    >
                      <div className="flex items-center h-full gap-10">
                        <div className="flex flex-col w-12">
                          <strong className="text-xl text-primary-900">
                            {h.hora_inicio.slice(0, 5)}
                          </strong>
                          <small className="text-alto-500">
                            ~ {h.hora_final.slice(0, 5)}
                          </small>
                        </div>
                        <span className="h-[80%] w-1 rounded-full bg-primary-400" />
                        <div>
                          <small className="text-alto-500 text-xs">
                            {calcularTiempo(
                              h.hora_inicio.slice(0, 5),
                              h.hora_final.slice(0, 5)
                            )}{" "}
                            apróx. con:
                          </small>
                          <p className="font-medium">{h.nombre_user}</p>
                        </div>
                      </div>
                      <Button btnType="secondary" btnSize="small">
                        Reservar
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </main>
      )}
    </section>
  );
};

export default AgendaColumn;
