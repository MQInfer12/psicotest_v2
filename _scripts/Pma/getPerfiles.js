const fs = require("fs");

const texto = fs.readFileSync("perfiles.txt", "utf-8");

const lineas = texto.split("\n").map((linea) => linea.trim());

let objs = [];
let title = "";
let strs = [];

lineas.forEach((linea, index) => {
  if (linea === "") {
    objs.push({
      type: "paragraph",
      content: `{${title}: ${strs.join(", ")}}}`,
    });
    strs = [];
  } else if (!linea.includes("•")) {
    title = linea.toLocaleUpperCase();
  } else {
    strs.push(`${linea.replace("• ", "").toLocaleLowerCase()}`);
  }
});

fs.writeFileSync("perfiles.json", JSON.stringify(objs, null, 2), "utf-8");

console.log("JSON generado con éxito");
