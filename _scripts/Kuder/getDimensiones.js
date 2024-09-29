const fs = require("fs");

const texto = fs.readFileSync("dimensiones_kuder.txt", "utf-8");

const lineas = texto
  .split("\n")
  .map((linea) => linea.trim())
  .filter((linea) => linea.length > 0);

const dimensiones = lineas.map((descripcion, index) => {
  const items = [];
  for (let i = index + 1; i <= 60; i = i + 5) {
    for (let j = 1; j <= 5; j++) {
      items.push({
        puntuacion: j,
        condiciones: [
          {
            id_pregunta: i,
            id_opcion: j,
          },
        ],
      });
    }
  }

  return {
    id: index + 1,
    descripcion,
    abreviacion: String(index),
    items,
  };
});

const resultado = { dimensiones };

fs.writeFileSync(
  "dimensiones.json",
  JSON.stringify(resultado, null, 2),
  "utf-8"
);

console.log("JSON generado con éxito");
