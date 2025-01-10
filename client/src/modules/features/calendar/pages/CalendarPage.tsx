import { useMeasureContext } from "../../_layout/context/MeasureContext";
import { useUserContext } from "../../auth/context/UserContext";
import { usePermiso } from "../../auth/hooks/usePermiso";
import { Permisos } from "../../auth/types/Permisos";
import AgendaColumn from "../components/CalendarPage/AgendaColumn";
import AppointmentColumn from "../components/CalendarPage/AppointmentColumn";
import CalendarColumn from "../components/CalendarPage/CalendarColumn";
import NextAppointmentBanner from "../components/CalendarPage/NextAppointmentBanner";
import ScheduleHeader from "../components/CalendarPage/ScheduleHeader";
import { CalendarContextProvider } from "../context/CalendarContext";

const CalendarPage = () => {
  const { user } = useUserContext();
  const { PRIVATE_PADDING_INLINE } = useMeasureContext();

  const anadirPermisos = usePermiso([Permisos.ANADIR_HORARIOS]);
  const agendarPermisos = usePermiso([Permisos.VER_HORARIOS]);
  const verCitas = usePermiso([Permisos.VER_CITAS]);

  return (
    <div
      className="relative flex gap-16 flex-1 overflow-auto max-lg:flex-col max-lg:gap-8 max-lg:items-center"
      style={{
        paddingInline: PRIVATE_PADDING_INLINE,
        paddingBottom: PRIVATE_PADDING_INLINE,
      }}
    >
      {user?.cita_proxima ? (
        <NextAppointmentBanner />
      ) : (
        <CalendarContextProvider>
          {agendarPermisos && <CalendarColumn />}
          <div className="flex-1 flex flex-col gap-6 overflow-hidden max-lg:overflow-visible max-lg:w-full sticky top-0">
            {anadirPermisos && <ScheduleHeader />}
            {agendarPermisos && <AgendaColumn />}
            {verCitas && <AppointmentColumn />}
          </div>
        </CalendarContextProvider>
      )}
    </div>
  );
};

export default CalendarPage;
