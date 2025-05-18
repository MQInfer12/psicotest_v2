import { CalendarNote } from "@/modules/features/calendar/api/responses";
import DefaultPhoto from "@/assets/images/defaultPhoto.jpg";
import { formatDate } from "@/modules/core/utils/formatDate";
import clsx from "clsx";

interface Props {
  note: CalendarNote;
  onClick: () => void;
  last?: boolean;
}

const TimelineNote = ({ note, onClick, last }: Props) => {
  const modified = note.created_at !== note.updated_at;
  const isCita = !!note.id_cita;
  return (
    <div className="flex gap-2">
      <div className="w-28 flex gap-2">
        <div className="w-5 h-full relative isolate">
          <span className="w-4 h-4 rounded-full border-2 border-primary-400 absolute top-0 left-[2px] bg-alto-100 dark:bg-alto-950 z-10" />
          {!last && (
            <span className="absolute left-1/2 top-0 h-full border-l border-alto-400 dark:border-alto-800" />
          )}
        </div>
        <div className="h-5 flex flex-col items-start opacity-70">
          <p
            className={clsx(
              "flex-1 text-[10px] font-bold",
              modified ? "text-warning" : "text-success"
            )}
          >
            {modified ? "Modificado" : "Creado"}
          </p>
          <p className="flex-1 text-[10px] text-alto-950 dark:text-alto-50">
            {formatDate(note.updated_at)}
          </p>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center">
        <button
          className={clsx(
            "hover:opacity-80 outline-none mb-6 w-full flex items-center gap-4 transition-all duration-300 border-alto-400/50 dark:border-alto-800/50 text-alto-950 dark:text-alto-50",
            isCita && "pl-6 border-l border-alto-400/50 dark:border-alto-800/50"
          )}
          onClick={onClick}
        >
          <img
            className="h-12 w-12 object-cover rounded-md border border-alto-400/50 dark:border-alto-800/50"
            src={note.foto_psicologo ?? DefaultPhoto}
            onError={(event) => {
              event.currentTarget.src = DefaultPhoto;
            }}
          />
          <div className="flex flex-col gap-1 items-start">
            <strong className="text-xs">{note.nombre_psicologo}</strong>
            <small className="line-clamp-1 overflow-hidden leading-relaxed text-start">
              {note.descripcion}
            </small>
          </div>
        </button>
      </div>
    </div>
  );
};

export default TimelineNote;
