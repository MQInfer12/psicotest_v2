export function numberToRoman(num: number) {
  if (num < 1 || num > 50) {
    return "El número debe estar entre 1 y 50";
  }

  const valores = [
    { numero: 50, romano: "L" },
    { numero: 40, romano: "XL" },
    { numero: 10, romano: "X" },
    { numero: 9, romano: "IX" },
    { numero: 5, romano: "V" },
    { numero: 4, romano: "IV" },
    { numero: 1, romano: "I" },
  ];

  let resultado = "";

  for (const { numero, romano } of valores) {
    while (num >= numero) {
      resultado += romano;
      num -= numero;
    }
  }

  return resultado;
}
