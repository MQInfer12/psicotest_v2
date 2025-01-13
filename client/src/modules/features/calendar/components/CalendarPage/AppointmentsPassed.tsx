import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { motion } from "framer-motion";
import AppointmentsTable from "./AppointmentsTable";

const AppointmentsPassed = () => {
  const { fetchData } = useFetch();
  const { data } = fetchData("GET /cita", {
    params: {
      previous: "true",
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col"
    >
      <AppointmentsTable data={data} />
    </motion.div>
  );
};

export default AppointmentsPassed;
