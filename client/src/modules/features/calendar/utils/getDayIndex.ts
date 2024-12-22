import { Dayjs } from "dayjs";

export const getDayIndex = (day: Dayjs) => {
  return day.day() === 0 ? 6 : day.day() - 1;
};
