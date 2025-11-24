from db import get_connection
from utils.helpers import hash_password, verify_password

# ============================
# CREAR LOGIN
# ============================
def crear_login(correo: str, contrasenia: str):
    conn = get_connection()
    cursor = conn.cursor()

    hashed = hash_password(contrasenia)

    try:
        cursor.execute(
            "INSERT INTO login (correo, contrasenia) VALUES (%s, %s)",
            (correo, hashed)
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
# OBTENER LOGIN
# ============================
def obtener_login(correo: str):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT correo FROM login WHERE correo = %s",
        (correo,)
    )
    row = cursor.fetchone()

    cursor.close()
    conn.close()
    return row


# ============================
# ACTUALIZAR CONTRASEÑA
# ============================
def actualizar_login(correo: str, contrasenia: str):
    conn = get_connection()
    cursor = conn.cursor()

    hashed = hash_password(contrasenia)

    try:
        cursor.execute(
            "UPDATE login SET contrasenia = %s WHERE correo = %s",
            (hashed, correo)
        )
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


# ============================
# ELIMINAR LOGIN
# ============================
def eliminar_login(correo: str):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "DELETE FROM login WHERE correo = %s",
            (correo,)
        )
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


# ============================
# AUTENTICAR LOGIN
# ============================
def autenticar_login(correo: str, contrasenia: str):
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
