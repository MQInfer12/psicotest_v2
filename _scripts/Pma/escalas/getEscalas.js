const fs = require("fs");

const texto = fs.readFileSync("escala_m.txt", "utf-8");

const lineas = texto
  .split("\n")
  .map((linea) => linea.trim());

const dimensiones = [];
let id_dimension = 1;
let mapeo = {};
lineas.forEach((linea, index) => {
  console.log(linea);
  if (linea === "") {
    dimensiones.push({
      id_dimension,
      mapeo,
    });
    id_dimension++;
    mapeo = {};
  } else {
    const [val, cent] = linea.split(" ");
    mapeo[val] = cent;
  }
});

const resultado = { dimensiones };

fs.writeFileSync(
  "dimensiones.json",
  JSON.stringify(resultado, null, 2),
  "utf-8"
);

console.log("JSON generado con éxito");
