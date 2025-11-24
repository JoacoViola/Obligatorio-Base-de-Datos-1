from fastapi import APIRouter, HTTPException
from models.login_model import LoginCrear
from services.login_service import crear_login, autenticar_login

login_router = APIRouter(prefix="/login", tags=["Login"])


# Crear usuario login
@login_router.post("/")
def crear_usuario_login(body: LoginCrear):
    ok, error = crear_login(body.correo, body.contrasenia)

    if ok:
        return {"message": "Usuario creado en login correctamente"}
    else:
        raise HTTPException(status_code=400, detail=error)


# Autenticar usuario
@login_router.post("/auth")
def autenticar_usuario(body: LoginCrear):
    ok, error = autenticar_login(body.correo, body.contrasenia)

    if ok:
        return {"message": "Autenticación correcta"}
    else:
        raise HTTPException(status_code=401, detail=error)


# ======================================
# DELETE /login/{correo}
# Eliminar login
# ======================================
@login_router.delete("/{correo}")
def eliminar_login(correo: str):
    ok, error = eliminar_login_service(correo)

    if ok:
        return {"message": "Login eliminado correctamente"}
    else:
        raise HTTPException(status_code=400, detail=error)
