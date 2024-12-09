import { useMeasureContext } from "../../_layout/context/MeasureContext";
import AgendaColumn from "../components/AgendaColumn";
import CalendarColumn from "../components/CalendarColumn";

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
      <AgendaColumn />
    </div>
  );
};

export default CalendarPage;
