from pydantic import BaseModel, EmailStr, constr


# Modelo para CREAR un participante
class ParticipanteCrear(BaseModel):
    ci: int
    nombre: constr(max_length=50)
    apellido: constr(max_length=50)
    email: EmailStr


# Modelo para RESPUESTA (GET)
class ParticipanteRespuesta(BaseModel):
    ci: int
    nombre: str
    apellido: str
    email: EmailStr


from pydantic import BaseModel, EmailStr, constr

class ParticipanteUpdate(BaseModel):
    nombre: constr(max_length=50) | None = None
    apellido: constr(max_length=50) | None = None
    email: EmailStr | None = None
