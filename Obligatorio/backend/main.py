from fastapi import FastAPI
from routes.participantes import participantes_router
from routes.salas import salas_router
from routes.reservas import reservas_router
from routes.sanciones import sanciones_router
from routes.reportes import reportes_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Sistema de Gestión de Salas UCU",
    description="Backend del obligatorio de Bases de Datos 1 - UCU",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(participantes_router)
app.include_router(salas_router)
app.include_router(reservas_router)
app.include_router(sanciones_router)
app.include_router(reportes_router)

@app.get("/")
def home():
    return {"message": "API funcionando correctamente 🚀"}


from routes.login import login_router

app.include_router(login_router)
