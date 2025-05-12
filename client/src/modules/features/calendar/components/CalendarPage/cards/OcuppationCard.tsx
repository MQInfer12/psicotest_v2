import Icon from "@/modules/core/components/icons/Icon";
import { Ocuppation } from "../../../api/responses";
import CalendarCard from "./CalendarCard";

interface Props {
  ocupacion: Ocuppation;
  onClick: () => void;
}

const OcuppationCard = ({ ocupacion, onClick }: Props) => {
  const hora_inicio = ocupacion.hora_inicio.slice(0, 5);
  const hora_final = ocupacion.hora_final.slice(0, 5);

  return (
    <CalendarCard onClick={onClick} title={ocupacion.descripcion}>
      <CalendarCard.Aside date={ocupacion.fecha} />
      <CalendarCard.Body>
        <CalendarCard.Header
          minWidth="0"
          headerTexts={[
            [
              {
                text: `${hora_inicio} - ${hora_final}`,
                icon: Icon.Types.CLOCK,
              },
              {
                text: ocupacion.descripcion,
                icon: Icon.Types.TEXT,
              },
            ],
            [],
          ]}
        />
      </CalendarCard.Body>
      {ocupacion.citas_colindantes_count > 0 && (
        <CalendarCard.Danger
          text={`${ocupacion.citas_colindantes_count} cita
            ${
              ocupacion.citas_colindantes_count === 1 ? "" : "s"
            } en este horario`}
        />
      )}
    </CalendarCard>
  );
};

export default OcuppationCard;
