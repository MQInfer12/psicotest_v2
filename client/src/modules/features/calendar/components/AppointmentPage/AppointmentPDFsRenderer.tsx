import AnswerCardTemplate from "@/modules/features/answers/components/AnswerCardTemplate";
import ContractPDF from "./ContractPDF";
import FichaPDF from "./FichaPDF";
import DerivacionPDF from "./DerivacionPDF";
import { Appointment } from "../../api/responses";
import { User } from "@/modules/features/users/api/responses";

interface Props {
  cita: Appointment;
  paciente: User;
}

const AppointmentPDFsRenderer = ({ cita, paciente }: Props) => {
  return (
    <AnswerCardTemplate
      gridArea="tabs"
      tabs={[
        {
          title: "Contrato",
          component: (
            <ContractPDF
              user={paciente}
              fecha={cita.fecha}
              nombre_psicologo={cita.nombre_psicologo}
            />
          ),
        },
        {
          title: "Ficha",
          component: <FichaPDF cita={cita} user={paciente} />,
        },
        {
          title: "Interconsulta",
          component: <DerivacionPDF cita={cita} user={paciente} />,
        },
      ]}
    />
  );
};

export default AppointmentPDFsRenderer;
