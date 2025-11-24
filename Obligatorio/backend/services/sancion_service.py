from db import get_connection

# ============================
# Crear sanción
# ============================
def crear_sancion(ci, fecha_inicio, fecha_fin):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            INSERT INTO sancion_participante (ci_participante, fecha_inicio, fecha_fin)
            VALUES (%s, %s, %s)
        """, (ci, fecha_inicio, fecha_fin))

        conn.commit()
        nuevo_id = cursor.lastrowid

        cursor.close()
        conn.close()
        return True, nuevo_id
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        return False, str(e)


# ============================
# Obtener sanciones (por CI o todas)
# ============================
def obtener_sanciones(ci=None):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    if ci:
        cursor.execute("""
            SELECT id_sancion, ci_participante, fecha_inicio, fecha_fin
            FROM sancion_participante
            WHERE ci_participante = %s
        """, (ci,))
    else:
        cursor.execute("""
            SELECT id_sancion, ci_participante, fecha_inicio, fecha_fin
            FROM sancion_participante
        """)

    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    return rows


# ============================
# Actualizar sanción (PATCH)
# ============================
def actualizar_sancion(id_sancion, fecha_inicio=None, fecha_fin=None):
    conn = get_connection()
    cursor = conn.cursor()

    campos = []
    valores = []

    if fecha_inicio:
        campos.append("fecha_inicio = %s")
        valores.append(fecha_inicio)

    if fecha_fin:
        campos.append("fecha_fin = %s")
        valores.append(fecha_fin)

    if not campos:
        return False, "No se envió ningún campo para actualizar."

    valores.append(id_sancion)

    query = f"""
        UPDATE sancion_participante
        SET {', '.join(campos)}
        WHERE id_sancion = %s
    """

    try:
        cursor.execute(query, valores)
        conn.commit()

        ok = cursor.rowcount > 0
        cursor.close()
        conn.close()
        return ok, None

    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        return False, str(e)


# ============================
# Eliminar sanción
# ============================
def eliminar_sancion(id_sancion):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            DELETE FROM sancion_participante
            WHERE id_sancion = %s
        """, (id_sancion,))

        conn.commit()
        ok = cursor.rowcount > 0

        cursor.close()
        conn.close()
        return ok, None

    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        return False, str(e)
