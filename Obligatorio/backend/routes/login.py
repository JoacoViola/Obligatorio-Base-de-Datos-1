from fastapi import APIRouter, HTTPException
from models.login_model import (
    LoginCrear,
    LoginActualizar,
    LoginAutenticar,
    LoginRespuesta
)
from services.login_service import (
    crear_login,
    obtener_login,
    eliminar_login,
    actualizar_login,
    autenticar_login
)

login_router = APIRouter(prefix="/login", tags=["Login"])


# ============================
# POST /login (crear)
# ============================
@login_router.post("/")
def crear_login_endpoint(body: LoginCrear):
    ok, error = crear_login(body.correo, body.contrasenia)

    if ok:
        return {"message": "Login creado correctamente"}
    else:
        raise HTTPException(status_code=400, detail=error)


# ============================
# GET /login/{correo}
# ============================
@login_router.get("/{correo}", response_model=LoginRespuesta)
def obtener_login_endpoint(correo: str):
    login = obtener_login(correo)

    if not login:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    return login


# ============================
# PATCH /login/{correo}
# ============================
@login_router.patch("/{correo}")
def actualizar_login_endpoint(correo: str, body: LoginActualizar):
    ok, error = actualizar_login(correo, body.contrasenia)

    if ok:
        return {"message": "Contraseña actualizada correctamente"}
    else:
        raise HTTPException(status_code=400, detail=error)


# ============================
# DELETE /login/{correo}
# ============================
@login_router.delete("/{correo}")
def eliminar_login_endpoint(correo: str):
    ok, error = eliminar_login(correo)

    if ok:
        return {"message": "Login eliminado correctamente"}
    else:
        raise HTTPException(status_code=400, detail=error)


# ============================
# POST /login/authenticate
# ============================
@login_router.post("/authenticate")
def autenticar_login_endpoint(body: LoginAutenticar):
    ok, error = autenticar_login(body.correo, body.contrasenia)

    if ok:
        return {"message": "Autenticación exitosa"}
    else:
        raise HTTPException(status_code=401, detail=error)
