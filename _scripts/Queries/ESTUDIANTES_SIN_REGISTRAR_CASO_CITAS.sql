-- USUARIO 1
-- Crear el usuario
INSERT INTO "u_users" (
  email, nombre, genero, fecha_nacimiento, carrera, semestre,
  telefono, id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'isabel_cynthia_coronel_flores@neurall.com', 'ISABEL CYNTHIA CORONEL FLORES',
  'Mujer', '2007-01-15'::date, 'Psicología', 1, '71728801',
  2, NOW(), NOW(), true
);

-- Crear el caso y todas las citas en una sola operación
WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('isabel_cynthia_coronel_flores@neurall.com', NOW(), NOW())
  RETURNING id
), citas_data AS (
  SELECT * FROM (
    VALUES
      ('2025-04-02'::date, '13:00:00'::time, '14:00:00'::time, 'Primera sesión del caso', 'Primera sesión del caso'),
      ('2025-04-09'::date, '13:00:00'::time, '14:00:00'::time, 'Reconsulta', 'Reconsulta'),
      ('2025-04-17'::date, '09:00:00'::time, '10:00:00'::time, 'Reconsulta', 'Reconsulta'),
      ('2025-05-02'::date, '09:00:00'::time, '10:00:00'::time, 'Reconsulta', 'Reconsulta'),
      ('2025-05-16'::date, '09:00:00'::time, '10:00:00'::time, 'Reconsulta', 'Reconsulta')
  ) AS c(fecha, hora_inicio, hora_final, metodo, metodo_inicial)
)
INSERT INTO "c_citas" (
  id_calendar, html_link_calendar, email_psicologo, fecha,
  hora_inicio, hora_final, created_at, updated_at,
  creador_calendar, id_caso, metodo, metodo_inicial
)
SELECT
  '', '', 'veronicatapiasnacif@gmail.com', c.fecha, c.hora_inicio, c.hora_final,
  NOW(), NOW(), 'veronicatapiasnacif@gmail.com', nc.id, c.metodo, c.metodo_inicial
FROM citas_data AS c
CROSS JOIN nuevo_caso AS nc;

-- USUARIO 2
-- Crear el usuario
INSERT INTO "u_users" (
  email, nombre, genero, fecha_nacimiento, carrera, semestre,
  telefono, id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'diana_colque_tupac@neurall.com', 'DIANA COLQUE TUPAC',
  'Mujer', '2003-03-07'::date, 'Bioquímica y Farmacia', 3, '60775949',
  2, NOW(), NOW(), true
);

-- Crear el caso y todas las citas en una sola operación
WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('diana_colque_tupac@neurall.com', NOW(), NOW())
  RETURNING id
), citas_data AS (
  SELECT * FROM (
    VALUES
      ('2025-05-15'::date, '16:00:00'::time, '17:00:00'::time, 'Primera sesión del caso', 'Primera sesión del caso'),
      ('2025-05-29'::date, '16:00:00'::time, '17:00:00'::time, 'Reconsulta', 'Reconsulta')
  ) AS c(fecha, hora_inicio, hora_final, metodo, metodo_inicial)
)
INSERT INTO "c_citas" (
  id_calendar, html_link_calendar, email_psicologo, fecha,
  hora_inicio, hora_final, created_at, updated_at,
  creador_calendar, id_caso, metodo, metodo_inicial
)
SELECT
  '', '', 'veronicatapiasnacif@gmail.com', c.fecha, c.hora_inicio, c.hora_final,
  NOW(), NOW(), 'veronicatapiasnacif@gmail.com', nc.id, c.metodo, c.metodo_inicial
FROM citas_data AS c
CROSS JOIN nuevo_caso AS nc;

-- USUARIO 3
-- Crear el usuario
INSERT INTO "u_users" (
  email, nombre, genero, fecha_nacimiento, carrera, semestre,
  telefono, id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'fabricio_salvador@neurall.com', 'FABRICIO SALVADOR',
  'Hombre', '2004-06-07'::date, 'Derecho', 1, '72473838',
  2, NOW(), NOW(), true
);

-- Crear el caso y todas las citas en una sola operación
WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('fabricio_salvador@neurall.com', NOW(), NOW())
  RETURNING id
), citas_data AS (
  SELECT * FROM (
    VALUES
      ('2025-05-07'::date, '17:00:00'::time, '18:00:00'::time, 'Primera sesión del caso', 'Primera sesión del caso'),
      ('2025-05-14'::date, '17:00:00'::time, '18:00:00'::time, 'Reconsulta', 'Reconsulta')
  ) AS c(fecha, hora_inicio, hora_final, metodo, metodo_inicial)
)
INSERT INTO "c_citas" (
  id_calendar, html_link_calendar, email_psicologo, fecha,
  hora_inicio, hora_final, created_at, updated_at,
  creador_calendar, id_caso, metodo, metodo_inicial
)
SELECT
  '', '', 'veronicatapiasnacif@gmail.com', c.fecha, c.hora_inicio, c.hora_final,
  NOW(), NOW(), 'veronicatapiasnacif@gmail.com', nc.id, c.metodo, c.metodo_inicial
FROM citas_data AS c
CROSS JOIN nuevo_caso AS nc;

-- USUARIO 4
-- Crear el usuario
INSERT INTO "u_users" (
  email, nombre, genero, fecha_nacimiento, carrera, semestre,
  telefono, id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'luis_santiago_vidal_salazar@neurall.com', 'LUIS SANTIAGO VIDAL SALAZAR',
  'Hombre', '2006-11-13'::date, 'Psicología', 1, '75469896',
  2, NOW(), NOW(), true
);

-- Crear el caso y citas
WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('luis_santiago_vidal_salazar@neurall.com', NOW(), NOW())
  RETURNING id
), citas_data AS (
  SELECT * FROM (
    VALUES
      ('2025-04-13'::date, '15:00:00'::time, '16:00:00'::time, 'Primera sesión del caso', 'Primera sesión del caso'),
      ('2025-04-16'::date, '15:00:00'::time, '16:00:00'::time, 'Reconsulta', 'Reconsulta'),
      ('2025-04-23'::date, '15:00:00'::time, '16:00:00'::time, 'Reconsulta', 'Reconsulta'),
      ('2025-04-30'::date, '15:00:00'::time, '16:00:00'::time, 'Reconsulta', 'Reconsulta'),
    	('2025-05-14'::date, '15:00:00'::time, '16:00:00'::time, 'Reconsulta', 'Reconsulta')
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

-- USUARIO 5
INSERT INTO "u_users" (
  email, nombre, genero, fecha_nacimiento, carrera, semestre,
  telefono, id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'nayke_yenny_guaman_mendoza@neurall.com', 'NAYKE YENNY GUAMAN MENDOZA',
  'Mujer', '2006-06-22'::date, 'Medicina', 3, '64924816',
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('nayke_yenny_guaman_mendoza@neurall.com', NOW(), NOW())
  RETURNING id
), citas_data AS (
  SELECT * FROM (
    VALUES
      ('2025-05-13'::date, '16:00:00'::time, '17:00:00'::time, 'Primera sesión del caso', 'Primera sesión del caso'),
      ('2025-05-20'::date, '17:00:00'::time, '18:00:00'::time, 'Reconsulta', 'Reconsulta')
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

-- USUARIO 6
INSERT INTO "u_users" (
  email, nombre, genero, fecha_nacimiento, carrera, semestre,
  telefono, id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'soledad_heidi_yampasi_arze@neurall.com', 'SOLEDAD HEIDI YAMPASI ARZE',
  'Mujer', '2003-01-23'::date, 'Medicina', 7, '77941522',
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('soledad_heidi_yampasi_arze@neurall.com', NOW(), NOW())
  RETURNING id
), citas_data AS (
  SELECT * FROM (
    VALUES
      ('2025-05-13'::date, '15:00:00'::time, '16:00:00'::time, 'Primera sesión del caso', 'Primera sesión del caso'),
      ('2025-05-22'::date, '15:00:00'::time, '16:00:00'::time, 'Reconsulta', 'Reconsulta')
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

-- USUARIO 7
INSERT INTO "u_users" (
  email, nombre, genero, fecha_nacimiento, carrera, semestre,
  telefono, id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'erick_mateo_ross_montenegro@neurall.com', 'ERICK MATEO ROSS MONTENEGRO',
  'Hombre', '2003-10-23'::date, 'Diseño Gráfico', 6, '72278236',
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('erick_mateo_ross_montenegro@neurall.com', NOW(), NOW())
  RETURNING id
), citas_data AS (
  SELECT * FROM (
    VALUES
      ('2025-05-12'::date, '09:00:00'::time, '10:00:00'::time, 'Primera sesión del caso', 'Primera sesión del caso'),
      ('2025-05-19'::date, '10:00:00'::time, '11:00:00'::time, 'Reconsulta', 'Reconsulta')
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

-- USUARIO 8
INSERT INTO "u_users" (
  email, nombre, genero, fecha_nacimiento, carrera, semestre,
  telefono, id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'jassy_belen_gomez_bascope@neurall.com', 'JASSY BELEN GOMEZ BASCOPE',
  'Mujer', '2005-06-10'::date, 'Medicina', 3, '69526276',
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('jassy_belen_gomez_bascope@neurall.com', NOW(), NOW())
  RETURNING id
), citas_data AS (
  SELECT * FROM (
    VALUES
      ('2025-04-03'::date, '14:00:00'::time, '15:00:00'::time, 'Primera sesión del caso', 'Primera sesión del caso'),
      ('2025-04-10'::date, '14:00:00'::time, '15:00:00'::time, 'Reconsulta', 'Reconsulta'),
      ('2025-04-17'::date, '14:00:00'::time, '15:00:00'::time, 'Reconsulta', 'Reconsulta'),
      ('2025-05-12'::date, '10:00:00'::time, '11:00:00'::time, 'Reconsulta', 'Reconsulta')
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

-- USUARIO 9
INSERT INTO "u_users" (
  email, nombre, genero, fecha_nacimiento, carrera, semestre,
  telefono, id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'juan_carlos_medina_coca@neurall.com', 'JUAN CARLOS MEDINA COCA',
  'Hombre', '2001-05-29'::date, 'Medicina', 3, '67746814',
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('juan_carlos_medina_coca@neurall.com', NOW(), NOW())
  RETURNING id
), citas_data AS (
  SELECT * FROM (
    VALUES
      ('2025-05-09'::date, '11:00:00'::time, '12:00:00'::time, 'Primera sesión del caso', 'Primera sesión del caso'),
      ('2025-05-23'::date, '11:00:00'::time, '12:00:00'::time, 'Reconsulta', 'Reconsulta')
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


-- USUARIO 10
INSERT INTO "u_users" (
  email, nombre, genero, fecha_nacimiento, carrera, semestre,
  telefono, id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'jose_enrique_flores_chuchon@neurall.com', 'JOSE ENRIQUE FLORES CHUCHON',
  'Hombre', '2004-05-03'::date, 'Medicina', 7, '79394295',
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('jose_enrique_flores_chuchon@neurall.com', NOW(), NOW())
  RETURNING id
), citas_data AS (
  SELECT * FROM (
    VALUES
      ('2025-04-30'::date, '14:00:00'::time, '15:00:00'::time, 'Primera sesión del caso', 'Primera sesión del caso')
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

-- USUARIO 11
INSERT INTO "u_users" (
  email, nombre, genero, fecha_nacimiento, carrera, semestre,
  telefono, id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'kristelly_verastegui_urbina@neurall.com', 'KRISTELLY VERASTEGUI URBINA',
  'Mujer', '2007-04-12'::date, 'Psicología', 1, '990003574',
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('kristelly_verastegui_urbina@neurall.com', NOW(), NOW())
  RETURNING id
), citas_data AS (
  SELECT * FROM (
    VALUES
      ('2025-04-28'::date, '09:00:00'::time, '10:00:00'::time, 'Primera sesión del caso', 'Primera sesión del caso'),
      ('2025-05-02'::date, '10:00:00'::time, '11:00:00'::time, 'Reconsulta', 'Reconsulta'),
      ('2025-05-09'::date, '10:00:00'::time, '11:00:00'::time, 'Reconsulta', 'Reconsulta')
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

-- USUARIO 12
INSERT INTO "u_users" (
  email, nombre, genero, fecha_nacimiento, carrera, semestre,
  telefono, id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'alejandro_jhonny_clavera_jaldin@neurall.com', 'ALEJANDRO JHONNY CLAVERA JALDIN',
  'Hombre', '2003-12-11'::date, 'Psicología', 1, '70387813',
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('alejandro_jhonny_clavera_jaldin@neurall.com', NOW(), NOW())
  RETURNING id
), citas_data AS (
  SELECT * FROM (
    VALUES
      ('2025-05-09'::date, '09:00:00'::time, '10:00:00'::time, 'Primera sesión del caso', 'Primera sesión del caso'),
      ('2025-05-16'::date, '10:00:00'::time, '11:00:00'::time, 'Reconsulta', 'Reconsulta')
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

-- USUARIO 13
INSERT INTO "u_users" (
  email, nombre, genero, fecha_nacimiento, carrera, semestre,
  telefono, id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'carla_susan_gongora_paravicini@neurall.com', 'CARLA SUSAN GONGORA PARAVICINI',
  'Mujer', '2000-01-05'::date, 'Bioquímica y Farmacia', 5, '78609498',
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('carla_susan_gongora_paravicini@neurall.com', NOW(), NOW())
  RETURNING id
), citas_data AS (
  SELECT * FROM (
    VALUES
      ('2025-04-08'::date, '14:00:00'::time, '15:00:00'::time, 'Primera sesión del caso', 'Primera sesión del caso'),
      ('2025-04-17'::date, '15:00:00'::time, '16:00:00'::time, 'Reconsulta', 'Reconsulta'),
      ('2025-04-24'::date, '15:00:00'::time, '16:00:00'::time, 'Reconsulta', 'Reconsulta'),
      ('2025-05-08'::date, '15:00:00'::time, '16:00:00'::time, 'Reconsulta', 'Reconsulta')
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

-- USUARIO 14
INSERT INTO "u_users" (
  email, nombre, genero, fecha_nacimiento, carrera, semestre,
  telefono, id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'angela_gisselle_julia_molina_siles@neurall.com', 'ANGELA GISSELLE JULIA MOLINA SILES',
  'Mujer', '2002-01-13'::date, 'Medicina', 8, '79338553',
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('angela_gisselle_julia_molina_siles@neurall.com', NOW(), NOW())
  RETURNING id
), citas_data AS (
  SELECT * FROM (
    VALUES
      ('2025-05-07'::date, '16:00:00'::time, '17:00:00'::time, 'Primera sesión del caso', 'Primera sesión del caso'),
      ('2025-05-14'::date, '16:00:00'::time, '17:00:00'::time, 'Reconsulta', 'Reconsulta')
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

-- USUARIO 15
INSERT INTO "u_users" (
  email, nombre, genero, fecha_nacimiento, carrera, semestre,
  telefono, id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'camila_nicole_villegas_rojas@neurall.com', 'CAMILA NICOLE VILLEGAS ROJAS',
  'Mujer', '2002-10-24'::date, 'Medicina', 9, '76926027',
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('camila_nicole_villegas_rojas@neurall.com', NOW(), NOW())
  RETURNING id
), citas_data AS (
  SELECT * FROM (
    VALUES
      ('2025-05-07'::date, '15:00:00'::time, '16:00:00'::time, 'Primera sesión del caso', 'Primera sesión del caso')
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

-- USUARIO 16
INSERT INTO "u_users" (
  email, nombre, genero, fecha_nacimiento, carrera, semestre,
  telefono, id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'manuel_felipe_zapata_cespedez@neurall.com', 'MANUEL FELIPE ZAPATA CESPÉDEZ',
  'Hombre', '1997-10-24'::date, 'Psicología', 6, '60393628',
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('manuel_felipe_zapata_cespedez@neurall.com', NOW(), NOW())
  RETURNING id
), citas_data AS (
  SELECT * FROM (
    VALUES
      ('2025-04-14'::date, '10:00:00'::time, '11:00:00'::time, 'Primera sesión del caso', 'Primera sesión del caso'),
      ('2025-04-21'::date, '10:00:00'::time, '11:00:00'::time, 'Reconsulta', 'Reconsulta'),
      ('2025-04-28'::date, '10:00:00'::time, '11:00:00'::time, 'Reconsulta', 'Reconsulta'),
      ('2025-05-06'::date, '10:00:00'::time, '11:00:00'::time, 'Reconsulta', 'Reconsulta')
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

-- USUARIO 17
INSERT INTO "u_users" (
  email, nombre, genero, fecha_nacimiento, carrera, semestre,
  telefono, id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'karen_celena_quispe_arancibia@neurall.com', 'KAREN CELENA QUISPE ARANCIBIA',
  'Mujer', '2002-04-24'::date, 'Diseño Gráfico', 3, '64850987',
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('karen_celena_quispe_arancibia@neurall.com', NOW(), NOW())
  RETURNING id
), citas_data AS (
  SELECT * FROM (
    VALUES
      ('2025-04-30'::date, '17:00:00'::time, '18:00:00'::time, 'Primera sesión del caso', 'Primera sesión del caso'),
      ('2025-05-05'::date, '09:00:00'::time, '10:00:00'::time, 'Reconsulta', 'Reconsulta'),
      ('2025-05-19'::date, '09:00:00'::time, '10:00:00'::time, 'Reconsulta', 'Reconsulta')
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

-- USUARIO 18
INSERT INTO "u_users" (
  email, nombre, genero, fecha_nacimiento, carrera, semestre,
  telefono, id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'heyla_deyangela_dantas_lima@neurall.com', 'HEYLA DEYANGELA DANTAS LIMA',
  'Mujer', '1986-05-04'::date, 'Medicina', 10, '64858998',
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('heyla_deyangela_dantas_lima@neurall.com', NOW(), NOW())
  RETURNING id
), citas_data AS (
  SELECT * FROM (
    VALUES
      ('2025-04-08'::date, '15:00:00'::time, '16:00:00'::time, 'Primera sesión del caso', 'Primera sesión del caso')
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

-- USUARIO 19
INSERT INTO "u_users" (
  email, nombre, genero, fecha_nacimiento, carrera, semestre,
  telefono, id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'guery_adalberto_vocal_chavez@neurall.com', 'GUERY ADALBERTO VOCAL CHAVEZ',
  'Hombre', '2003-05-01'::date, 'Psicología', 7, '77411963',
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('guery_adalberto_vocal_chavez@neurall.com', NOW(), NOW())
  RETURNING id
), citas_data AS (
  SELECT * FROM (
    VALUES
      ('2025-04-01'::date, '15:00:00'::time, '16:00:00'::time, 'Primera sesión del caso', 'Primera sesión del caso')
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

-- USUARIO 20
INSERT INTO "u_users" (
  email, nombre, genero, fecha_nacimiento, carrera, semestre,
  telefono, id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'maria_guadalupe_arviri_saavedra@neurall.com', 'MARIA GUADALUPE ARVIRI SAAVEDRA',
  'Mujer', '2004-12-31'::date, 'Medicina', 7, '67545996',
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('maria_guadalupe_arviri_saavedra@neurall.com', NOW(), NOW())
  RETURNING id
), citas_data AS (
  SELECT * FROM (
    VALUES
      ('2025-05-12'::date, '12:00:00'::time, '13:00:00'::time, 'Primera sesión del caso', 'Primera sesión del caso'),
      ('2025-05-19'::date, '12:00:00'::time, '13:00:00'::time, 'Reconsulta', 'Reconsulta')
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

-- USUARIO 21
INSERT INTO "u_users" (
  email, nombre, genero, fecha_nacimiento, carrera, semestre,
  telefono, id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'carhim_arce@neurall.com', 'CARHIM ARCE',
  'Hombre', '2001-10-05'::date, 'Psicología', 6, '75831424',
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('carhim_arce@neurall.com', NOW(), NOW())
  RETURNING id
), citas_data AS (
  SELECT * FROM (
    VALUES
      ('2025-04-21'::date, '11:00:00'::time, '12:00:00'::time, 'Primera sesión del caso', 'Primera sesión del caso'),
      ('2025-04-28'::date, '11:00:00'::time, '12:00:00'::time, 'Reconsulta', 'Reconsulta'),
      ('2025-05-05'::date, '11:00:00'::time, '12:00:00'::time, 'Reconsulta', 'Reconsulta'),
      ('2025-05-12'::date, '11:00:00'::time, '12:00:00'::time, 'Reconsulta', 'Reconsulta')
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

-- USUARIO 22
INSERT INTO "u_users" (
  email, nombre, genero, fecha_nacimiento, carrera, semestre,
  telefono, id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'tatiana_alexandra_noya_siles@neurall.com', 'TATIANA ALEXANDRA NOYA SILES',
  'Mujer', '2025-04-01'::date, 'Diseño Gráfico', 2, '60747525',
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('tatiana_alexandra_noya_siles@neurall.com', NOW(), NOW())
  RETURNING id
), citas_data AS (
  SELECT * FROM (
    VALUES
      ('2025-04-01'::date, '13:00:00'::time, '14:00:00'::time, 'Primera sesión del caso', 'Primera sesión del caso'),
      ('2025-04-11'::date, '09:00:00'::time, '10:00:00'::time, 'Reconsulta', 'Reconsulta'),
      ('2025-04-22'::date, '14:00:00'::time, '15:00:00'::time, 'Reconsulta', 'Reconsulta'),
      ('2025-04-29'::date, '14:00:00'::time, '15:00:00'::time, 'Reconsulta', 'Reconsulta'),
      ('2025-05-06'::date, '14:00:00'::time, '15:00:00'::time, 'Reconsulta', 'Reconsulta')
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

-- USUARIO 23
INSERT INTO "u_users" (
  email, nombre, genero, fecha_nacimiento, carrera, semestre,
  telefono, id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'cristhian_eduardo_del_puerto_bustamante@neurall.com', 'CRISTHIAN EDUARDO DEL PUERTO BUSTAMANTE',
  'Hombre', '2006-07-23'::date, 'Medicina', 1, '75665032',
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('cristhian_eduardo_del_puerto_bustamante@neurall.com', NOW(), NOW())
  RETURNING id
), citas_data AS (
  SELECT * FROM (
    VALUES
      ('2025-04-02'::date, '16:00:00'::time, '17:00:00'::time, 'Primera sesión del caso', 'Primera sesión del caso'),
      ('2025-04-09'::date, '16:00:00'::time, '17:00:00'::time, 'Reconsulta', 'Reconsulta'),
      ('2025-04-16'::date, '16:00:00'::time, '17:00:00'::time, 'Reconsulta', 'Reconsulta'),
      ('2025-04-23'::date, '16:00:00'::time, '17:00:00'::time, 'Reconsulta', 'Reconsulta')
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

-- USUARIO 24
INSERT INTO "u_users" (
  email, nombre, genero, fecha_nacimiento, carrera, semestre,
  telefono, id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'pablo_fabricio_trujillo_cossio@neurall.com', 'PABLO FABRICIO TRUJILLO COSSIO',
  'Hombre', '2006-02-25'::date, 'Medicina', 1, '67407875',
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('pablo_fabricio_trujillo_cossio@neurall.com', NOW(), NOW())
  RETURNING id
), citas_data AS (
  SELECT * FROM (
    VALUES
      ('2025-04-03'::date, '15:00:00'::time, '16:00:00'::time, 'Primera sesión del caso', 'Primera sesión del caso')
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

-- USUARIO 25
-- Nota: Fecha de nacimiento no proporcionada
INSERT INTO "u_users" (
  email, nombre, genero, fecha_nacimiento, carrera, semestre,
  telefono, id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'luciana_anthonela_limpias_rojas@neurall.com', 'LUCIANA ANTHONELA LIMPIAS ROJAS',
  'Mujer', NULL, 'Medicina', 1, '69505712',
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('luciana_anthonela_limpias_rojas@neurall.com', NOW(), NOW())
  RETURNING id
), citas_data AS (
  SELECT * FROM (
    VALUES
      ('2025-04-02'::date, '14:00:00'::time, '15:00:00'::time, 'Primera sesión del caso', 'Primera sesión del caso')
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

-- USUARIO 26
-- Nota: Fecha de nacimiento no proporcionada
INSERT INTO "u_users" (
  email, nombre, genero, fecha_nacimiento, carrera, semestre,
  telefono, id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'angela_luciana_hidalgo_sanchez@neurall.com', 'ANGELA LUCIANA HIDALGO SANCHEZ',
  'Mujer', NULL, 'Medicina', 1, '77971107',
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('angela_luciana_hidalgo_sanchez@neurall.com', NOW(), NOW())
  RETURNING id
), citas_data AS (
  SELECT * FROM (
    VALUES
      ('2025-04-02'::date, '14:00:00'::time, '15:00:00'::time, 'Primera sesión del caso', 'Primera sesión del caso')
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

-- USUARIO 27
-- Nota: Fecha de nacimiento no proporcionada
INSERT INTO "u_users" (
  email, nombre, genero, fecha_nacimiento, carrera, semestre,
  telefono, id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'estefani_montano_herrera@neurall.com', 'ESTEFANI MONTANO HERRERA',
  'Mujer', NULL, 'Medicina', 1, '76412731',
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('estefani_montano_herrera@neurall.com', NOW(), NOW())
  RETURNING id
), citas_data AS (
  SELECT * FROM (
    VALUES
      ('2025-04-02'::date, '14:00:00'::time, '15:00:00'::time, 'Primera sesión del caso', 'Primera sesión del caso')
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

-- USUARIO 28
-- Nota: Fecha de nacimiento no proporcionada
INSERT INTO "u_users" (
  email, nombre, genero, fecha_nacimiento, carrera, semestre,
  telefono, id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'jhenny_mamani_clavijo@neurall.com', 'JHENNY MAMANI CLAVIJO',
  'Mujer', NULL, 'Medicina', 1, '70793436',
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('jhenny_mamani_clavijo@neurall.com', NOW(), NOW())
  RETURNING id
), citas_data AS (
  SELECT * FROM (
    VALUES
      ('2025-04-04'::date, '10:00:00'::time, '11:00:00'::time, 'Primera sesión del caso', 'Primera sesión del caso')
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

-- USUARIO 29
INSERT INTO "u_users" (
  email, nombre, genero, fecha_nacimiento, carrera, semestre,
  telefono, id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'mikaela_garcia@neurall.com', 'MIKAELA GARCIA',
  'Mujer', '2003-09-26'::date, 'Medicina', 7, '62619814',
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('mikaela_garcia@neurall.com', NOW(), NOW())
  RETURNING id
), citas_data AS (
  SELECT * FROM (
    VALUES
      ('2025-04-08'::date, '17:00:00'::time, '18:00:00'::time, 'Primera sesión del caso', 'Primera sesión del caso')
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

-- USUARIO 30
-- Nota: Teléfono no proporcionado
INSERT INTO "u_users" (
  email, nombre, genero, fecha_nacimiento, carrera, semestre,
  telefono, id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'aldrin_espinoza_heredia@neurall.com', 'ALDRIN ESPINOZA HEREDIA',
  'Hombre', '2006-07-05'::date, 'Medicina', 1, NULL,
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('aldrin_espinoza_heredia@neurall.com', NOW(), NOW())
  RETURNING id
), citas_data AS (
  SELECT * FROM (
    VALUES
      ('2025-04-09'::date, '14:00:00'::time, '15:00:00'::time, 'Primera sesión del caso', 'Primera sesión del caso')
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

-- USUARIO 31
INSERT INTO "u_users" (
  email, nombre, genero, fecha_nacimiento, carrera, semestre,
  telefono, id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'valery_mendoza_perez@neurall.com', 'VALERY MENDOZA PEREZ',
  'Mujer', '2006-02-16'::date, 'Ingeniería Comercial', 2, '74565746',
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('valery_mendoza_perez@neurall.com', NOW(), NOW())
  RETURNING id
), citas_data AS (
  SELECT * FROM (
    VALUES
      ('2025-04-06'::date, '16:00:00'::time, '17:00:00'::time, 'Primera sesión del caso', 'Primera sesión del caso')
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

-- USUARIO 32
INSERT INTO "u_users" (
  email, nombre, genero, fecha_nacimiento, carrera, semestre,
  telefono, id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'nadia_karina_mamani_vilacahua@neurall.com', 'NADIA KARINA MAMANI VILACAHUA',
  'Mujer', '2001-04-13'::date, 'Medicina', 10, '60362454',
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('nadia_karina_mamani_vilacahua@neurall.com', NOW(), NOW())
  RETURNING id
), citas_data AS (
  SELECT * FROM (
    VALUES
      ('2025-05-16'::date, '11:00:00'::time, '12:00:00'::time, 'Primera sesión del caso', 'Primera sesión del caso')
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

-- USUARIO 33
INSERT INTO "u_users" (
  email, nombre, genero, fecha_nacimiento, carrera, semestre,
  telefono, id_rol, created_at, updated_at, nombre_verificado
)
VALUES (
  'karen_mayerli_vela_condori@neurall.com', 'KAREN MAYERLI VELA CONDORI',
  'Mujer', '2003-12-23'::date, 'Psicología', 1, '75469896',
  2, NOW(), NOW(), true
);

WITH nuevo_caso AS (
  INSERT INTO "c_casos" (email_paciente, created_at, updated_at)
  VALUES ('karen_mayerli_vela_condori@neurall.com', NOW(), NOW())
  RETURNING id
), citas_data AS (
  SELECT * FROM (
    VALUES
      ('2025-05-13'::date, '17:00:00'::time, '18:00:00'::time, 'Primera sesión del caso', 'Primera sesión del caso'),
      ('2025-05-21'::date, '14:00:00'::time, '15:00:00'::time, 'Reconsulta', 'Reconsulta')
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