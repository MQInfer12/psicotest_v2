export const daysPassed = (dateStr: string) => {
  const date = new Date(dateStr);
  const today = new Date();
  const timeDiff = today.getTime() - date.getTime();
  const daysPassed = Math.floor(timeDiff / (1000 * 3600 * 24));
  return daysPassed;
};
