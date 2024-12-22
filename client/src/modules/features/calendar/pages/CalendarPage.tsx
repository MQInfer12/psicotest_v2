import { useMeasureContext } from "../../_layout/context/MeasureContext";
import { usePermiso } from "../../auth/hooks/usePermiso";
import { Permisos } from "../../auth/types/Permisos";
import AgendaColumn from "../components/AgendaColumn";
import CalendarColumn from "../components/CalendarColumn";
import ScheduleHeader from "../components/ScheduleHeader";
import { CalendarContextProvider } from "../context/CalendarContext";

const CalendarPage = () => {
  const { PRIVATE_PADDING_INLINE } = useMeasureContext();

  const anadirPermisos = usePermiso([Permisos.ANADIR_HORARIOS]);
  const agendarPermisos = usePermiso([Permisos.VER_HORARIOS]);
  return (
    <CalendarContextProvider>
      <div
        className="flex gap-16 flex-1 overflow-hidden"
        style={{
          paddingInline: PRIVATE_PADDING_INLINE,
          paddingBottom: PRIVATE_PADDING_INLINE,
        }}
      >
        <CalendarColumn />
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          {anadirPermisos && <ScheduleHeader />}
          {agendarPermisos && <AgendaColumn />}
        </div>
      </div>
    </CalendarContextProvider>
  );
};

export default CalendarPage;
