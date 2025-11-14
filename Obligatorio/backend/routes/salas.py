from fastapi import APIRouter, HTTPException
from models.sala_model import Sala
from services.sala_service import (
    listar_salas,
    crear_sala,
    borrar_sala,
    modificar_sala
)

salas_router = APIRouter(prefix="/salas", tags=["Salas"])


# ======================================
# GET /salas → listar todas
# ======================================
@salas_router.get("/")
def obtener_salas():
    return listar_salas()


# ======================================
# POST /salas → crear sala
# ======================================
@salas_router.post("/")
def agregar_sala(s: Sala):
    success = crear_sala(s.nombre_sala, s.edificio, s.capacidad, s.tipo_sala)

    if success:
        return {"message": "Sala creada correctamente"}
    else:
        raise HTTPException(status_code=400, detail="Error al crear sala")


# ======================================
# DELETE /salas/{nombre}/{edificio}
# ======================================
@salas_router.delete("/{nombre_sala}/{edificio}")
def eliminar_sala(nombre_sala: str, edificio: str):
    success = borrar_sala(nombre_sala, edificio)

    if success:
        return {"message": "Sala eliminada correctamente"}
    else:
        raise HTTPException(status_code=404, detail="La sala no existe o no pudo eliminarse")


# ======================================
# PUT /salas/{nombre}/{edificio} → modificar sala
# ======================================
@salas_router.put("/{nombre_sala}/{edificio}")
def actualizar_sala(nombre_sala: str, edificio: str, s: Sala):
    success = modificar_sala(nombre_sala, edificio, s.capacidad, s.tipo_sala)

    if success:
        return {"message": "Sala modificada correctamente"}
    else:
        raise HTTPException(status_code=400, detail="No se pudo modificar la sala")
