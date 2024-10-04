const fs = require("fs");

const texto = fs.readFileSync("seccion1.txt", "utf-8");

const lineas = texto
  .split("\n")
  .map((linea) => linea.trim())
  .filter((linea) => linea.length > 0);

const indexes = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
};

const puntuaciones = lineas.map((linea, index) => {
  return {
    puntuacion: 1,
    condiciones: [
      {
        id_pregunta: Number(linea.split(" ")[0]),
        id_opcion: indexes[linea.split(" ")[1]],
      },
    ],
  };
});

fs.writeFileSync(
  "seccion1.json",
  JSON.stringify(puntuaciones, null, 2),
  "utf-8"
);
