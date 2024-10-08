const fs = require("fs");

const texto = fs.readFileSync("preguntas.txt", "utf-8");

const lineas = texto
  .split("\n")
  .map((linea) => linea.trim())
  .filter((linea) => linea.length > 0);

const preguntas = lineas.map((linea, index) => {
  return {
    id: index + 1,
    descripcion: linea.split(". ")[1],
  };
});

fs.writeFileSync(
  "preguntas.json",
  JSON.stringify(preguntas, null, 2),
  "utf-8"
);
