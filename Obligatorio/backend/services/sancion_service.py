from db import get_connection
from mysql.connector import Error


# =========================
# Listar sanciones
# =========================
def listar_sanciones():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM sancion_participante")
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return data


# =========================
# Crear sanción manual
# =========================
def crear_sancion(ci_participante: int, fecha_inicio, fecha_fin):
    conn = get_connection()
    cursor = conn.cursor()

    query = """
        INSERT INTO sancion_participante (ci_participante, fecha_inicio, fecha_fin)
        VALUES (%s, %s, %s)
    """
    values = (ci_participante, fecha_inicio, fecha_fin)

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
