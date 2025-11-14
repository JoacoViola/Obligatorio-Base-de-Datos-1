from datetime import date
from typing import Literal

from pydantic import BaseModel, Field


EstadoReserva = Literal["activa", "cancelada", "sin asistencia", "finalizada"]


class ReservaBase(BaseModel):
    nombre_sala: str = Field(max_length=100)
    edificio: str = Field(max_length=100)
    fecha: date
    id_turno: int


class ReservaCrear(ReservaBase):
    """
    Modelo para crear una reserva.
    El estado se deja siempre en 'activa' al crear.
    """
    pass


class ReservaRespuesta(ReservaBase):
    id_reserva: int
    estado: EstadoReserva


class ReservaParticipanteAdd(BaseModel):
    ci_participante: int


class AsistenciaUpdate(BaseModel):
    ci_participante: int
    asistencia: bool
