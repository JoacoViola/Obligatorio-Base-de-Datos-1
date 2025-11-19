/* ==================================================================================================
   OBLIGATORIO: SISTEMA DE GESTIÓN ACADÉMICA – UCU
   DEFINICIÓN DE BASE DE DATOS Y TABLAS
   Materia: Bases de Datos 1 – Segundo Semestre 2025
   Autores: Joaquín Viola, Sebastián Mártony y Esteban Durán
   Descripción:
     Archivo que define la estructura completa del Sistema de Gestión Académica, incluyendo la
     creación de tablas, claves primarias y foráneas, checks y restricciones necesarias para
     garantizar la integridad del modelo relacional en MySQL.
   ================================================================================================== */

-- Crear base de datos
CREATE
DATABASE IF NOT EXISTS gestion_academica;
USE
gestion_academica;

-- Tabla: login
CREATE TABLE login
(
    correo     VARCHAR(100) PRIMARY KEY,
    contraseña VARCHAR(100) NOT NULL
);

-- Tabla: participante
CREATE TABLE participante
(
    ci       INT PRIMARY KEY,
    nombre   VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    email    VARCHAR(100) NOT NULL UNIQUE,
    FOREIGN KEY (email) REFERENCES login(correo)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- Tabla: facultad
CREATE TABLE facultad
(
    id_facultad INT PRIMARY KEY AUTO_INCREMENT,
    nombre      VARCHAR(100) NOT NULL
);

-- Tabla: programa_academico
CREATE TABLE programa_academico
(
    nombre_programa VARCHAR(100) PRIMARY KEY,
    id_facultad     INT NOT NULL,
    tipo            ENUM('grado', 'posgrado') NOT NULL,
    FOREIGN KEY (id_facultad) REFERENCES facultad (id_facultad)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Tabla: participante_programa_academico
CREATE TABLE participante_programa_academico
(
    id_alumno_programa INT PRIMARY KEY AUTO_INCREMENT,
    ci_participante    INT          NOT NULL,
    nombre_programa    VARCHAR(100) NOT NULL,
    rol                ENUM('alumno', 'docente') NOT NULL,
    FOREIGN KEY (ci_participante) REFERENCES participante (ci)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (nombre_programa) REFERENCES programa_academico (nombre_programa)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- Tabla: edificio
CREATE TABLE edificio
(
    nombre_edificio VARCHAR(100) PRIMARY KEY,
    direccion       VARCHAR(150) NOT NULL,
    departamento    VARCHAR(100) NOT NULL
);

-- Tabla: sala
CREATE TABLE sala
(
    nombre_sala VARCHAR(100),
    edificio    VARCHAR(100),
    capacidad   INT NOT NULL CHECK (capacidad > 0),
    tipo_sala   ENUM('libre', 'posgrado', 'docente') NOT NULL,
    PRIMARY KEY (nombre_sala, edificio),
    FOREIGN KEY (edificio) REFERENCES edificio (nombre_edificio)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Tabla: turno
CREATE TABLE turno
(
    id_turno    INT PRIMARY KEY AUTO_INCREMENT,
    hora_inicio TIME NOT NULL,
    hora_fin    TIME NOT NULL,
    CHECK (hora_inicio < hora_fin),
    -- Asegura que cada turno sea exactamente de 1 hora
    CHECK (TIME_TO_SEC(hora_fin) - TIME_TO_SEC(hora_inicio) = 3600)
);

-- Tabla: reserva
CREATE TABLE reserva
(
    id_reserva  INT PRIMARY KEY AUTO_INCREMENT,
    nombre_sala VARCHAR(100) NOT NULL,
    edificio    VARCHAR(100) NOT NULL,
    fecha       DATE         NOT NULL,
    id_turno    INT          NOT NULL,
    estado      ENUM('activa', 'cancelada', 'sin asistencia', 'finalizada') NOT NULL,
    FOREIGN KEY (nombre_sala, edificio) REFERENCES sala (nombre_sala, edificio)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_turno) REFERENCES turno (id_turno)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Tabla: reserva_participante
CREATE TABLE reserva_participante
(
    ci_participante         INT      NOT NULL,
    id_reserva              INT      NOT NULL,
    fecha_solicitud_reserva DATETIME NOT NULL,
    asistencia              BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (ci_participante, id_reserva),
    FOREIGN KEY (ci_participante) REFERENCES participante (ci)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (id_reserva) REFERENCES reserva (id_reserva)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- Tabla: sancion_participante
CREATE TABLE sancion_participante
(
    ci_participante INT  NOT NULL,
    fecha_inicio    DATE NOT NULL,
    fecha_fin       DATE NOT NULL,
    PRIMARY KEY (ci_participante, fecha_inicio),
    FOREIGN KEY (ci_participante) REFERENCES participante (ci)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CHECK (fecha_inicio < fecha_fin)
);

-- ======================================== FIN DEL ARCHIVO ===========================================
