from db import get_connection

# ============================
# CREAR
# ============================
def crear_participante(ci, nombre, apellido, email):
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
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        return False, str(e)


# ============================
# OBTENER TODOS
# ============================
def obtener_todos_participantes():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM participante")
    rows = cursor.fetchall()

    cursor.close()
    conn.close()
    return rows


# ============================
# OBTENER POR CI
# ============================
def obtener_participante_por_ci(ci):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM participante WHERE ci = %s", (ci,))
    row = cursor.fetchone()

    cursor.close()
    conn.close()
    return row


# ============================
# ACTUALIZAR (PATCH)
# ============================
def actualizar_participante(ci, nombre=None, apellido=None, email=None):
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

    if not campos:
        return False, "No se envió ningún campo para actualizar."

    valores.append(ci)

    query = f"UPDATE participante SET {', '.join(campos)} WHERE ci = %s"

    try:
        cursor.execute(query, valores)
        conn.commit()
        mod = cursor.rowcount
        cursor.close()
        conn.close()
        return mod > 0, None
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        return False, str(e)


# ============================
# ELIMINAR
# ============================
def eliminar_participante(ci):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("DELETE FROM participante WHERE ci = %s", (ci,))
        conn.commit()
        filas = cursor.rowcount
        cursor.close()
        conn.close()
        return filas > 0, None
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        return False, str(e)

