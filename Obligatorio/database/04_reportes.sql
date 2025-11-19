/* ====================================================================================
   ARCHIVO 04_reportes.sql
   Reportes del sistema de gestión de reservas de salas - UCU
   Contiene 11 reportes SQL: 8 obligatorios + 3 propios
   ==================================================================================== */

-- =============================================================================
-- 1. Salas más reservadas
-- =============================================================================
SELECT 
    nombre_sala,
    edificio,
    COUNT(*) AS cantidad_reservas
FROM reserva
GROUP BY nombre_sala, edificio
ORDER BY cantidad_reservas DESC;

-- =============================================================================
-- 2. Turnos más usados
-- =============================================================================
SELECT 
    t.descripcion,
    COUNT(*) AS cantidad
FROM reserva r
JOIN turno t ON t.id_turno = r.id_turno
GROUP BY t.id_turno
ORDER BY cantidad DESC;

-- =============================================================================
-- 3. Participantes con más reservas
-- =============================================================================
SELECT 
    p.ci,
    p.nombre,
    p.apellido,
    COUNT(*) AS cantidad_reservas
FROM reserva_participante rp
JOIN participante p ON p.ci = rp.ci_participante
GROUP BY p.ci
ORDER BY cantidad_reservas DESC;

-- =============================================================================
-- 4. Reservas por semana
-- =============================================================================
SELECT 
    YEARWEEK(fecha, 1) AS semana,
    COUNT(*) AS cantidad
FROM reserva
GROUP BY YEARWEEK(fecha, 1)
ORDER BY semana;

-- =============================================================================
-- 5. Sanciones vigentes
-- =============================================================================
SELECT 
    p.ci,
    p.nombre,
    p.apellido,
    s.fecha_inicio,
    s.fecha_fin
FROM sancion_participante s
JOIN participante p ON p.ci = s.ci_participante
WHERE CURDATE() BETWEEN fecha_inicio AND fecha_fin
ORDER BY fecha_fin DESC;

-- =============================================================================
-- 6. Cancelaciones por mes
-- =============================================================================
SELECT 
    DATE_FORMAT(fecha, '%Y-%m') AS mes,
    COUNT(*) AS cancelaciones
FROM reserva
WHERE estado = 'cancelada'
GROUP BY mes
ORDER BY mes;

-- =============================================================================
-- 7. Salas no utilizadas (reservas sin asistencia)
-- =============================================================================
SELECT 
    nombre_sala,
    edificio,
    COUNT(*) AS reservas_sin_uso
FROM reserva
WHERE estado = 'sin asistencia'
GROUP BY nombre_sala, edificio
ORDER BY reservas_sin_uso DESC;

-- =============================================================================
-- 8. Participantes con mayor cantidad de sanciones
-- =============================================================================
SELECT 
    p.ci,
    p.nombre,
    p.apellido,
    COUNT(*) AS cantidad_sanciones
FROM sancion_participante s
JOIN participante p ON p.ci = s.ci_participante
GROUP BY p.ci
ORDER BY cantidad_sanciones DESC;

/* =============================================================================
   REPORTES PROPIOS (OBLIGATORIOS)
   ============================================================================= */

-- =============================================================================
-- 9. Ocupación total por sala
-- =============================================================================
SELECT 
    nombre_sala,
    edificio,
    COUNT(*) AS veces_usada
FROM reserva
GROUP BY nombre_sala, edificio
ORDER BY veces_usada DESC;

-- =============================================================================
-- 10. Asistencia general del sistema
-- =============================================================================
SELECT 
    SUM(CASE WHEN asistencia = TRUE THEN 1 ELSE 0 END) AS con_asistencia,
    SUM(CASE WHEN asistencia = FALSE THEN 1 ELSE 0 END) AS sin_asistencia
FROM reserva_participante;

-- =============================================================================
-- 11. Historial de reservas por participante (ingresando CI)
-- =============================================================================
-- Ejemplo: WHERE rp.ci_participante = 12345678;
SELECT 
    r.id_reserva,
    r.nombre_sala,
    r.edificio,
    r.fecha,
    r.estado
FROM reserva_participante rp
JOIN reserva r ON r.id_reserva = rp.id_reserva
WHERE rp.ci_participante = 12345678
ORDER BY r.fecha DESC;
