# backend/services/login_service.py

from db import get_connection
from mysql.connector import Error
from utils.helpers import hash_password


# ===========================
# GET LOGIN
# ===========================

def obtener_login(correo: str):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT correo FROM login WHERE correo = %s",
        (correo,),
    )
    data = cursor.fetchone()
    cursor.close()
    conn.close()
    return data


# ===========================
# CREAR LOGIN
# ===========================

def crear_login(correo: str, contrasenia: str):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        hashed = hash_password(contrasenia)

        cursor.execute(
            "INSERT INTO login (correo, contrasenia) VALUES (%s, %s)",
            (correo, hashed),
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


# ===========================
# ELIMINAR LOGIN
# ===========================

def eliminar_login(correo: str):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM login WHERE correo = %s", (correo,))
        conn.commit()
        ok = cursor.rowcount > 0
        cursor.close()
        conn.close()
        return ok
    except:
        conn.rollback()
        cursor.close()
        conn.close()
        return False


# ===========================
# ACTUALIZAR CONTRASEÑA LOGIN
# ===========================

def actualizar_login(correo: str, contrasenia: str):
    conn = get_connection()
    cursor = conn.cursor()

    hashed = hash_password(contrasenia)

    try:
        cursor.execute(
            "UPDATE login SET contrasenia = %s WHERE correo = %s",
            (hashed, correo),
        )
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


from utils.helpers import verify_password

def autenticar_login(correo: str, contrasenia: str):
    """
    Autentica un usuario verificando correo + contraseña.
    """
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT correo, contrasenia FROM login WHERE correo = %s",
        (correo,)
    )
    row = cursor.fetchone()
    cursor.close()
    conn.close()

    if not row:
        return False, "Usuario no encontrado"

    if verify_password(contrasenia, row["contrasenia"]):
        return True, None
    else:
        return False, "Contraseña incorrecta"
