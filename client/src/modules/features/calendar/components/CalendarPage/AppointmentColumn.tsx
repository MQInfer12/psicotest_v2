import { useModal } from "@/modules/core/components/ui/modal/useModal";
import AppointmentsToCome from "./AppointmentsToCome";
import GenerateAppointment from "./GenerateAppointment";
import Button from "@/modules/core/components/ui/Button";
import Icon from "@/modules/core/components/icons/Icon";
import CancelationList from "./CancelationList";

const AppointmentColumn = () => {
  const { modal } = useModal();
  const { modal: modalCancel, setOpen: setOpenCancel } = useModal();
  /* const [showPassed, setShowPassed] = useState(false); */

  return (
    <>
      {modal("Generar sesión anónima", <GenerateAppointment />, {
        width: 500,
      })}
      {modalCancel("Sesiones canceladas (últ. 30 días)", <CancelationList />, {
        type: "floating",
        width: 480,
      })}
      <section className="flex flex-col gap-6 flex-1 overflow-hidden max-lg:w-full">
        <header className="h-10 flex items-center justify-between">
          <strong className="text-primary-900 dark:text-primary-400">
            Mis sesiones programadas
          </strong>
          <div className="flex gap-4">
            <Button
              btnType="secondary"
              danger
              icon={Icon.Types.CANCEL}
              btnSize="small"
              onClick={() => setOpenCancel(true)}
            >
              Canceladas
            </Button>
          </div>
          {/* <Button
            onClick={() => setOpen(true)}
            btnSize="small"
            btnType="secondary"
            icon={Icon.Types.CALENDAR}
            subicon={Icon.Types.ADD}
          >
            Cita anónima
          </Button> */}
          {/* <Button
            onClick={() => setShowPassed((prev) => !prev)}
            btnSize="small"
            btnType="tertiary"
            icon={Icon.Types.CALENDAR}
          >
            {showPassed ? "Ver próximas" : "Ver pasadas"}
          </Button> */}
        </header>
        <AppointmentsToCome />
        {/* {showPassed ? <AppointmentsPassed /> : <AppointmentsToCome />} */}
      </section>
    </>
  );
};

export default AppointmentColumn;
