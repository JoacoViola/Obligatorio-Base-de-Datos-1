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


from fastapi import APIRouter, HTTPException
from models.login_model import LoginUpdate
from services.login_service import crear_login, autenticar_login, actualizar_contrasenia

login_router = APIRouter(prefix="/login", tags=["Login"])


@login_router.patch("/{correo}")
def patch_contrasenia(correo: str, body: LoginUpdate):
    ok = actualizar_contrasenia(correo, body.nueva_contrasenia)

    if ok:
        return {"message": "Contraseña actualizada correctamente"}

    raise HTTPException(status_code=400, detail="No se pudo actualizar la contraseña")
