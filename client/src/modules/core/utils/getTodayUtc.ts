export const getTodayUtc = (withHour?: boolean) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const monthWithZero = month + 1 > 10 ? month : `0${month}`;
  const day = today.getDate();
  const dayWithZero = day + 1 > 10 ? day : `0${day}`;
  const hour = today.getHours();
  const hourWithZero = hour + 1 > 10 ? hour : `0${hour}`;
  const minutes = today.getMinutes();
  const minutesWithZero = minutes + 1 > 10 ? minutes : `0${minutes}`;
  const fullHour = `${hourWithZero}:${minutesWithZero}`;
  if (withHour) {
    return `${year}-${monthWithZero}-${dayWithZero} ${fullHour}`;
  }
  return `${year}-${monthWithZero}-${dayWithZero}`;
};
