export function getRelativeTime(date: string) {
  const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

  const now = new Date();
  const dateObj = new Date(date);

  const diff = now.getTime() - dateObj.getTime(); // Diferencia en milisegundos

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (Math.abs(years) >= 1) return rtf.format(-years, "year");
  if (Math.abs(months) >= 1) return rtf.format(-months, "month");
  if (Math.abs(weeks) >= 1) return rtf.format(-weeks, "week");
  if (Math.abs(days) >= 1) return rtf.format(-days, "day");
  if (Math.abs(hours) >= 1) return rtf.format(-hours, "hour");
  if (Math.abs(minutes) >= 1) return rtf.format(-minutes, "minute");
  return rtf.format(seconds * -1, "second");
}
