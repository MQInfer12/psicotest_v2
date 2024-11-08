const fs = require("fs");

const texto = fs.readFileSync("dimensiones_kuder.txt", "utf-8");

const lineas = texto
  .split("\n")
  .map((linea) => linea.trim())
  .filter((linea) => linea.length > 0);

const dimensiones = lineas.map((descripcion, index) => {
  const items = [];

  const realIndex = index < 5 ? 0 : 30;

  for (let i = realIndex + (index % 5) + 1; i <= realIndex + 30; i = i + 5) {
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
