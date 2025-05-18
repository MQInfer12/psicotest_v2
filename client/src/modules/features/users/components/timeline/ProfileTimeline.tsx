import { fetchData } from "@/modules/core/hooks/useFetch/fetchData";
import GroupSubtitle from "@/modules/features/folders/components/GroupSubtitle";
import { User } from "../../api/responses";
import TimelineAppointment from "./TimelineAppointment";
import TimelineCase from "./TimelineCase";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import NoteForm from "./NoteForm";
import {
  Appointment,
  CalendarNote,
} from "@/modules/features/calendar/api/responses";
import TimelineNote from "./TimelineNote";
import { useUserContext } from "@/modules/features/auth/context/UserContext";

interface Props {
  paciente: User;
}

const ProfileTimeline = ({ paciente }: Props) => {
  const {
    modal,
    setOpen,
    item: itemModal,
  } = useModal<{
    type: "cita" | "caso";
    id: number;
    obj?: CalendarNote;
  }>();
  const { user } = useUserContext();

  const { data, setData } = fetchData([
    "GET /cita/historial/:email/psicotest",
    {
      email: paciente.email,
    },
  ]);

  const groupedData = data
    ? Object.groupBy(data.citas, (row) => row.id_caso)
    : undefined;
  const orderedData = groupedData
    ? Object.entries(groupedData)
        .map(([id_caso, citas]) => ({
          id_caso: Number(id_caso),
          citas: (citas as Appointment[]).sort(
            (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
          ),
        }))
        .sort((a, b) => {
          const fechaA = new Date(a.citas[0].fecha).getTime();
          const fechaB = new Date(b.citas[0].fecha).getTime();
          return fechaB - fechaA;
        })
    : undefined;

  let cantidadCasos = data?.casos.length ?? 0;

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto overflow-x-hidden isolate">
      <div className="mb-4 sticky top-0 z-10 bg-alto-100 dark:bg-alto-950">
        <GroupSubtitle title="Historial clínico del paciente" />
      </div>
      {modal(
        (item) =>
          item?.obj
            ? user?.email === item.obj.email_psicologo
              ? `Editar nota (${item.type})`
              : "Ver nota"
            : `Agregar nota (${item?.type})`,
        (item) => (
          <NoteForm
            onSuccess={(res) => {
              setOpen(false);
              if (item?.obj) {
                setData((prev) => ({
                  ...prev,
                  notas: prev.notas.map((v) => (v.id === res.id ? res : v)),
                }));
              } else {
                setData((prev) => ({
                  ...prev,
                  notas: [res, ...prev.notas],
                }));
              }
            }}
            onSuccessDelete={() => {
              setOpen(false);
              setData((prev) => ({
                ...prev,
                notas: prev.notas.filter((v) => v.id !== item?.obj?.id),
              }));
            }}
            idCita={item?.type === "cita" ? item.id : undefined}
            idCaso={item?.type === "caso" ? item.id : undefined}
            item={item?.obj}
          />
        )
      )}
      {data &&
        orderedData?.map((caso) => {
          const casoObj = data?.casos.find((c) => c.id === caso.id_caso);
          if (!casoObj) throw new Error("Caso no encontrado");
          cantidadCasos--;
          const casoNotas = data.notas.filter((n) => n.id_caso === casoObj.id);
          return (
            <>
              <TimelineCase
                key={casoObj.id}
                caso={casoObj}
                someAppointmentNotClosed={caso.citas.some(
                  (i) => !i.fecha_cierre_clinico
                )}
                nroCaso={cantidadCasos + 1}
                setData={setData}
                paciente={paciente}
                activeButtonAddNote={
                  itemModal?.type === "caso" && itemModal.id === casoObj.id
                }
                onClickAddNote={() => {
                  setOpen({ type: "caso", id: casoObj.id });
                }}
              />
              {casoNotas.map((note) => (
                <TimelineNote
                  key={note.id}
                  note={note}
                  onClick={() =>
                    setOpen({ type: "caso", id: casoObj.id, obj: note })
                  }
                />
              ))}
              {caso.citas.map((cita) => {
                const lastCita =
                  data.citas[data.citas.length - 1].id === cita.id;
                const citaNotas = data.notas.filter(
                  (n) => n.id_cita === cita.id
                );
                return (
                  <>
                    <TimelineAppointment
                      key={cita.id}
                      appointment={cita}
                      last={lastCita && citaNotas.length === 0}
                      activeButtonAddNote={
                        itemModal?.type === "cita" && itemModal.id === cita.id
                      }
                      onClickAddNote={() => {
                        setOpen({ type: "cita", id: cita.id });
                      }}
                    />
                    {citaNotas.map((note) => (
                      <TimelineNote
                        key={note.id}
                        note={note}
                        onClick={() =>
                          setOpen({ type: "cita", id: cita.id, obj: note })
                        }
                        last={
                          lastCita &&
                          citaNotas[citaNotas.length - 1].id === note.id
                        }
                      />
                    ))}
                  </>
                );
              })}
            </>
          );
        })}
    </div>
  );
};

export default ProfileTimeline;
