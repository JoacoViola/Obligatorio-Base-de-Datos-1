from fastapi import APIRouter, HTTPException
from models.participante_model import ParticipanteCrear
from services.participante_service import crear_participante, listar_participantes

participantes_router = APIRouter(prefix="/participantes", tags=["Participantes"])


@participantes_router.post("/")
def crear_nuevo_participante(body: ParticipanteCrear):
    ok, error = crear_participante(
        ci=body.ci,
        nombre=body.nombre,
        apellido=body.apellido,
        email=body.email
    )

    if ok:
        return {"message": "Participante creado correctamente"}
    else:
        raise HTTPException(status_code=400, detail=error)


@participantes_router.get("/")
def obtener_participantes():
    return listar_participantes()


# ======================================
# DELETE /participantes/{ci}
# Eliminar participante
# ======================================
@participantes_router.delete("/{ci}")
def eliminar_participante(ci: int):
    ok, error = eliminar_participante_service(ci)

    if ok:
        return {"message": "Participante eliminado correctamente"}
    else:
        raise HTTPException(status_code=400, detail=error)
