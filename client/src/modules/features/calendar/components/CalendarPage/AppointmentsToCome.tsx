import Loader from "@/modules/core/components/ui/loader/Loader";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import AppointmentCard from "./cards/AppointmentCard";
import CalendarCard from "./cards/CalendarCard";

const AppointmentsToCome = () => {
  const { fetchData } = useFetch();
  const { data } = fetchData("GET /cita");

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
      <CalendarCard.List>
        {data.map((h) => (
          <AppointmentCard key={h.id} appointment={h} />
        ))}
      </CalendarCard.List>
    </main>
  );
};

export default AppointmentsToCome;
