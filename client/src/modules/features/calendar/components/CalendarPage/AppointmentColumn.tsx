import { useModal } from "@/modules/core/components/ui/modal/useModal";
import AppointmentsToCome from "./AppointmentsToCome";
import GenerateAppointment from "./GenerateAppointment";

const AppointmentColumn = () => {
  const { modal } = useModal();
  /* const [showPassed, setShowPassed] = useState(false); */

  return (
    <>
      {modal("Generar cita anónima", <GenerateAppointment />, {
        width: 500,
      })}
      <section className="flex flex-col gap-6 flex-1 overflow-hidden max-lg:w-full">
        <header className="h-10 flex items-center justify-between">
          <strong className="text-primary-900 dark:text-primary-400">
            Mis citas programadas
          </strong>
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
