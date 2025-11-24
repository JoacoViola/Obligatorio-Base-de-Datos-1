# backend/models/login_model.py

from pydantic import BaseModel, EmailStr, constr


class LoginBase(BaseModel):
    correo: EmailStr


class LoginCrear(LoginBase):
    contrasenia: constr(min_length=4)


class LoginUpdate(BaseModel):
    contrasenia: constr(min_length=4)
