/* ==================================================================================================
   OBLIGATORIO: SISTEMA DE GESTIÓN ACADÉMICA – UCU
   INSERCIONES INICIALES DE DATOS
   Materia: Bases de Datos 1 – Segundo Semestre 2025
   Autores: Joaquín Viola, Sebastián Mártony y Esteban Durán
   Descripción:
     Archivo destinado a poblar el Sistema de Gestión Académica con datos iniciales coherentes y
     realistas, incluyendo participantes, programas académicos, edificios del Campus Montevideo,
     salas, turnos y reservas, con el fin de facilitar pruebas, validaciones y demostraciones.
   ================================================================================================== */

USE
gestion_academica;

-- =======================================
-- LOGIN
-- =======================================
INSERT INTO login (correo, contraseña)
VALUES ('juan.perez@ucu.edu.uy', '1234seguro'),
       ('maria.garcia@ucu.edu.uy', 'clave2025'),
       ('ana.silva@ucu.edu.uy', 'ucuPass!'),
       ('rodrigo.fernandez@ucu.edu.uy', 'abcd1234'),
       ('sofia.mendez@ucu.edu.uy', 'docente2025');

-- =======================================
-- PARTICIPANTES
-- =======================================
INSERT INTO participante (ci, nombre, apellido, email)
VALUES (48923123, 'Juan', 'Pérez', 'juan.perez@ucu.edu.uy'),
       (52201984, 'María', 'García', 'maria.garcia@ucu.edu.uy'),
       (43782910, 'Ana', 'Silva', 'ana.silva@ucu.edu.uy'),
       (49011892, 'Rodrigo', 'Fernández', 'rodrigo.fernandez@ucu.edu.uy'),
       (40298377, 'Sofía', 'Méndez', 'sofia.mendez@ucu.edu.uy'),
       (45111223, 'Carlos', 'López', 'carlos.lopez@ucu.edu.uy'),
       (46293847, 'Lucía', 'Suárez', 'lucia.suarez@ucu.edu.uy');

-- =======================================
-- FACULTADES
-- =======================================
INSERT INTO facultad (nombre)
VALUES ('Facultad de Ciencias Empresariales'),
       ('Facultad de Ingeniería y Tecnologías'),
       ('Facultad de Psicología'),
       ('Facultad de Derecho'),
       ('Facultad de Ciencias Humanas');

-- =======================================
-- PROGRAMAS ACADÉMICOS
-- =======================================
INSERT INTO programa_academico (nombre_programa, id_facultad, tipo)
VALUES ('Administración de Empresas', 1, 'grado'),
       ('Contador Público', 1, 'grado'),
       ('Ingeniería en Informática', 2, 'grado'),
       ('Maestría en Psicología Organizacional', 3, 'posgrado'),
       ('Derecho', 4, 'grado'),
       ('Licenciatura en Educación', 5, 'grado'),
       ('Diploma en Gestión Educativa', 5, 'posgrado');

-- =======================================
-- PARTICIPANTE - PROGRAMA ACADÉMICO
-- =======================================
INSERT INTO participante_programa_academico (ci_participante, nombre_programa, rol)
VALUES (48923123, 'Ingeniería en Informática', 'alumno'),
       (52201984, 'Administración de Empresas', 'alumno'),
       (43782910, 'Maestría en Psicología Organizacional', 'alumno'),
       (49011892, 'Ingeniería en Informática', 'docente'),
       (40298377, 'Licenciatura en Educación', 'docente'),
       (45111223, 'Derecho', 'alumno'),
       (46293847, 'Contador Público', 'alumno');

-- =======================================
-- EDIFICIOS (Campus Montevideo)
-- =======================================
INSERT INTO edificio (nombre_edificio, direccion, departamento)
VALUES ('San José', 'Av. 8 de Octubre 2738', 'Montevideo'),
       ('Sacré Coeur', 'Av. 8 de Octubre 2750', 'Montevideo'),
       ('Semprún', 'Av. 8 de Octubre 2740', 'Montevideo'),
       ('Mullin', 'Av. 8 de Octubre 2760', 'Montevideo'),
       ('San Ignacio', 'Av. 8 de Octubre 2770', 'Montevideo'),
       ('Athanasius', 'Av. 8 de Octubre 2780', 'Montevideo'),
       ('Madre Marta', 'Av. 8 de Octubre 2790', 'Montevideo'),
       ('Xalambrí', 'Av. 8 de Octubre 2800', 'Montevideo');

-- =======================================
-- SALAS
-- =======================================
INSERT INTO sala (nombre_sala, edificio, capacidad, tipo_sala)
VALUES ('Laboratorio 1', 'San José', 30, 'posgrado'),
       ('Laboratorio 2', 'San José', 25, 'posgrado'),
       ('Aula Magna', 'Semprún', 120, 'libre'),
       ('Sala Docentes 1', 'Mullin', 15, 'docente'),
       ('Aula 101', 'Sacré Coeur', 40, 'libre'),
       ('Aula 202', 'Sacré Coeur', 35, 'libre'),
       ('Auditorio Central', 'San Ignacio', 200, 'libre'),
       ('Sala de Reuniones', 'Athanasius', 10, 'docente');

-- =======================================
-- TURNOS (De 1 hora entre 08:00 y 23:00)
-- =======================================
INSERT INTO turno (hora_inicio, hora_fin)
VALUES ('08:00:00', '09:00:00'),
       ('09:00:00', '10:00:00'),
       ('10:00:00', '11:00:00'),
       ('11:00:00', '12:00:00'),
       ('12:00:00', '13:00:00'),
       ('13:00:00', '14:00:00'),
       ('14:00:00', '15:00:00'),
       ('15:00:00', '16:00:00'),
       ('16:00:00', '17:00:00'),
       ('17:00:00', '18:00:00'),
       ('18:00:00', '19:00:00'),
       ('19:00:00', '20:00:00'),
       ('20:00:00', '21:00:00'),
       ('21:00:00', '22:00:00'),
       ('22:00:00', '23:00:00');

-- =======================================
-- RESERVAS
-- =======================================
INSERT INTO reserva (nombre_sala, edificio, fecha, id_turno, estado)
VALUES ('Laboratorio 1', 'San José', '2025-05-10', 1, 'finalizada'),
       ('Aula Magna', 'Semprún', '2025-05-11', 2, 'finalizada'),
       ('Aula 101', 'Sacré Coeur', '2025-05-12', 3, 'activa'),
       ('Sala Docentes 1', 'Mullin', '2025-05-13', 4, 'activa'),
       ('Auditorio Central', 'San Ignacio', '2025-05-14', 5, 'activa'),
       ('Sala de Reuniones', 'Athanasius', '2025-05-14', 2, 'cancelada');

-- =======================================
-- RESERVA - PARTICIPANTE
-- =======================================
INSERT INTO reserva_participante (ci_participante, id_reserva, fecha_solicitud_reserva, asistencia)
VALUES (48923123, 1, '2025-05-09 10:00:00', TRUE),
       (52201984, 2, '2025-05-10 12:30:00', TRUE),
       (49011892, 4, '2025-05-12 08:00:00', TRUE),
       (43782910, 3, '2025-05-11 09:45:00', FALSE),
       (40298377, 4, '2025-05-12 10:15:00', TRUE),
       (46293847, 5, '2025-05-12 11:00:00', TRUE);

-- =======================================
-- SANCIONES
-- =======================================
INSERT INTO sancion_participante (ci_participante, fecha_inicio, fecha_fin)
VALUES (43782910, '2025-05-13', '2025-05-20'), -- por inasistencia
       (46293847, '2025-05-15', '2025-05-18'); -- por cancelación tardía

-- ======================================== FIN DEL ARCHIVO ===========================================
