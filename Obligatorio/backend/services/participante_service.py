from db import get_connection
from mysql.connector import Error


def crear_participante(ci: int, nombre: str, apellido: str, email: str):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO participante (ci, nombre, apellido, email)
            VALUES (%s, %s, %s, %s)
            """,
            (ci, nombre, apellido, email)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return True, None

    except Error as e:
        conn.rollback()
        cursor.close()
        conn.close()
        return False, str(e)


def listar_participantes():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM participante")
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return data


def eliminar_participante_service(ci: int):
    conn = get_connection()
    cursor = conn.cursor()

    # Verificar que existe
    cursor.execute(
        "SELECT 1 FROM participante WHERE ci = %s",
        (ci,)
    )
    if not cursor.fetchone():
        cursor.close()
        conn.close()
        return False, "El participante no existe."

    try:
        cursor.execute(
            "DELETE FROM participante WHERE ci = %s",
            (ci,)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return True, None

    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        return False, str(e)


def actualizar_participante(ci: int, nombre: str | None, apellido: str | None, email: str | None):
    conn = get_connection()
    cursor = conn.cursor()

    campos = []
    valores = []

    if nombre is not None:
        campos.append("nombre = %s")
        valores.append(nombre)

    if apellido is not None:
        campos.append("apellido = %s")
        valores.append(apellido)

    if email is not None:
        campos.append("email = %s")
        valores.append(email)

    if len(campos) == 0:
        return False

    valores.append(ci)

    query = f"UPDATE participante SET {', '.join(campos)} WHERE ci = %s"

    try:
        cursor.execute(query, tuple(valores))
        conn.commit()
        filas = cursor.rowcount
        cursor.close()
        conn.close()
        return filas > 0

    except Exception:
        conn.rollback()
        cursor.close()
        conn.close()
        return False
