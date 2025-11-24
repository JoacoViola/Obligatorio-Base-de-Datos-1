from db import get_connection
from utils.helpers import hash_password, verify_password
from mysql.connector import Error


def crear_login(correo: str, contrasenia: str):
    conn = get_connection()
    cursor = conn.cursor()

    hashed = hash_password(contrasenia)

    try:
        cursor.execute(
            """
            INSERT INTO login (correo, contrasenia)
            VALUES (%s, %s)
            """,
            (correo, hashed)
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


def autenticar_login(correo: str, contrasenia: str):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM login WHERE correo = %s", (correo,)
    )
    data = cursor.fetchone()
    cursor.close()
    conn.close()

    if not data:
        return False, "Usuario no encontrado"

    if not verify_password(contrasenia, data["contrasenia"]):
        return False, "Contraseña incorrecta"

    return True, None
