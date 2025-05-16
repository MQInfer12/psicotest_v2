import { fetchData } from "@/modules/core/hooks/useFetch/fetchData";
import { formatDate } from "@/modules/core/utils/formatDate";
import AppointmentCard from "@/modules/features/calendar/components/CalendarPage/cards/AppointmentCard";
import GroupSubtitle from "@/modules/features/folders/components/GroupSubtitle";
import TimelineCase from "./TimelineCase";
import { User } from "../../api/responses";

interface Props {
  paciente: User;
}

const ProfileTimeline = ({ paciente }: Props) => {
  const { data, setData } = fetchData([
    "GET /cita/historial/:email/psicotest",
    {
      email: paciente.email,
    },
  ]);

  let cantidadCasos = data?.filter((item) => item.tipo === "caso").length ?? 0;
  return (
    <div className="w-full h-full flex flex-col overflow-y-auto overflow-x-hidden isolate">
      <div className="mb-4 sticky top-0 z-10 bg-alto-100 dark:bg-alto-950">
        <GroupSubtitle title="Historial clínico del paciente" />
      </div>
      {data?.map((item, i) => {
        const lastItem = data.length - 1 === i;
        switch (item.tipo) {
          case "caso":
            cantidadCasos--;
            return (
              <TimelineCase
                caso={item.data}
                someAppointmentNotClosed={data
                  .filter(
                    (i) => i.tipo === "cita" && i.data.id_caso === item.data.id
                  )
                  .some(
                    (i) => i.tipo === "cita" && !i.data.fecha_cierre_clinico
                  )}
                nroCaso={cantidadCasos + 1}
                setData={setData}
                paciente={paciente}
              />
            );
          case "cita":
            return (
              <div className="flex gap-2 flex-wrap">
                <div className="min-w-28 flex gap-2">
                  <div className="w-5 h-full relative isolate">
                    <span className="w-full h-5 rounded-full border-2 border-primary-400 absolute top-0 left-0 bg-alto-100 dark:bg-alto-950 z-10" />
                    {!lastItem && (
                      <span className="absolute left-1/2 top-0 h-full border-l border-alto-400 dark:border-alto-800" />
                    )}
                  </div>
                  <div className="h-5 flex items-center">
                    <p className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis text-xs text-alto-950 dark:text-alto-50">
                      {formatDate(item.data.fecha)}
                    </p>
                  </div>
                </div>
                <div className="flex-1 flex flex-col mb-6 min-w-[400px] max-lg:min-w-[300px]">
                  <AppointmentCard
                    appointment={item.data}
                    sidebar={false}
                    psicologo={{
                      nombre: item.data.nombre_psicologo,
                      foto: item.data.foto_psicologo,
                    }}
                  />
                </div>
              </div>
            );
        }
      })}
      {/* 
      <div className="flex gap-2">
        <div className="w-28 flex gap-2">
          <div className="w-5 h-full relative isolate">
            <span className="w-full h-5 rounded-full border-2 border-primary-400 absolute top-0 left-0 bg-alto-100 z-10" />
            <span className="absolute left-1/2 top-0 h-full border-l border-alto-400" />
          </div>
          <div className="h-5 flex items-center">
            <p className="flex-1 text-xs">10 May, 2025</p>
          </div>
        </div>
        <button className="flex-1 flex mb-6 items-center gap-4 hover:opacity-70 transition-all duration-300">
          <img
            className="h-12 w-12 object-cover rounded-md border border-alto-300"
            src={DefaultPhoto}
            onError={(event) => {
              event.currentTarget.src = DefaultPhoto;
            }}
          />
          <div className="flex flex-col gap-1 items-start">
            <strong className="text-xs">Mauricio Molina</strong>
            <small className="line-clamp-1 overflow-hidden leading-relaxed text-start">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Veritatis modi beatae consectetur odio a eligendi ab laudantium
              at, labore ad. Iste dolorum incidunt voluptas, quibusdam, hic
              sequi in, quidem explicabo reprehenderit minima alias dolore quae
              quas error! Nobis, blanditiis facilis.
            </small>
          </div>
        </button>
      </div> */}
    </div>
  );
};

export default ProfileTimeline;
