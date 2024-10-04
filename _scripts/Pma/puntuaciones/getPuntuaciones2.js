const fs = require("fs");

const texto = fs.readFileSync("seccion2.txt", "utf-8");

const lineas = texto
  .split("\n")
  .map((linea) => linea.trim())
  .filter((linea) => linea.length > 0);

const indexes = {
  A: 5,
  B: 6,
  C: 7,
  D: 8,
  E: 9,
  F: 10,
};

const puntuaciones = lineas.map((linea, index) => {
  const arr = linea.split(" ");
  const [pregunta, ...values] = arr;
  const preguntaId = Number(pregunta) + 50;
  return Object.keys(indexes).map((letter) => {
    return {
      puntuacion: values.includes(letter) ? 1 : -1,
      condiciones: [
        {
          id_pregunta: preguntaId,
          id_opcion: indexes[letter],
        },
      ],
    };
  });
}).flat();

fs.writeFileSync(
  "seccion2.json",
  JSON.stringify(puntuaciones, null, 2),
  "utf-8"
);
