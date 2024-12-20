import { useMeasureContext } from "../../_layout/context/MeasureContext";
import AgendaColumn from "../components/AgendaColumn";
import CalendarColumn from "../components/CalendarColumn";
import ScheduleHeader from "../components/ScheduleHeader";

const CalendarPage = () => {
  const { PRIVATE_PADDING_INLINE } = useMeasureContext();

  return (
    <div
      className="flex gap-16 flex-1 overflow-hidden"
      style={{
        paddingInline: PRIVATE_PADDING_INLINE,
        paddingBottom: PRIVATE_PADDING_INLINE,
      }}
    >
      <CalendarColumn />
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        <ScheduleHeader />
        <AgendaColumn />
      </div>
    </div>
  );
};

export default CalendarPage;
