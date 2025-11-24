from fastapi import APIRouter, HTTPException
from models.sancion_model import SancionCrear, SancionRespuesta
from services.sancion_service import (
    crear_sancion,
    obtener_sanciones,
    actualizar_sancion,
    eliminar_sancion
)

sanciones_router = APIRouter(prefix="/sanciones", tags=["Sanciones"])


# ============================
# POST Crear sanción
# ============================
@sanciones_router.post("/", response_model=SancionRespuesta)
def crear(body: SancionCrear):
    ok, result = crear_sancion(body.ci_participante, body.fecha_inicio, body.fecha_fin)
    if not ok:
        raise HTTPException(status_code=400, detail=result)

    return {
        "id_sancion": result,
        "ci_participante": body.ci_participante,
        "fecha_inicio": body.fecha_inicio,
        "fecha_fin": body.fecha_fin
    }


# ============================
# GET obtener sanciones
# ============================
@sanciones_router.get("/", response_model=list[SancionRespuesta])
def listar_todas():
    return obtener_sanciones()


@sanciones_router.get("/participante/{ci}", response_model=list[SancionRespuesta])
def listar_por_ci(ci: int):
    return obtener_sanciones(ci)


# ============================
# PATCH actualizar sanción
# ============================
@sanciones_router.patch("/{id_sancion}")
def actualizar(id_sancion: int, body: SancionCrear):
    ok, error = actualizar_sancion(
        id_sancion,
        fecha_inicio=body.fecha_inicio,
        fecha_fin=body.fecha_fin
    )
    if ok:
        return {"message": "Sanción actualizada correctamente"}
    raise HTTPException(status_code=400, detail=error)


# ============================
# DELETE eliminar sanción
# ============================
@sanciones_router.delete("/{id_sancion}")
def eliminar(id_sancion: int):
    ok, error = eliminar_sancion(id_sancion)
    if ok:
        return {"message": "Sanción eliminada correctamente"}
    raise HTTPException(status_code=400, detail=error)
