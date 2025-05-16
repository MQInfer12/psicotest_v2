import DefaultPhoto from "@/assets/images/defaultPhoto.jpg";
import Icon from "@/modules/core/components/icons/Icon";
import { formatDate } from "@/modules/core/utils/formatDate";
import dayjs from "dayjs";
import { CancelationReprogrammingMotive } from "../../../api/responses";
import { daysPassed } from "../../../utils/daysPassed";
import CalendarCard from "./CalendarCard";

interface Props {
  cancelation: CancelationReprogrammingMotive;
}

const CancelationCard = ({ cancelation }: Props) => {
  const hora_inicio = cancelation.hora_inicio_anterior.slice(0, 5);
  const hora_final = cancelation.hora_final_anterior.slice(0, 5);

  const createdAtDate = dayjs(cancelation.created_at);
  const cancelationDaysPassed = daysPassed(createdAtDate.toISOString());

  return (
    <CalendarCard>
      <CalendarCard.Body>
        <CalendarCard.Header
          minWidth="0"
          imageSrc={cancelation.foto_paciente ?? DefaultPhoto}
          headerTexts={[
            [
              {
                text: cancelation.nombre_paciente,
              },
              {
                text:
                  "Cancelado por: " +
                  cancelation.nombre_cancelador +
                  " el " +
                  formatDate(
                    createdAtDate.format("YYYY-MM-DD"),
                    createdAtDate.format("HH:mm")
                  ),
                src: cancelation.foto_cancelador ?? DefaultPhoto,
              },
              {
                text:
                  cancelationDaysPassed === 0
                    ? "Hoy"
                    : "Hace " +
                      cancelationDaysPassed +
                      ` día${cancelationDaysPassed === 1 ? "" : "s"}`,
                icon: Icon.Types.CLOCK,
                color: cancelationDaysPassed >= 29 ? "danger" : undefined,
              },
              {
                text: `Sesión: ${formatDate(
                  cancelation.fecha_anterior
                )} (${hora_inicio} - ${hora_final})`,
                icon: Icon.Types.CALENDAR,
              },
              {
                text: cancelation.descripcion,
                icon: Icon.Types.TEXT,
                lines: 3,
              },
            ],
            [],
          ]}
        />
      </CalendarCard.Body>
    </CalendarCard>
  );
};

export default CancelationCard;
