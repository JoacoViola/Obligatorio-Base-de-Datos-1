/* ==================================================================================================
   OBLIGATORIO: SISTEMA DE GESTIÓN ACADÉMICA – UCU
   TRIGGERS DE INTEGRIDAD Y VALIDACIÓN A NIVEL DE BASE DE DATOS
   Materia: Bases de Datos 1 – Segundo Semestre 2025
   Autores: Joaquín Viola, Sebastián Mártony y Esteban Durán
   Descripción:
     Este archivo contiene el conjunto completo de triggers implementados en MySQL para garantizar
     la integridad, consistencia y cumplimiento de las reglas de negocio del sistema de gestión
     de reservas de salas de estudio. Los triggers protegen la base de datos contra inconsistencias
     incluso si el backend fallara o intentaran insertar datos directamente por SQL.
   ================================================================================================== */

DELIMITER $$


/* ==================================================================================================
   TRIGGER 1 — Evitar reservas superpuestas en la misma sala
   --------------------------------------------------------------------------------------------------
   Objetivo:
     Impedir que se registre una reserva en un turno donde la sala ya fue reservada previamente.
   Reglas:
     - Mismo edificio
     - Misma sala
     - Misma fecha
     - Mismo turno
     - Solo se consideran reservas activas, finalizadas o sin asistencia (canceladas no ocupan turno).
   ================================================================================================== */
CREATE TRIGGER trg_no_reservas_superpuestas
BEFORE INSERT ON reserva
FOR EACH ROW
BEGIN
    DECLARE existe_reserva INT;

    SELECT COUNT(*)
    INTO existe_reserva
    FROM reserva
    WHERE nombre_sala = NEW.nombre_sala
      AND edificio = NEW.edificio
      AND fecha = NEW.fecha
      AND id_turno = NEW.id_turno
      AND estado IN ('activa', 'finalizada', 'sin asistencia');

    IF existe_reserva > 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'La sala ya está reservada en ese turno.';
    END IF;
END$$



/* ==================================================================================================
   TRIGGER 2 — Evitar superposición de reservas para un mismo participante
   --------------------------------------------------------------------------------------------------
   Objetivo:
     Un participante no puede estar en dos salas al mismo tiempo.
   Reglas:
     - Misma fecha
     - Mismo turno
     - Otra reserva distinta
   ================================================================================================== */
CREATE TRIGGER trg_no_superposicion_participante
BEFORE INSERT ON reserva_participante
FOR EACH ROW
BEGIN
    DECLARE v_fecha DATE;
    DECLARE v_turno INT;
    DECLARE ya_reservado INT;

    SELECT fecha, id_turno
    INTO v_fecha, v_turno
    FROM reserva
    WHERE id_reserva = NEW.id_reserva;

    SELECT COUNT(*)
    INTO ya_reservado
    FROM reserva_participante rp
    JOIN reserva r ON r.id_reserva = rp.id_reserva
    WHERE rp.ci_participante = NEW.ci_participante
      AND r.fecha = v_fecha
      AND r.id_turno = v_turno
      AND rp.id_reserva <> NEW.id_reserva
      AND r.estado IN ('activa','finalizada','sin asistencia');

    IF ya_reservado > 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'El participante ya tiene una reserva en ese turno.';
    END IF;
END$$



/* ==================================================================================================
   TRIGGER 3 — Evitar exceder la capacidad máxima de la sala
   --------------------------------------------------------------------------------------------------
   Objetivo:
     Evitar que la cantidad de participantes asignados a una reserva supere la capacidad definida
     para la sala correspondiente.
   ================================================================================================== */
CREATE TRIGGER trg_capacidad_sala
BEFORE INSERT ON reserva_participante
FOR EACH ROW
BEGIN
    DECLARE v_nombre_sala VARCHAR(100);
    DECLARE v_edificio VARCHAR(100);
    DECLARE v_capacidad INT;
    DECLARE v_actuales INT;

    SELECT r.nombre_sala, r.edificio
    INTO v_nombre_sala, v_edificio
    FROM reserva r
    WHERE r.id_reserva = NEW.id_reserva;

    SELECT capacidad
    INTO v_capacidad
    FROM sala
    WHERE nombre_sala = v_nombre_sala
      AND edificio = v_edificio;

    SELECT COUNT(*)
    INTO v_actuales
    FROM reserva_participante
    WHERE id_reserva = NEW.id_reserva;

    IF (v_actuales + 1) > v_capacidad THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'La sala ha alcanzado su capacidad máxima.';
    END IF;
END$$



/* ==================================================================================================
   TRIGGER 4 — Validar que el participante tenga permiso para la sala
   --------------------------------------------------------------------------------------------------
   Objetivo:
     Impedir que alumnos de grado accedan a salas exclusivas de posgrado o docentes, y que alumnos
     de posgrado accedan a salas de docentes.
   Lógica:
     - Salas LIBRES → todos pueden
     - Salas POSGRADO → docentes + alumnos de posgrado
     - Salas DOCENTE → solo docentes
   ================================================================================================== */
CREATE TRIGGER trg_permiso_sala
BEFORE INSERT ON reserva_participante
FOR EACH ROW
BEGIN
    DECLARE v_tipo_sala ENUM('libre','posgrado','docente');
    DECLARE v_rol ENUM('alumno','docente');
    DECLARE v_tiene_posgrado INT DEFAULT 0;

    SELECT s.tipo_sala
    INTO v_tipo_sala
    FROM reserva r
    JOIN sala s ON r.nombre_sala = s.nombre_sala
               AND r.edificio = s.edificio
    WHERE r.id_reserva = NEW.id_reserva;

    SELECT rol
    INTO v_rol
    FROM participante_programa_academico
    WHERE ci_participante = NEW.ci_participante
    LIMIT 1;

    SELECT COUNT(*)
    INTO v_tiene_posgrado
    FROM participante_programa_academico ppa
    JOIN programa_academico pa ON pa.nombre_programa = ppa.nombre_programa
    WHERE ppa.ci_participante = NEW.ci_participante
      AND pa.tipo = 'posgrado';

    IF v_tipo_sala = 'libre' THEN
        LEAVE trg_permiso_sala;
    END IF;

    IF v_tipo_sala = 'posgrado' THEN
        IF v_rol = 'docente' OR v_tiene_posgrado > 0 THEN
            LEAVE trg_permiso_sala;
        END IF;

        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'No tiene permiso para reservar una sala exclusiva de posgrado.';
    END IF;

    IF v_tipo_sala = 'docente' THEN
        IF v_rol = 'docente' THEN
            LEAVE trg_permiso_sala;
        END IF;

        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Solo los docentes pueden reservar salas exclusivas de docentes.';
    END IF;
END$$



/* ==================================================================================================
   TRIGGER 5 — Evitar reservas de participantes sancionados
   --------------------------------------------------------------------------------------------------
   Objetivo:
     Un participante no puede reservar ni unirse a una reserva si su sanción está vigente para
     la fecha de la reserva.
   Lógica:
     - Se verifica si fecha_reserva ∈ [fecha_inicio, fecha_fin]
   ================================================================================================== */
CREATE TRIGGER trg_participante_sancionado
BEFORE INSERT ON reserva_participante
FOR EACH ROW
BEGIN
    DECLARE v_fecha_reserva DATE;
    DECLARE v_sanciones INT DEFAULT 0;

    SELECT fecha
    INTO v_fecha_reserva
    FROM reserva
    WHERE id_reserva = NEW.id_reserva;

    SELECT COUNT(*)
    INTO v_sanciones
    FROM sancion_participante
    WHERE ci_participante = NEW.ci_participante
      AND v_fecha_reserva BETWEEN fecha_inicio AND fecha_fin;

    IF v_sanciones > 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'El participante está sancionado y no puede reservar salas.';
    END IF;
END$$



/* ==================================================================================================
   TRIGGER 6 — Límite de 2 horas por día (solo alumnos de grado)
   --------------------------------------------------------------------------------------------------
   Objetivo:
     Garantizar que los alumnos de grado no reserven más de dos turnos (2 horas) en un mismo día.
   ================================================================================================== */
CREATE TRIGGER trg_limite_horas_diarias
BEFORE INSERT ON reserva_participante
FOR EACH ROW
BEGIN
    DECLARE v_rol ENUM('alumno','docente');
    DECLARE v_es_grado INT DEFAULT 0;
    DECLARE v_fecha DATE;
    DECLARE v_cantidad INT DEFAULT 0;

    SELECT fecha INTO v_fecha
    FROM reserva WHERE id_reserva = NEW.id_reserva;

    SELECT rol INTO v_rol
    FROM participante_programa_academico
    WHERE ci_participante = NEW.ci_participante
    LIMIT 1;

    SELECT COUNT(*)
    INTO v_es_grado
    FROM participante_programa_academico ppa
    JOIN programa_academico pa ON pa.nombre_programa = ppa.nombre_programa
    WHERE ppa.ci_participante = NEW.ci_participante
      AND pa.tipo = 'grado';

    IF v_rol = 'docente' OR v_es_grado = 0 THEN
        LEAVE trg_limite_horas_diarias;
    END IF;

    SELECT COUNT(*)
    INTO v_cantidad
    FROM reserva_participante rp
    JOIN reserva r ON r.id_reserva = rp.id_reserva
    WHERE rp.ci_participante = NEW.ci_participante
      AND r.fecha = v_fecha
      AND r.estado IN ('activa','finalizada','sin asistencia');

    IF v_cantidad >= 2 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Los alumnos de grado no pueden reservar más de 2 horas por día.';
    END IF;
END$$



/* ==================================================================================================
   TRIGGER 7 — Límite de 3 reservas activas por semana (solo alumnos de grado)
   --------------------------------------------------------------------------------------------------
   Objetivo:
     Impedir que un alumno de grado tenga más de tres reservas activas en la misma semana.
   Lógica:
     - Semana = lunes a domingo
   ================================================================================================== */
CREATE TRIGGER trg_limite_reservas_semanales
BEFORE INSERT ON reserva_participante
FOR EACH ROW
BEGIN
    DECLARE v_rol ENUM('alumno','docente');
    DECLARE v_es_grado INT DEFAULT 0;
    DECLARE v_fecha DATE;
    DECLARE v_inicio DATE;
    DECLARE v_fin DATE;
    DECLARE v_cantidad INT DEFAULT 0;

    SELECT fecha INTO v_fecha
    FROM reserva WHERE id_reserva = NEW.id_reserva;

    SELECT rol INTO v_rol
    FROM participante_programa_academico
    WHERE ci_participante = NEW.ci_participante
    LIMIT 1;

    SELECT COUNT(*)
    INTO v_es_grado
    FROM participante_programa_academico ppa
    JOIN programa_academico pa ON pa.nombre_programa = ppa.nombre_programa
    WHERE ppa.ci_participante = NEW.ci_participante
      AND pa.tipo = 'grado';

    IF v_rol = 'docente' OR v_es_grado = 0 THEN
        LEAVE trg_limite_reservas_semanales;
    END IF;

    SET v_inicio = DATE_SUB(v_fecha, INTERVAL WEEKDAY(v_fecha) DAY);
    SET v_fin    = DATE_ADD(v_inicio, INTERVAL 6 DAY);

    SELECT COUNT(*)
    INTO v_cantidad
    FROM reserva_participante rp
    JOIN reserva r ON r.id_reserva = rp.id_reserva
    WHERE rp.ci_participante = NEW.ci_participante
      AND r.fecha BETWEEN v_inicio AND v_fin
      AND r.estado = 'activa';

    IF v_cantidad >= 3 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Los alumnos de grado no pueden superar 3 reservas activas por semana.';
    END IF;
END$$



/* ==================================================================================================
   TRIGGER 8 — Evitar reservas en fechas pasadas
   --------------------------------------------------------------------------------------------------
   Objetivo:
     Impedir que se creen reservas con fecha anterior al día actual.
   ================================================================================================== */
CREATE TRIGGER trg_no_reservas_pasadas
BEFORE INSERT ON reserva
FOR EACH ROW
BEGIN
    IF NEW.fecha < CURRENT_DATE() THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'No se pueden realizar reservas en fechas pasadas.';
    END IF;
END$$



/* ==================================================================================================
   TRIGGER 9 — Validación de turno existente
   --------------------------------------------------------------------------------------------------
   Objetivo:
     Impedir la creación de reservas con turnos inexistentes.
   ================================================================================================== */
CREATE TRIGGER trg_turno_valido
BEFORE INSERT ON reserva
FOR EACH ROW
BEGIN
    IF NEW.id_turno NOT IN (SELECT id_turno FROM turno) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'El turno especificado no existe.';
    END IF;
END$$

DELIMITER ;

-- ======================================== FIN DEL ARCHIVO ===========================================
