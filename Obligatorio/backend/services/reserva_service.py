from datetime import date, timedelta

from mysql.connector import Error

from db import get_connection


# ============================
# Utilidades internas
# ============================

def _get_reserva(conn, id_reserva: int):
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM reserva WHERE id_reserva = %s", (id_reserva,))
    reserva = cursor.fetchone()
    cursor.close()
    return reserva


# ============================
# Listar reservas
# ============================

def listar_reservas():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM reserva")
    data = cursor.fetchall()
    conn.close()
    return data


def obtener_reserva_por_id(id_reserva: int):
    conn = get_connection()
    reserva = _get_reserva(conn, id_reserva)
    conn.close()
    return reserva


# ============================
# Crear reserva
# ============================

def crear_reserva(nombre_sala: str, edificio: str, fecha, id_turno: int):
    """
    Crea una reserva con estado 'activa'.
    Devuelve (id_reserva, error) → error es None si todo salió bien.
    """
    conn = get_connection()
    cursor = conn.cursor()

    query = """
        INSERT INTO reserva (nombre_sala, edificio, fecha, id_turno, estado)
        VALUES (%s, %s, %s, %s, 'activa')
    """
    values = (nombre_sala, edificio, fecha, id_turno)

    try:
        cursor.execute(query, values)
        conn.commit()
        new_id = cursor.lastrowid
        cursor.close()
        conn.close()
        return new_id, None
    except Error as e:
        conn.rollback()
        cursor.close()
        conn.close()
        return None, str(e)


# ============================
# Cancelar reserva
# ============================

def cancelar_reserva(id_reserva: int):
    """
    Cambia el estado de la reserva a 'cancelada'.
    Devuelve True si se modificó alguna fila.
    """
    conn = get_connection()
    cursor = conn.cursor()

    query = """
        UPDATE reserva
        SET estado = 'cancelada'
        WHERE id_reserva = %s AND estado = 'activa'
    """

    try:
        cursor.execute(query, (id_reserva,))
        conn.commit()
        filas = cursor.rowcount
        cursor.close()
        conn.close()
        return filas > 0
    except:
        conn.rollback()
        cursor.close()
        conn.close()
        return False


# ============================
# Finalizar reserva + sanciones
# ============================

def finalizar_reserva(id_reserva: int):
    """
    Cambia el estado de la reserva a 'finalizada'.
    Si ningún participante asistió, genera una sanción de 2 meses
    para todos los participantes de esa reserva.
    """
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # 1) Verificar que la reserva exista
        cursor.execute("SELECT * FROM reserva WHERE id_reserva = %s", (id_reserva,))
        reserva = cursor.fetchone()
        if not reserva:
            cursor.close()
            conn.close()
            return False, "La reserva no existe."

        # 2) Marcar la reserva como finalizada
        cur2 = conn.cursor()
        cur2.execute(
            "UPDATE reserva SET estado = 'finalizada' WHERE id_reserva = %s",
            (id_reserva,)
        )
        conn.commit()
        cur2.close()

        # 3) Verificar asistencia de los participantes
        cursor.execute(
            """
            SELECT 
                COUNT(*) AS total,
                SUM(CASE WHEN asistencia = TRUE THEN 1 ELSE 0 END) AS con_asistencia
            FROM reserva_participante
            WHERE id_reserva = %s
            """,
            (id_reserva,)
        )
        stats = cursor.fetchone()
        total = stats["total"] or 0
        con_asistencia = stats["con_asistencia"] or 0

        # Si no hay participantes, no sancionamos a nadie
        if total == 0:
            cursor.close()
            conn.close()
            return True, None

        # Si nadie asistió → sanción de 2 meses para todos
        if con_asistencia == 0:
            hoy = date.today()
            fecha_fin = hoy + timedelta(days=60)

            # Obtener todos los participantes de esa reserva
            cursor.execute(
                "SELECT ci_participante FROM reserva_participante WHERE id_reserva = %s",
                (id_reserva,)
            )
            participantes = cursor.fetchall()

            cur3 = conn.cursor()
            for p in participantes:
                cur3.execute(
                    """
                    INSERT INTO sancion_participante (ci_participante, fecha_inicio, fecha_fin)
                    VALUES (%s, %s, %s)
                    """,
                    (p["ci_participante"], hoy, fecha_fin)
                )
            conn.commit()
            cur3.close()

        cursor.close()
        conn.close()
        return True, None

    except Error as e:
        conn.rollback()
        cursor.close()
        conn.close()
        return False, str(e)


# ============================
# Participantes en reserva
# ============================

def agregar_participante_a_reserva(id_reserva: int, ci_participante: int):
    """
    Inserta un participante en una reserva.
    La lógica de negocio dura (capacidad, sanciones, solapamientos, etc.)
    la manejan los TRIGGERS en la base de datos.
    Devuelve (ok, error).
    """
    conn = get_connection()
    cursor = conn.cursor()

    query = """
        INSERT INTO reserva_participante (ci_participante, id_reserva, fecha_solicitud_reserva, asistencia)
        VALUES (%s, %s, NOW(), FALSE)
    """
    values = (ci_participante, id_reserva)

    try:
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        return True, None
    except Error as e:
        conn.rollback()
        cursor.close()
        conn.close()
        return False, str(e)


def listar_participantes_de_reserva(id_reserva: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        """
        SELECT rp.ci_participante, p.nombre, p.apellido, rp.asistencia
        FROM reserva_participante rp
        JOIN participante p ON p.ci = rp.ci_participante
        WHERE rp.id_reserva = %s
        """,
        (id_reserva,)
    )
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return data


def actualizar_asistencia(id_reserva: int, ci_participante: int, asistencia: bool):
    conn = get_connection()
    cursor = conn.cursor()

    query = """
        UPDATE reserva_participante
        SET asistencia = %s
        WHERE id_reserva = %s AND ci_participante = %s
    """
    values = (asistencia, id_reserva, ci_participante)

    try:
        cursor.execute(query, values)
        conn.commit()
        filas = cursor.rowcount
        cursor.close()
        conn.close()
        return filas > 0
    except:
        conn.rollback()
        cursor.close()
        conn.close()
        return False
