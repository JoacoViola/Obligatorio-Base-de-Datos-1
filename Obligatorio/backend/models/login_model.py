from pydantic import BaseModel, EmailStr, constr


class LoginCrear(BaseModel):
    correo: EmailStr
    contrasenia: constr(min_length=6)


class LoginRespuesta(BaseModel):
    correo: EmailStr
