from fastapi import APIRouter, HTTPException
from models.participante_model import Participante
from services.participante_service import listar_participantes, crear_participante

participantes_router = APIRouter(prefix="/participantes", tags=["Participantes"])

@participantes_router.get("/")
def obtener_participantes():
    return listar_participantes()

@participantes_router.post("/")
def agregar_participante(p: Participante):
    success = crear_participante(p.ci, p.nombre, p.apellido, p.email)

    if success:
        return {"message": "Participante creado correctamente"}
    else:
        raise HTTPException(status_code=400, detail="Error al crear participante")
