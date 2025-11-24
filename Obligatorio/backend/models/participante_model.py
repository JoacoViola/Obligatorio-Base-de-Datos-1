from pydantic import BaseModel, EmailStr, constr

class Participante(BaseModel):
    ci: int
    nombre: constr(max_length=50)
    apellido: constr(max_length=50)
    email: EmailStr

class ParticipanteCrear(BaseModel):
    ci: int
    nombre: constr(max_length=50)
    apellido: constr(max_length=50)
    email: EmailStr

class ParticipanteActualizar(BaseModel):
    nombre: constr(max_length=50) | None = None
    apellido: constr(max_length=50) | None = None
    email: EmailStr | None = None
