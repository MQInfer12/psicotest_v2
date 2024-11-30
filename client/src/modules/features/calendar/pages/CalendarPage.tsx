import { useMeasureContext } from "../../_layout/context/MeasureContext";
import { MONTHS } from "../data/months";

const CalendarPage = () => {
  const { PRIVATE_PADDING_INLINE } = useMeasureContext();

  return (
    <div
      className="grid flex-1"
      style={{
        gridTemplateColumns: "auto 1fr",
        gridTemplateRows: "auto auto 1fr",
        gridTemplateAreas: `
          'year months'
          'days days'
          'schedules schedules'
        `,
        paddingInline: PRIVATE_PADDING_INLINE,
      }}
    >
      <div
        style={{
          gridArea: "year",
        }}
        className=""
      >
        <select>
          <option>2024</option>
        </select>
      </div>
      <div
        style={{
          gridArea: "months",
        }}
        className="flex"
      >
        {MONTHS.map((mes) => (
          <button className="flex-1">{mes}</button>
        ))}
      </div>
      <div
        style={{
          gridArea: "days",
        }}
        className="bg-amber-500 h-10"
      ></div>
      <main
        style={{
          gridArea: "schedules",
        }}
        className="bg-sky-500"
      ></main>
    </div>
  );
};

export default CalendarPage;
