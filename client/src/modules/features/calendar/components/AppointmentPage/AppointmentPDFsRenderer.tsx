import AnswerCardTemplate from "@/modules/features/answers/components/AnswerCardTemplate";
import ContractPDF from "./ContractPDF";
import FichaPDF from "./FichaPDF";
import DerivacionPDF from "./DerivacionPDF";
import { Appointment } from "../../api/responses";
import { User } from "@/modules/features/users/api/responses";
import IconMessage from "@/modules/core/components/icons/IconMessage";
import Icon from "@/modules/core/components/icons/Icon";

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
          component: cita.metodo ? (
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
        {
          title: "Interconsulta",
          component: cita.derivado_a ? (
            <DerivacionPDF cita={cita} user={paciente} />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <IconMessage
                icon={Icon.Types.PDF}
                message="Llena el formulario de derivación para ver este reporte"
                small="Puedes hacerlo desde la sección de 'Derivación'"
              />
            </div>
          ),
        },
      ]}
    />
  );
};

export default AppointmentPDFsRenderer;
