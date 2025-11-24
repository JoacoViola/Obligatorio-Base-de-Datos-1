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


def eliminar_login_service(correo: str):
    conn = get_connection()
    cursor = conn.cursor()

    # Verificar que exista
    cursor.execute(
        "SELECT 1 FROM login WHERE correo = %s",
        (correo,)
    )
    if not cursor.fetchone():
        cursor.close()
        conn.close()
        return False, "El login no existe."

    try:
        cursor.execute(
            "DELETE FROM login WHERE correo = %s",
            (correo,)
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

from db import get_connection
from utils.helpers import hash_password, verify_password


def actualizar_contrasenia(correo: str, nueva_contrasenia: str):
    conn = get_connection()
    cursor = conn.cursor()

    hashed = hash_password(nueva_contrasenia)

    try:
        cursor.execute(
            "UPDATE login SET contrasenia = %s WHERE correo = %s",
            (hashed, correo),
        )
        conn.commit()
        filas = cursor.rowcount
        cursor.close()
        conn.close()

        return filas > 0
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        return False
