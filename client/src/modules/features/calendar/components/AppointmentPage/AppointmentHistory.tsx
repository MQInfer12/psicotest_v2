import AnswerCardTemplate from "@/modules/features/answers/components/AnswerCardTemplate";
import { User } from "@/modules/features/users/api/responses";
import { Appointment } from "../../api/responses";
import FichaForm from "./FichaForm";

interface Props {
  cita: Appointment;
  paciente: User;
}

const AppointmentHistory = ({ cita, paciente }: Props) => {
  const tabs = [
    {
      title: "Ficha",
      component: (
        <FichaForm
          paciente={paciente}
          cita={cita}
          disabled
          onSuccess={() => {}}
          preview
        />
      ),
    },
  ];

  return <AnswerCardTemplate gridArea="tabs" tabs={tabs} />;
};

export default AppointmentHistory;
