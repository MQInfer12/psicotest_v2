import { useFloating } from "@floating-ui/react";
import { Schedule } from "../api/responses";
import { useState } from "react";
import { motion } from "framer-motion";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toasts";
import { SetData } from "@/modules/core/hooks/useFetch/getSetData";
import { useUserContext } from "../../auth/context/UserContext";
import clsx from "clsx";

interface Props {
  schedule: Schedule;
  setData: SetData<Schedule[]>;
}

const ScheduleMarker = ({ schedule, setData }: Props) => {
  const { user } = useUserContext();

  const { postData } = useFetch();
  const mutation = postData("DELETE /horario/:id");

  const [open, setOpen] = useState(false);
  const { refs, floatingStyles } = useFloating({
    placement: "top",
    open,
  });

  const totalMinutes = 24 * 60;

  const [hh1, mm1] = schedule.hora_inicio.split(":");
  const minutesOfStart = Number(hh1) * 60 + Number(mm1);
  const startPercentage = (100 * minutesOfStart) / totalMinutes;

  const [hh2, mm2] = schedule.hora_final.split(":");
  const minutesOfEnd = Number(hh2) * 60 + Number(mm2);
  const endPercentage = (100 * minutesOfEnd) / totalMinutes;

  const handleDelete = () => {
    if (user?.email !== schedule.email_user) return;
    toastConfirm("¿Quieres eliminar este horario?", () => {
      mutation(null, {
        params: { id: schedule.id },
        onSuccess(res) {
          setData((prev) => prev.filter((v) => v.id !== schedule.id));
          toastSuccess(res.message);
        },
      });
    });
  };

  return (
    <>
      <button
        ref={refs.setReference}
        style={{
          left: `${startPercentage}%`,
          width: `${endPercentage - startPercentage}%`,
        }}
        className={clsx(
          "h-full absolute bottom-0 border-r border-l border-alto-50 dark:border-alto-1000",
          {
            "cursor-default": user?.email !== schedule.email_user,
            "bg-primary-700 dark:bg-primary-400":
              user?.email === schedule.email_user,
            "bg-alto-300 dark:bg-alto-600": user?.email !== schedule.email_user,
          }
        )}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={handleDelete}
      />
      {open && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className="z-10 pb-1"
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-alto-50 dark:bg-alto-1000 py-1 px-2 rounded-lg shadow-lg shadow-alto-950/20 dark:shadow-alto-50/10 origin-bottom max-w-40 flex flex-col items-center"
          >
            <small className="text-alto-950 dark:text-alto-50">
              {hh1}:{mm1} - {hh2}:{mm2}
            </small>
            <p className="w-full text-primary-500 dark:text-primary-400 font-bold text-xs whitespace-nowrap overflow-hidden text-ellipsis">
              {schedule.nombre_user}
            </p>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ScheduleMarker;
