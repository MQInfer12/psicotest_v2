import { Dayjs } from "dayjs";
import { DAYS } from "../data/days";
import { MONTHS } from "../data/months";

export const stringFromDate = (day: Dayjs) => {
  return {
    day: DAYS[day.day() === 0 ? 6 : day.day() - 1].dia,
    date: day.format("D"),
    month: MONTHS[day.month()],
    year: day.format("YYYY"),
  };
};
