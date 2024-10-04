const fs = require("fs");

const texto = fs.readFileSync("seccion4.txt", "utf-8");

const lineas = texto
  .split("\n")
  .map((linea) => linea.trim())
  .filter((linea) => linea.length > 0);

const indexes = {
  B: 16,
  M: 17,
};

const puntuaciones = lineas
  .map((linea, index) => {
    const arr = linea.split(" ");
    const [pregunta, correct] = arr;
    const preguntaId = Number(pregunta) + 100;
    return Object.keys(indexes).map((letter) => {
      return {
        puntuacion: correct === letter ? 1 : -1,
        condiciones: [
          {
            id_pregunta: preguntaId,
            id_opcion: indexes[letter],
          },
        ],
      };
    });
  })
  .flat();

fs.writeFileSync(
  "seccion4.json",
  JSON.stringify(puntuaciones, null, 2),
  "utf-8"
);
