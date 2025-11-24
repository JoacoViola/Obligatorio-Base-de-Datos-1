import bcrypt
from datetime import datetime, timedelta, time

# ======================================================
# 1. HASH DE CONTRASEÑAS
# ======================================================

def hash_password(password: str) -> str:
    """
    Recibe una contraseña en texto plano y devuelve el hash bcrypt.
    """
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    """
    Compara una contraseña en texto plano con su hash almacenado.
    """
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))


# ======================================================
# 2. FUNCIONES DE FECHAS
# ======================================================

def obtener_semana_del_anio(fecha: datetime) -> int:
    """
    Devuelve la semana del año según ISO (lunes = 1).
    Útil para validar 'máximo 3 reservas semanales por usuario'.
    """
    return fecha.isocalendar().week


def misma_fecha(fecha1: datetime, fecha2: datetime) -> bool:
    """
    Devuelve True si dos fechas ocurren el mismo día.
    """
    return fecha1.date() == fecha2.date()


def diferencia_en_horas(inicio: datetime, fin: datetime) -> float:
    """
    Diferencia en horas entre dos datetimes.
    """
    delta = fin - inicio
    return delta.total_seconds() / 3600


# ======================================================
# 3. VALIDACIONES DE HORARIOS
# ======================================================

def es_bloque_de_una_hora(inicio: datetime, fin: datetime) -> bool:
    """
    Verifica que la reserva sea EXACTAMENTE de 1 hora.
    """
    return abs(diferencia_en_horas(inicio, fin) - 1) < 0.0001


def se_superpone(inicio1: datetime, fin1: datetime, inicio2: datetime, fin2: datetime) -> bool:
    """
    Verifica si dos intervalos de tiempo se superponen.
    Usado para evitar reservas simultáneas en la misma sala o por la misma persona.
    """
    return not (fin1 <= inicio2 or fin2 <= inicio1)


# ======================================================
# 4. OTRAS UTILIDADES
# ======================================================

def normalizar_string(texto: str) -> str:
    """
    Convierte un string a formato estándar:
    - trim
    - lower
    - sin espacios duplicados
    """
    return " ".join(texto.strip().lower().split())
