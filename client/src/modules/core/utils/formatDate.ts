export const formatDate = (date: string) => {

  const MONTHS = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  const _date = new Date(`${date.split("T")[0]}T00:00:00Z`);

  if (isNaN(_date.getTime())) {
    return "-";
  }

  const day = _date.getUTCDate();
  const month = MONTHS[_date.getUTCMonth()];
  const year = _date.getUTCFullYear();

  return `${day} ${month}, ${year}`;
};
