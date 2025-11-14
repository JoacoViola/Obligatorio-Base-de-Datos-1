from pydantic import BaseModel, EmailStr, constr

class Participante(BaseModel):
    ci: int
    nombre: constr(max_length=50)
    apellido: constr(max_length=50)
    email: EmailStr
