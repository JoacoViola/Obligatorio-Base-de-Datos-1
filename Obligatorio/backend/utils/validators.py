# backend/utils/validators.py

from datetime import datetime
from db import get_connection
from utils.helpers import obtener_semana_del_anio, diferencia_en_horas, se_superpone


class ReglaNegocioError(Exception):
    """Excepción usada cuando una validación de reglas de negocio falla."""
    pass


# ============================
# Validaciones de sala / turno
# ============================

def validar_sala_existe(nombre_sala: str, edificio: str) -> None:
    """
    Verifica que la sala exista en el edificio indicado.
    """
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT 1 FROM sala WHERE nombre_sala = %s AND edificio = %s",
        (nombre_sala, edificio),
    )
    row = cursor.fetchone()
    cursor.close()
    conn.close()

    if not row:
        raise ReglaNegocioError("La sala indicada no existe en ese edificio.")


def validar_turno_existe(id_turno: int) -> None:
    """
    Verifica que el turno exista.
    """
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT 1 FROM turno WHERE id_turno = %s",
        (id_turno,),
    )
    row = cursor.fetchone()
    cursor.close()
    conn.close()

    if not row:
        raise ReglaNegocioError("El turno indicado no existe.")


def validar_sala_disponible(nombre_sala: str, edificio: str, fecha, id_turno: int) -> None:
    """
    Verifica que NO exista ya una reserva activa para esa sala,
    en ese edificio, fecha e id_turno.
    """
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        """
        SELECT 1
        FROM reserva
        WHERE nombre_sala = %s
          AND edificio = %s
          AND fecha = %s
          AND id_turno = %s
          AND estado = 'activa'
        LIMIT 1
        """,
        (nombre_sala, edificio, fecha, id_turno),
    )
    row = cursor.fetchone()
    cursor.close()
    conn.close()

    if row:
        raise ReglaNegocioError("La sala ya está reservada en ese turno y fecha.")


# ============================
# Validaciones de participante
# ============================

def validar_participante_existe(ci_participante: int) -> None:
    """
    Verifica que el participante exista.
    """
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT 1 FROM participante WHERE ci = %s",
        (ci_participante,),
    )
    row = cursor.fetchone()
    cursor.close()
    conn.close()

    if not row:
        raise ReglaNegocioError("El participante indicado no existe.")


def validar_participante_no_sancionado(ci_participante: int) -> None:
    """
    Verifica que el participante NO tenga sanciones activas.
    """
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        """
        SELECT 1
        FROM sancion_participante
        WHERE ci_participante = %s
          AND CURDATE() BETWEEN fecha_inicio AND fecha_fin
        LIMIT 1
        """,
        (ci_participante,),
    )
    row = cursor.fetchone()
    cursor.close()
    conn.close()

    if row:
        raise ReglaNegocioError("El participante tiene una sanción activa y no puede participar en reservas.")


# ============================
# Validación compuesta para agregar participante a reserva
# ============================

def validar_puede_agregarse_a_reserva(ci_participante: int, id_reserva: int) -> None:
    """
    Aplica TODAS las reglas de negocio relacionadas al participante:
    - participante existe
    - reserva existe y está activa
    - participante no sancionado
    - no tener más de 2 horas reservadas en el mismo día
    - no tener más de 3 reservas activas en la misma semana
    - no tener otra reserva superpuesta en el mismo horario
    """

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # 1) Verificar que el participante exista
    cursor.execute(
        "SELECT 1 FROM participante WHERE ci = %s",
        (ci_participante,),
    )
    if not cursor.fetchone():
        cursor.close()
        conn.close()
        raise ReglaNegocioError("El participante indicado no existe.")

    # 2) Verificar sanciones activas
    cursor.execute(
        """
        SELECT 1
        FROM sancion_participante
        WHERE ci_participante = %s
          AND CURDATE() BETWEEN fecha_inicio AND fecha_fin
        LIMIT 1
        """,
        (ci_participante,),
    )
    if cursor.fetchone():
        cursor.close()
        conn.close()
        raise ReglaNegocioError("El participante tiene una sanción activa y no puede participar en reservas.")

    # 3) Obtener datos de la reserva a la que se quiere agregar
    cursor.execute(
        """
        SELECT r.id_reserva, r.fecha, r.estado,
               t.hora_inicio, t.hora_fin
        FROM reserva r
        JOIN turno t ON t.id_turno = r.id_turno
        WHERE r.id_reserva = %s
        """,
        (id_reserva,),
    )
    reserva = cursor.fetchone()

    if not reserva:
        cursor.close()
        conn.close()
        raise ReglaNegocioError("La reserva indicada no existe.")

    if reserva["estado"] != "activa":
        cursor.close()
        conn.close()
        raise ReglaNegocioError("Solo se pueden agregar participantes a reservas activas.")

    fecha_reserva = reserva["fecha"]
    hora_ini_nueva = reserva["hora_inicio"]
    hora_fin_nueva = reserva["hora_fin"]

    # 4) Obtener todas las reservas ACTIVAS del participante
    cursor.execute(
        """
        SELECT r.fecha, r.estado,
               t.hora_inicio, t.hora_fin
        FROM reserva_participante rp
        JOIN reserva r ON r.id_reserva = rp.id_reserva
        JOIN turno t ON t.id_turno = r.id_turno
        WHERE rp.ci_participante = %s
          AND r.estado = 'activa'
        """,
        (ci_participante,),
    )
    reservas_participante = cursor.fetchall()

    cursor.close()
    conn.close()

    # Construir datetime para la nueva reserva
    nueva_ini = datetime.combine(fecha_reserva, hora_ini_nueva)
    nueva_fin = datetime.combine(fecha_reserva, hora_fin_nueva)

    # Contadores para reglas
    total_horas_dia = 0.0
    total_reservas_semana = 0
    semana_nueva = obtener_semana_del_anio(nueva_ini)

    for r in reservas_participante:
        fecha_exist = r["fecha"]
        hora_ini_exist = r["hora_inicio"]
        hora_fin_exist = r["hora_fin"]

        exist_ini = datetime.combine(fecha_exist, hora_ini_exist)
        exist_fin = datetime.combine(fecha_exist, hora_fin_exist)

        # a) Regla de 2 horas por día
        if fecha_exist == fecha_reserva:
            total_horas_dia += diferencia_en_horas(exist_ini, exist_fin)

        # b) Regla de 3 reservas activas por semana
        if obtener_semana_del_anio(exist_ini) == semana_nueva:
            total_reservas_semana += 1

        # c) No superposición de horarios
        if se_superpone(nueva_ini, nueva_fin, exist_ini, exist_fin):
            raise ReglaNegocioError(
                "El participante ya tiene otra reserva activa en un horario superpuesto."
            )

    # Sumar la nueva reserva a las horas del día
    total_horas_dia += diferencia_en_horas(nueva_ini, nueva_fin)

    if total_horas_dia > 2:
        raise ReglaNegocioError(
            "El participante superaría el máximo de 2 horas reservadas en el mismo día."
        )

    # Sumar la nueva reserva al conteo semanal
    total_reservas_semana += 1

    if total_reservas_semana > 3:
        raise ReglaNegocioError(
            "El participante superaría el máximo de 3 reservas activas en la misma semana."
        )
