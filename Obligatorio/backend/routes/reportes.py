from fastapi import APIRouter, HTTPException

from services.reporte_service import (
    reporte_salas_mas_reservadas,
    reporte_turnos_mas_usados,
    reporte_participantes_mas_reservas,
    reporte_reservas_por_semana,
    reporte_sanciones_vigentes,
    reporte_cancelaciones_por_mes,
    reporte_salas_no_utilizadas,
    reporte_participantes_mas_sanciones,
    reporte_ocupacion_por_sala,
    reporte_asistencia_general,
    reporte_reservas_por_participante
)

reportes_router = APIRouter(prefix="/reportes", tags=["Reportes"])


@reportes_router.get("/salas-mas-reservadas")
def r1():
    return reporte_salas_mas_reservadas()


@reportes_router.get("/turnos-mas-usados")
def r2():
    return reporte_turnos_mas_usados()


@reportes_router.get("/participantes-mas-reservas")
def r3():
    return reporte_participantes_mas_reservas()


@reportes_router.get("/reservas-por-semana")
def r4():
    return reporte_reservas_por_semana()


@reportes_router.get("/sanciones-vigentes")
def r5():
    return reporte_sanciones_vigentes()


@reportes_router.get("/cancelaciones-por-mes")
def r6():
    return reporte_cancelaciones_por_mes()


@reportes_router.get("/salas-no-utilizadas")
def r7():
    return reporte_salas_no_utilizadas()


@reportes_router.get("/participantes-mas-sanciones")
def r8():
    return reporte_participantes_mas_sanciones()


# ======== REPORTES PROPIOS ========

@reportes_router.get("/ocupacion-por-sala")
def r9():
    return reporte_ocupacion_por_sala()


@reportes_router.get("/asistencia-general")
def r10():
    return reporte_asistencia_general()


@reportes_router.get("/reservas-por-participante/{ci_participante}")
def r11(ci_participante: int):
    return reporte_reservas_por_participante(ci_participante)
