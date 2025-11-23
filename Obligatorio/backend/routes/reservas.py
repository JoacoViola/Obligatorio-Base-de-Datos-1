from fastapi import APIRouter, HTTPException

from models.reserva_model import (
    ReservaCrear,
    ReservaParticipanteAdd,
    AsistenciaUpdate
)

from utils.validators import ReglaNegocioError

from services.reserva_service import (
    listar_reservas,
    obtener_reserva_por_id,
    crear_reserva,
    cancelar_reserva,
    finalizar_reserva,
    agregar_participante_a_reserva,
    listar_participantes_de_reserva,
    actualizar_asistencia
)

reservas_router = APIRouter(prefix="/reservas", tags=["Reservas"])


# ======================================
# GET /reservas → listar todas
# ======================================
@reservas_router.get("/")
def obtener_reservas():
    return listar_reservas()


# ======================================
# GET /reservas/{id} → detalle
# ======================================
@reservas_router.get("/{id_reserva}")
def obtener_reserva(id_reserva: int):
    reserva = obtener_reserva_por_id(id_reserva)
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
    return reserva


# ======================================
# POST /reservas → crear
# ======================================
@reservas_router.post("/")
def crear_nueva_reserva(r: ReservaCrear):
    try:
        new_id, error = crear_reserva(r.nombre_sala, r.edificio, r.fecha, r.id_turno)

        if error is None:
            return {"message": "Reserva creada correctamente", "id_reserva": new_id}
        else:
            raise HTTPException(status_code=400, detail=error)

    except ReglaNegocioError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ======================================
# PATCH /reservas/{id}/cancelar
# ======================================
@reservas_router.patch("/{id_reserva}/cancelar")
def cancelar_reserva_endpoint(id_reserva: int):
    ok = cancelar_reserva(id_reserva)
    if ok:
        return {"message": "Reserva cancelada correctamente"}
    else:
        raise HTTPException(status_code=400, detail="No se pudo cancelar la reserva")


# ======================================
# PATCH /reservas/{id}/finalizar
# ======================================
@reservas_router.patch("/{id_reserva}/finalizar")
def finalizar_reserva_endpoint(id_reserva: int):
    try:
        ok, error = finalizar_reserva(id_reserva)
        if ok:
            return {"message": "Reserva finalizada correctamente"}
        else:
            raise HTTPException(status_code=400, detail=error)
    except ReglaNegocioError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ======================================
# POST /reservas/{id}/participantes
# Agregar participante a una reserva
# ======================================
@reservas_router.post("/{id_reserva}/participantes")
def agregar_participante(id_reserva: int, body: ReservaParticipanteAdd):

    try:
        ok, error = agregar_participante_a_reserva(id_reserva, body.ci_participante)

        if ok:
            return {"message": "Participante agregado correctamente a la reserva"}
        else:
            raise HTTPException(status_code=400, detail=error)

    except ReglaNegocioError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ======================================
# GET /reservas/{id}/participantes
# Listar participantes de una reserva
# ======================================
@reservas_router.get("/{id_reserva}/participantes")
def obtener_participantes_reserva(id_reserva: int):
    return listar_participantes_de_reserva(id_reserva)


# ======================================
# PATCH /reservas/{id}/asistencia
# Actualizar asistencia de un participante
# ======================================
@reservas_router.patch("/{id_reserva}/asistencia")
def actualizar_asistencia_reserva(id_reserva: int, body: AsistenciaUpdate):
    ok = actualizar_asistencia(id_reserva, body.ci_participante, body.asistencia)

    if ok:
        return {"message": "Asistencia actualizada correctamente"}
    else:
        raise HTTPException(status_code=400, detail="No se pudo actualizar la asistencia")
