export const getTimeObject = (time: string) => {
  const date = new Date();
  const [hours, minutes] = time.split(":");
  date.setHours(Number(hours), Number(minutes), 0, 0);
  return date;
};
