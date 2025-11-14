from pydantic import BaseModel, Field
from datetime import date


class SancionBase(BaseModel):
    ci_participante: int = Field(..., description="Cédula del participante")
    fecha_inicio: date
    fecha_fin: date


class SancionCrear(SancionBase):
    """Modelo para crear sanciones manualmente"""
    pass


class SancionRespuesta(SancionBase):
    id_sancion: int
