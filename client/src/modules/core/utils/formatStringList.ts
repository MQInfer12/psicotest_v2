const formatter = new Intl.ListFormat("es", {
  type: "conjunction",
});

export const formatStringList = (array: string[]) => {
  return formatter.format(array);
};
