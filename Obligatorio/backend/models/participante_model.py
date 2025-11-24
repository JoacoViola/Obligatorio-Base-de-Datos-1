# backend/models/participante_model.py

from pydantic import BaseModel, EmailStr, constr


# ===========================
# MODELOS BASE
# ===========================

class ParticipanteBase(BaseModel):
    nombre: constr(max_length=50)
    apellido: constr(max_length=50)
    email: EmailStr


# ===========================
# CREAR
# ===========================

class ParticipanteCrear(ParticipanteBase):
    ci: int


# ===========================
# RESPUESTA (GET)
# ===========================

class Participante(ParticipanteBase):
    ci: int

    class Config:
        orm_mode = True


# ===========================
# ACTUALIZAR
# ===========================

class ParticipanteUpdate(BaseModel):
    nombre: constr(max_length=50) | None = None
    apellido: constr(max_length=50) | None = None
    email: EmailStr | None = None
