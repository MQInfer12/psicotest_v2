const fs = require("fs");
const preguntas = require("./seccion3items.json");

function getOptionId(descripcion, contenido) {
  const regex = new RegExp(`<op(\\d+)>(.*?)</op\\d+>`, "gi");
  let resultado;

  while ((resultado = regex.exec(descripcion)) !== null) {
    const [, id, valor] = resultado;
    if (valor.trim() === contenido) {
      return parseInt(id, 10);
    }
  }

  return null;
}

const texto = fs.readFileSync("seccion3.txt", "utf-8");

const lineasRespuesta = texto
  .split("\n")
  .map((linea) => linea.trim())
  .filter((linea) => linea.length > 0);

const puntuaciones = lineasRespuesta.map((linea, index) => {
  const [preguntaIndex, respuesta] = linea.split(" ");
  const idPregunta = Number(preguntaIndex) + 70;

  const pregunta = preguntas.find((p) => p.id === idPregunta).descripcion || "";

  const idOpcion = getOptionId(pregunta, respuesta.toLocaleLowerCase());

  return {
    puntuacion: 1,
    condiciones: [
      {
        id_pregunta: idPregunta,
        id_opcion: idOpcion,
      },
    ],
  };
});

fs.writeFileSync(
  "seccion3.json",
  JSON.stringify(puntuaciones, null, 2),
  "utf-8"
);
