export function measureAge(fechaNacimiento: string, fechaLimite: string) {
  let nacimiento = new Date(fechaNacimiento);
  let limite = new Date(fechaLimite);
  let edad = limite.getFullYear() - nacimiento.getFullYear();

  let mesNacimiento = nacimiento.getMonth();
  let diaNacimiento = nacimiento.getDate();

  if (
    limite.getMonth() < mesNacimiento ||
    (limite.getMonth() === mesNacimiento && limite.getDate() < diaNacimiento)
  ) {
    edad--;
  }

  return edad;
}
