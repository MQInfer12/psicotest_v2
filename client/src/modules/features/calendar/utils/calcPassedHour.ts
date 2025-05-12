import dayjs from "dayjs";

export const calcPassedHour = (date: string, hour: string) => {
  const appointmentHour = dayjs(date + "T" + hour);
  const currentHour = dayjs();
  return currentHour.isAfter(appointmentHour, "second");
};
