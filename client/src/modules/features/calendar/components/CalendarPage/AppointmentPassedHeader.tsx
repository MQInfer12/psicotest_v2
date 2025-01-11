import AppointmentPassedFilters from "./AppointmentPassedFilters";

const AppointmentPassedHeader = () => {
  return (
    <div className="flex justify-between gap-2">
      <AppointmentPassedFilters />
    </div>
  );
};

export default AppointmentPassedHeader;
