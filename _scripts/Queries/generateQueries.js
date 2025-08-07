const fs = require("fs");

const input = `
Grisly lizaraso
03-07-25
Nayely yucra 
12-06-25
Jennifer borda
23-06-25
Samuel argote 
13-06-25
Beatriz azurduy 
02-07-25
Paolo Jordan
03-07-25
`;

function formatName(name) {
  return name.trim().toUpperCase().replace(/\s+/g, " ");
}

function generateEmail(name) {
  return name.toLowerCase().replace(/\s+/g, "_") + "@neurall.com";
}

function parseInput(raw) {
  const lines = raw.trim().split("\n");
  const entries = [];

  for (let i = 0; i < lines.length; i += 2) {
    const name = lines[i].trim();
    const dateParts = lines[i + 1].trim().split("-");
    const [day, month, year] = dateParts;
    const fullDate = `20${year}-${month}-${day}`;
    entries.push({ name, birthDate: fullDate });
  }

  return entries;
}

function generateSQL({ name, birthDate }) {
  const formattedName = formatName(name);
  const email = generateEmail(name);

  return `
INSERT INTO "u_users" (
  email, nombre, 
  id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  '${email}', '${formattedName}', 
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('${email}', NOW(), NOW())
  RETURNING id
), citas_data AS (
  SELECT * FROM (
    VALUES
      ('2025-07-13'::date, '06:00:00'::time, '07:00:00'::time, 'Primera sesión del caso', 'Primera sesión del caso')
  ) AS c(fecha, hora_inicio, hora_final, metodo, metodo_inicial)
)
INSERT INTO "c_citas" (
  id_calendar, html_link_calendar, email_psicologo, fecha,
  hora_inicio, hora_final, created_at, updated_at,
  creador_calendar, id_caso, metodo, metodo_inicial
)
SELECT '', '', 'veronicatapiasnacif@gmail.com', c.fecha, c.hora_inicio, c.hora_final,
       NOW(), NOW(), 'veronicatapiasnacif@gmail.com', nc.id, c.metodo, c.metodo_inicial
FROM citas_data AS c CROSS JOIN nuevo_caso AS nc;
`;
}

const entries = parseInput(input);
const fullScript = entries.map(generateSQL).join("\n");

// Guardar en archivo
fs.writeFileSync("output.sql", fullScript);

console.log("Archivo output.sql generado exitosamente.");
