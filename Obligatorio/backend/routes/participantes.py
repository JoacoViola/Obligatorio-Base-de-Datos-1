from fastapi import APIRouter, HTTPException
from models.participante_model import Participante, ParticipanteCrear, ParticipanteActualizar
from services.participantes_service import (
    crear_participante,
    obtener_participantes,
    obtener_participante_por_ci,
    actualizar_participante,
    eliminar_participante
)

participantes_router = APIRouter(prefix="/participantes", tags=["Participantes"])


# ============================
# POST - Crear participante
# ============================
@participantes_router.post("/", response_model=Participante)
def crear(body: ParticipanteCrear):
    ok, error = crear_participante(body.ci, body.nombre, body.apellido, body.email)

    if not ok:
        raise HTTPException(status_code=400, detail=error)

    return body


# ============================
# GET - Listar todos
# ============================
@participantes_router.get("/", response_model=list[Participante])
def listar_todos():
    return obtener_participantes()


# ============================
# GET - Obtener por CI
# ============================
@participantes_router.get("/{ci}", response_model=Participante)
def obtener(ci: int):
    row = obtener_participante_por_ci(ci)
    if not row:
        raise HTTPException(status_code=404, detail="Participante no encontrado")
    return row


# ============================
# PATCH - Actualizar participante
# ============================
@participantes_router.patch("/{ci}")
def actualizar(ci: int, body: ParticipanteActualizar):
    ok, error = actualizar_participante(
        ci,
        nombre=body.nombre,
        apellido=body.apellido,
        email=body.email
    )
    if ok:
        return {"message": "Participante actualizado correctamente"}
    raise HTTPException(status_code=400, detail=error)


# ============================
# DELETE - Eliminar participante
# ============================
@participantes_router.delete("/{ci}")
def borrar(ci: int):
    ok, error = eliminar_participante(ci)
    if ok:
        return {"message": "Participante eliminado correctamente"}
    raise HTTPException(status_code=400, detail=error)
