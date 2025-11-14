from fastapi import APIRouter, HTTPException
from models.sancion_model import SancionCrear
from services.sancion_service import listar_sanciones, crear_sancion

sanciones_router = APIRouter(prefix="/sanciones", tags=["Sanciones"])


# =========================
# GET /sanciones
# =========================
@sanciones_router.get("/")
def obtener_sanciones():
    return listar_sanciones()


# =========================
# POST /sanciones
# Registrar sanciones manualmente
# =========================
@sanciones_router.post("/")
def agregar_sancion(s: SancionCrear):
    ok, error = crear_sancion(s.ci_participante, s.fecha_inicio, s.fecha_fin)

    if ok:
        return {"message": "Sanción registrada correctamente"}
    else:
        raise HTTPException(status_code=400, detail=f"Error al registrar sanción: {error}")
