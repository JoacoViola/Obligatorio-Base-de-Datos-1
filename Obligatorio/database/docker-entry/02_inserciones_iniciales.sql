/* ==================================================================================================
   OBLIGATORIO: SISTEMA DE GESTION ACADEMICA – UCU
   INSERCIONES INICIALES DE DATOS
================================================================================================== */

USE gestion_academica;

-- LOGIN
INSERT INTO login (correo, contrasenia) VALUES
('juan.perez@ucu.edu.uy', '1234seguro'),
('maria.garcia@ucu.edu.uy', 'clave2025'),
('ana.silva@ucu.edu.uy', 'ucuPass!'),
('rodrigo.fernandez@ucu.edu.uy', 'abcd1234'),
('sofia.mendez@ucu.edu.uy', 'docente2025'),
('carlos.lopez@ucu.edu.uy', 'carlitos183'),
('lucia.suarez@ucu.edu.uy', 'lusua321');

-- PARTICIPANTES
INSERT INTO participante (ci, nombre, apellido, email) VALUES
(48923123, 'Juan', 'Perez', 'juan.perez@ucu.edu.uy'),
(52201984, 'Maria', 'Garcia', 'maria.garcia@ucu.edu.uy'),
(43782910, 'Ana', 'Silva', 'ana.silva@ucu.edu.uy'),
(49011892, 'Rodrigo', 'Fernandez', 'rodrigo.fernandez@ucu.edu.uy'),
(40298377, 'Sofia', 'Mendez', 'sofia.mendez@ucu.edu.uy'),
(45111223, 'Carlos', 'Lopez', 'carlos.lopez@ucu.edu.uy'),
(46293847, 'Lucia', 'Suarez', 'lucia.suarez@ucu.edu.uy');

-- FACULTADES
INSERT INTO facultad (nombre) VALUES
('Facultad de Ciencias Empresariales'),
('Facultad de Ingenieria y Tecnologias'),
('Facultad de Psicologia'),
('Facultad de Derecho'),
('Facultad de Ciencias Humanas');

-- PROGRAMAS ACADEMICOS
INSERT INTO programa_academico (nombre_programa, id_facultad, tipo) VALUES
('Administracion de Empresas', 1, 'grado'),
('Contador Publico', 1, 'grado'),
('Ingenieria en Informatica', 2, 'grado'),
('Maestria en Psicologia Organizacional', 3, 'posgrado'),
('Derecho', 4, 'grado'),
('Licenciatura en Educacion', 5, 'grado'),
('Diploma en Gestion Educativa', 5, 'posgrado');

-- PARTICIPANTE - PROGRAMA
INSERT INTO participante_programa_academico (ci_participante, nombre_programa, rol) VALUES
(48923123, 'Ingenieria en Informatica', 'alumno'),
(52201984, 'Administracion de Empresas', 'alumno'),
(43782910, 'Maestria en Psicologia Organizacional', 'alumno'),
(49011892, 'Ingenieria en Informatica', 'docente'),
(40298377, 'Licenciatura en Educacion', 'docente'),
(45111223, 'Derecho', 'alumno'),
(46293847, 'Contador Publico', 'alumno');

-- EDIFICIOS
INSERT INTO edificio (nombre_edificio, direccion, departamento) VALUES
('San Jose', 'Av. 8 de Octubre 2738', 'Montevideo'),
('Sacre Coeur', 'Av. 8 de Octubre 2750', 'Montevideo'),
('Semprun', 'Av. 8 de Octubre 2740', 'Montevideo'),
('Mullin', 'Av. 8 de Octubre 2760', 'Montevideo'),
('San Ignacio', 'Av. 8 de Octubre 2770', 'Montevideo'),
('Athanasius', 'Av. 8 de Octubre 2780', 'Montevideo'),
('Madre Marta', 'Av. 8 de Octubre 2790', 'Montevideo'),
('Xalambri', 'Av. 8 de Octubre 2800', 'Montevideo');

-- SALAS
INSERT INTO sala (nombre_sala, edificio, capacidad, tipo_sala) VALUES
('Laboratorio 1', 'San Jose', 30, 'posgrado'),
('Laboratorio 2', 'San Jose', 25, 'posgrado'),
('Aula Magna', 'Semprun', 120, 'libre'),
('Sala Docentes 1', 'Mullin', 15, 'docente'),
('Aula 101', 'Sacre Coeur', 40, 'libre'),
('Aula 202', 'Sacre Coeur', 35, 'libre'),
('Auditorio Central', 'San Ignacio', 200, 'libre'),
('Sala de Reuniones', 'Athanasius', 10, 'docente');

-- TURNOS
INSERT INTO turno (hora_inicio, hora_fin) VALUES
('08:00:00', '09:00:00'),
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

-- RESERVAS
INSERT INTO reserva (nombre_sala, edificio, fecha, id_turno, estado) VALUES
('Laboratorio 1', 'San Jose', '2025-05-10', 1, 'finalizada'),
('Aula Magna', 'Semprun', '2025-05-11', 2, 'finalizada'),
('Aula 101', 'Sacre Coeur', '2025-05-12', 3, 'activa'),
('Sala Docentes 1', 'Mullin', '2025-05-13', 4, 'activa'),
('Auditorio Central', 'San Ignacio', '2025-05-14', 5, 'activa'),
('Sala de Reuniones', 'Athanasius', '2025-05-14', 2, 'cancelada');

-- RESERVAS - PARTICIPANTES
INSERT INTO reserva_participante (ci_participante, id_reserva, fecha_solicitud_reserva, asistencia) VALUES
(48923123, 1, '2025-05-09 10:00:00', TRUE),
(52201984, 2, '2025-05-10 12:30:00', TRUE),
(49011892, 4, '2025-05-12 08:00:00', TRUE),
(43782910, 3, '2025-05-11 09:45:00', FALSE),
(40298377, 4, '2025-05-12 10:15:00', TRUE),
(46293847, 5, '2025-05-12 11:00:00', TRUE);

-- SANCIONES
INSERT INTO sancion_participante (ci_participante, fecha_inicio, fecha_fin) VALUES
(43782910, '2025-05-13', '2025-05-20'),
(46293847, '2025-05-15', '2025-05-18');

-- FIN DEL ARCHIVO

