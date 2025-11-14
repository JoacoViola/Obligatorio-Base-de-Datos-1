from db import get_connection

# ======================================
# Obtener todas las salas
# ======================================
def listar_salas():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM sala")
    data = cursor.fetchall()
    conn.close()
    return data


# ======================================
# Crear sala
# ======================================
def crear_sala(nombre_sala, edificio, capacidad, tipo_sala):
    conn = get_connection()
    cursor = conn.cursor()

    query = """
        INSERT INTO sala (nombre_sala, edificio, capacidad, tipo_sala)
        VALUES (%s, %s, %s, %s)
    """
    values = (nombre_sala, edificio, capacidad, tipo_sala)

    try:
        cursor.execute(query, values)
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print("Error al crear sala:", e)
        conn.close()
        return False


# ======================================
# Eliminar sala
# ======================================
def borrar_sala(nombre_sala, edificio):
    conn = get_connection()
    cursor = conn.cursor()

    query = """
        DELETE FROM sala 
        WHERE nombre_sala = %s AND edificio = %s
    """
    values = (nombre_sala, edificio)

    try:
        cursor.execute(query, values)
        conn.commit()
        conn.close()
        return cursor.rowcount > 0
    except:
        conn.close()
        return False


# ======================================
# Modificar sala
# ======================================
def modificar_sala(nombre_sala, edificio, capacidad, tipo_sala):
    conn = get_connection()
    cursor = conn.cursor()

    query = """
        UPDATE sala
        SET capacidad = %s,
            tipo_sala = %s
        WHERE nombre_sala = %s AND edificio = %s
    """
    values = (capacidad, tipo_sala, nombre_sala, edificio)

    try:
        cursor.execute(query, values)
        conn.commit()
        conn.close()
        return cursor.rowcount > 0
    except:
        conn.close()
        return False
