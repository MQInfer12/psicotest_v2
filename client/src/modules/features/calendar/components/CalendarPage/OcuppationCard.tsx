import Icon from "@/modules/core/components/icons/Icon";
import { Ocuppation } from "../../api/responses";
import { stringFromDate } from "../../utils/stringFromDate";
import dayjs from "dayjs";

interface Props {
  ocupacion: Ocuppation;
  onClick: () => void;
}

const OcuppationCard = ({ ocupacion, onClick }: Props) => {
  const { day, date } = stringFromDate(dayjs(ocupacion.fecha));
  return (
    <button
      onClick={onClick}
      title={ocupacion.descripcion}
      className="relative hover:-translate-y-1 hover:shadow-primary-200 dark:hover:shadow-primary-800/20 transition-all duration-200 flex justify-center py-4 h-24 bg-white dark:bg-alto-1000 rounded-lg shadow-md border border-alto-300/70 dark:border-alto-900 text-alto-950 dark:text-alto-50 overflow-hidden text-start"
    >
      {ocupacion.citas_colindantes_count > 0 && (
        <span className="absolute bottom-0 right-0 bg-danger text-xs px-2 text-white pt-[2px] rounded-tl-md">
          {ocupacion.citas_colindantes_count} cita
          {ocupacion.citas_colindantes_count === 1 ? "" : "s"} en este horario
        </span>
      )}
      <div className="flex flex-col justify-center items-center w-20">
        <p className="text-xs">{day.slice(0, 3).toLocaleLowerCase()}</p>
        <strong className="text-2xl">{date}</strong>
      </div>
      <span className="h-full w-1 rounded-full bg-primary-400" />
      <div className="flex flex-col justify-center flex-1 px-4 gap-[6px] overflow-hidden">
        <span className="flex items-center gap-2 text-xs">
          <div className="w-4 h-4">
            <Icon type={Icon.Types.CLOCK} />
          </div>
          {ocupacion.hora_inicio.slice(0, 5)} -{" "}
          {ocupacion.hora_final.slice(0, 5)}
        </span>
        <span className="flex items-center gap-2 text-xs">
          <div className="w-4 h-4">
            <Icon type={Icon.Types.TEXT} />
          </div>
          <p className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis">
            {ocupacion.descripcion}
          </p>
        </span>
      </div>
    </button>
  );
};

export default OcuppationCard;
