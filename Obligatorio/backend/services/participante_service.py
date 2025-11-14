from db import get_connection

def listar_participantes():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM participante")
    data = cursor.fetchall()
    conn.close()
    return data

def crear_participante(ci, nombre, apellido, email):
    conn = get_connection()
    cursor = conn.cursor()
    query = """
        INSERT INTO participante (ci, nombre, apellido, email)
        VALUES (%s, %s, %s, %s)
    """
    values = (ci, nombre, apellido, email)

    try:
        cursor.execute(query, values)
        conn.commit()
        conn.close()
        return True
    except:
        conn.close()
        return False
