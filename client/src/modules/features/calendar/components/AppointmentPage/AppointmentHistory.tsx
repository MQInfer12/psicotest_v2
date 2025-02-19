import AnswerCardTemplate from "@/modules/features/answers/components/AnswerCardTemplate";
import { User } from "@/modules/features/users/api/responses";
import { Appointment } from "../../api/responses";
import DerivacionForm from "./DerivacionForm";
import FichaForm from "./FichaForm";

interface Props {
  cita: Appointment;
  paciente: User;
}

const AppointmentHistory = ({ cita, paciente }: Props) => {
  const tabs = [
    {
      title: "Ficha",
      component: <FichaForm cita={cita} disabled onSuccess={() => {}} />,
    },
  ];

  if (cita.derivado_a) {
    tabs.push({
      title: "Derivación",
      component: (
        <DerivacionForm
          disabled
          user={paciente}
          cita={cita}
          onSuccess={() => {}}
        />
      ),
    });
  }

  return <AnswerCardTemplate gridArea="tabs" tabs={tabs} />;
};

export default AppointmentHistory;
