from pydantic import BaseModel, EmailStr, constr

class LoginBase(BaseModel):
    correo: EmailStr

class LoginCrear(LoginBase):
    contrasenia: constr(min_length=4)

class LoginActualizar(BaseModel):
    contrasenia: constr(min_length=4)

class LoginAutenticar(BaseModel):
    correo: EmailStr
    contrasenia: str

class LoginRespuesta(LoginBase):
    pass
