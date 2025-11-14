from db import get_connection


# ====================================================
# 1. Salas más reservadas
# ====================================================
def reporte_salas_mas_reservadas():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT nombre_sala, edificio, COUNT(*) AS cantidad_reservas
        FROM reserva
        GROUP BY nombre_sala, edificio
        ORDER BY cantidad_reservas DESC
    """)

    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return data


# ====================================================
# 2. Turnos más usados
# ====================================================
def reporte_turnos_mas_usados():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT t.descripcion, COUNT(*) AS cantidad
        FROM reserva r
        JOIN turno t ON t.id_turno = r.id_turno
        GROUP BY t.id_turno
        ORDER BY cantidad DESC
    """)

    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return data


# ====================================================
# 3. Participantes con más reservas
# ====================================================
def reporte_participantes_mas_reservas():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            p.ci, p.nombre, p.apellido,
            COUNT(*) AS cantidad_reservas
        FROM reserva_participante rp
        JOIN participante p ON p.ci = rp.ci_participante
        GROUP BY p.ci
        ORDER BY cantidad_reservas DESC
    """)

    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return data


# ====================================================
# 4. Reservas por semana
# ====================================================
def reporte_reservas_por_semana():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            YEARWEEK(fecha, 1) AS semana,
            COUNT(*) AS cantidad
        FROM reserva
        GROUP BY YEARWEEK(fecha, 1)
        ORDER BY semana
    """)

    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return data


# ====================================================
# 5. Sanciones vigentes
# ====================================================
def reporte_sanciones_vigentes():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            p.ci, p.nombre, p.apellido,
            s.fecha_inicio, s.fecha_fin
        FROM sancion_participante s
        JOIN participante p ON p.ci = s.ci_participante
        WHERE CURDATE() BETWEEN fecha_inicio AND fecha_fin
        ORDER BY fecha_fin DESC
    """)

    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return data


# ====================================================
# 6. Reservas canceladas por mes
# ====================================================
def reporte_cancelaciones_por_mes():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            DATE_FORMAT(fecha, '%Y-%m') AS mes,
            COUNT(*) AS cancelaciones
        FROM reserva
        WHERE estado = 'cancelada'
        GROUP BY mes
        ORDER BY mes
    """)

    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return data


# ====================================================
# 7. Salas más no utilizadas (reservas sin asistencia)
# ====================================================
def reporte_salas_no_utilizadas():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            r.nombre_sala, r.edificio,
            COUNT(*) AS reservas_sin_uso
        FROM reserva r
        WHERE r.estado = 'sin asistencia'
        GROUP BY r.nombre_sala, r.edificio
        ORDER BY reservas_sin_uso DESC
    """)

    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return data


# ====================================================
# 8. Participantes con mayor cantidad de sanciones
# ====================================================
def reporte_participantes_mas_sanciones():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            p.ci, p.nombre, p.apellido,
            COUNT(*) AS cantidad_sanciones
        FROM sancion_participante s
        JOIN participante p ON p.ci = s.ci_participante
        GROUP BY p.ci
        ORDER BY cantidad_sanciones DESC
    """)

    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return data


# ====================================================
# 9, 10, 11 — Reportes propios
# ====================================================

def reporte_ocupacion_por_sala():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            nombre_sala, edificio,
            COUNT(*) AS veces_usada
        FROM reserva
        GROUP BY nombre_sala, edificio
        ORDER BY veces_usada DESC
    """)

    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return data


def reporte_asistencia_general():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            SUM(CASE WHEN asistencia = TRUE THEN 1 ELSE 0 END) AS con_asistencia,
            SUM(CASE WHEN asistencia = FALSE THEN 1 ELSE 0 END) AS sin_asistencia
        FROM reserva_participante
    """)

    data = cursor.fetchone()
    cursor.close()
    conn.close()
    return data


def reporte_reservas_por_participante(ci_participante: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            r.id_reserva, r.fecha, r.nombre_sala, r.edificio, r.estado
        FROM reserva_participante rp
        JOIN reserva r ON r.id_reserva = rp.id_reserva
        WHERE rp.ci_participante = %s
        ORDER BY r.fecha DESC
    """, (ci_participante,))

    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return data
