import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";

const AppointmentReprogramming = () => {
  return (
    <div className="p-4 flex flex-col gap-4 items-center justify-center h-full">
      <small className="w-full text-alto-950 dark:text-alto-50 opacity-60 leading-relaxed text-center">
        Si deseas reprogramar la cita, por favor contacta con el paciente para
        mantenerle informado.
      </small>
      <div className="flex gap-4">
        <Button btnType="secondary" btnSize="small" icon={Icon.Types.WHATSAPP}>
          Whatsapp
        </Button>
        <Button btnType="secondary" btnSize="small" icon={Icon.Types.MAIL}>
          Correo electrónico
        </Button>
      </div>
      <small className="w-full text-alto-950 dark:text-alto-50 opacity-60 leading-relaxed text-center">
        Una vez el paciente haya sido contactado con éxito, puedes reprogramar o
        cancelar la cita.
      </small>
      <div className="flex gap-4">
        <Button btnSize="small" icon={Icon.Types.CALENDAR}>
          Reprogramar
        </Button>
        <Button
          btnType="secondary"
          danger
          btnSize="small"
          icon={Icon.Types.CANCEL}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default AppointmentReprogramming;
