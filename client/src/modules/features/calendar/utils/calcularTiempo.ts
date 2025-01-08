export const calcularTiempo = (horaInicio: string, horaFinal: string) => {
  const inicio = horaInicio.split(":");
  const final = horaFinal.split(":");

  const hora = parseInt(final[0]) - parseInt(inicio[0]);
  const minuto = parseInt(final[1]) - parseInt(inicio[1]);

  return `${hora > 0 ? `${hora} hora${hora !== 1 ? "s" : ""}` : ""} ${minuto > 0 ? `${minuto} minuto${minuto !== 1 ? "s" : ""}` : ""}`;
};
