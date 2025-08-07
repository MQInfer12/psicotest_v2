
INSERT INTO "u_users" (
  email, nombre, 
  id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'grisly_lizaraso@neurall.com', 'GRISLY LIZARASO', 
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('grisly_lizaraso@neurall.com', NOW(), NOW())
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


INSERT INTO "u_users" (
  email, nombre, 
  id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'nayely_yucra@neurall.com', 'NAYELY YUCRA', 
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('nayely_yucra@neurall.com', NOW(), NOW())
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


INSERT INTO "u_users" (
  email, nombre, 
  id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'jennifer_borda@neurall.com', 'JENNIFER BORDA', 
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('jennifer_borda@neurall.com', NOW(), NOW())
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


INSERT INTO "u_users" (
  email, nombre, 
  id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'samuel_argote@neurall.com', 'SAMUEL ARGOTE', 
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('samuel_argote@neurall.com', NOW(), NOW())
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


INSERT INTO "u_users" (
  email, nombre, 
  id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'beatriz_azurduy@neurall.com', 'BEATRIZ AZURDUY', 
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('beatriz_azurduy@neurall.com', NOW(), NOW())
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


INSERT INTO "u_users" (
  email, nombre, 
  id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'paolo_jordan@neurall.com', 'PAOLO JORDAN', 
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('paolo_jordan@neurall.com', NOW(), NOW())
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
