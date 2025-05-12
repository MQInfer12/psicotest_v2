import Icon from "@/modules/core/components/icons/Icon";
import IconMessage from "@/modules/core/components/icons/IconMessage";
import AnswerCardTemplate from "@/modules/features/answers/components/AnswerCardTemplate";
import { User } from "@/modules/features/users/api/responses";
import { Appointment } from "../../api/responses";
import FichaPDF from "./FichaPDF";

interface Props {
  cita: Appointment;
  paciente: User;
}

const AppointmentPDFsRenderer = ({ cita, paciente }: Props) => {
  const TABS = [
    {
      title: "Reporte",
      component: cita.observaciones ? (
        <FichaPDF cita={cita} user={paciente} />
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <IconMessage
            icon={Icon.Types.PDF}
            message="Llena el formulario de ficha para ver este reporte"
            small="Puedes hacerlo desde la sección de 'Ficha'"
          />
        </div>
      ),
    },
  ];

  return <AnswerCardTemplate gridArea="tabs" tabs={TABS} />;
};

export default AppointmentPDFsRenderer;
