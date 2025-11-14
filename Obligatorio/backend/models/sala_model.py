from pydantic import BaseModel, constr
from typing import Literal

class Sala(BaseModel):
    nombre_sala: constr(max_length=100)
    edificio: constr(max_length=100)
    capacidad: int
    tipo_sala: Literal["libre", "posgrado", "docente"]
