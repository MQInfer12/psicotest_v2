import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import AppointmentsToCome from "./AppointmentsToCome";
import { useState } from "react";
import AppointmentsPassed from "./AppointmentsPassed";

const AppointmentColumn = () => {
  const [showPassed, setShowPassed] = useState(false);

  return (
    <section className="flex flex-col gap-6 flex-1 overflow-hidden max-lg:w-full">
      <header className="h-10 flex items-center justify-between">
        <strong className="text-primary-900 dark:text-primary-400">
          Mis citas programadas
        </strong>
        <Button
          onClick={() => setShowPassed((prev) => !prev)}
          btnSize="small"
          btnType="tertiary"
          icon={Icon.Types.CALENDAR}
        >
          {showPassed ? "Ver próximas" : "Ver pasadas"}
        </Button>
      </header>
      {showPassed ? <AppointmentsPassed /> : <AppointmentsToCome />}
    </section>
  );
};

export default AppointmentColumn;
