# backend/services/participante_service.py

from mysql.connector import Error
from db import get_connection
from utils.helpers import hash_password


# =============================
# LISTAR PARTICIPANTES
# =============================

def listar_participantes():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM participante")
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return data


# =============================
# OBTENER UNO POR CI
# =============================

def obtener_participante(ci: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM participante WHERE ci = %s", (ci,))
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    return row


# =============================
# CREAR PARTICIPANTE + LOGIN
# =============================

def crear_participante(ci: int, nombre: str, apellido: str, email: str, contrasenia: str):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        hashed = hash_password(contrasenia)

        # 1. Crear login
        cursor.execute(
            "INSERT INTO login (correo, contrasenia) VALUES (%s, %s)",
            (email, hashed)
        )

        # 2. Crear participante
        cursor.execute(
            """
            INSERT INTO participante (ci, nombre, apellido, email)
            VALUES (%s, %s, %s, %s)
            """,
            (ci, nombre, apellido, email),
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


# =============================
# ELIMINAR PARTICIPANTE
# (Elimina también su login por FK ON DELETE CASCADE)
# =============================

def eliminar_participante(ci: int):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("DELETE FROM participante WHERE ci = %s", (ci,))
        conn.commit()

        deleted = cursor.rowcount
        cursor.close()
        conn.close()

        return deleted > 0

    except:
        conn.rollback()
        cursor.close()
        conn.close()
        return False


# =============================
# ACTUALIZAR PARTICIPANTE
# =============================

def actualizar_participante(ci: int, nombre=None, apellido=None, email=None):
    conn = get_connection()
    cursor = conn.cursor()

    campos = []
    valores = []

    if nombre:
        campos.append("nombre = %s")
        valores.append(nombre)

    if apellido:
        campos.append("apellido = %s")
        valores.append(apellido)

    if email:
        campos.append("email = %s")
        valores.append(email)

    if not campos:
        return False, "No se enviaron datos para actualizar"

    query = f"UPDATE participante SET {', '.join(campos)} WHERE ci = %s"
    valores.append(ci)

    try:
        cursor.execute(query, tuple(valores))
        conn.commit()
        ok = cursor.rowcount > 0
        cursor.close()
        conn.close()
        return ok, None
    except Error as e:
        conn.rollback()
        cursor.close()
        conn.close()
        return False, str(e)
