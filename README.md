🏫 Sistema de Gestión de Salas – Proyecto Full Stack

FastAPI + MySQL + Docker + React/Vite

Este proyecto implementa un sistema completo para gestionar salas de estudio, reservas, participantes, sanciones y reportes, utilizando un backend en FastAPI, frontend en React y una base de datos MySQL en Docker.

✅ Requisitos
Backend + Base de Datos

Docker

Docker Compose

Frontend

Node.js 18+

npm 8+

🚀 Instalación y Ejecución

Clonar el repositorio:

git clone <URL_DEL_REPO>
cd Obligatorio

▶️ 1. Backend + MySQL (Docker)
Construir imágenes:
docker-compose build

Iniciar servicios:
docker-compose up

Iniciar en segundo plano:
docker-compose up -d

Detener:
docker-compose down

Acceso al backend:
http://localhost:8000


Swagger UI:

http://localhost:8000/docs

▶️ 2. Frontend (React + Vite + TailwindCSS)

Entrar al frontend:

cd frontend


Instalar dependencias:

npm install


Ejecutar:

npm run dev


Abrir en navegador:

http://localhost:5173

📁 Estructura del Proyecto
Obligatorio
├── backend
│   ├── models          # Modelos Pydantic
│   ├── routes          # Endpoints FastAPI
│   ├── services        # Lógica negocio + DB
│   └── utils           # Validaciones, helpers, hashing
│
├── database
│   └── docker-entry    # Scripts SQL e inicialización
│
├── docs                # Evidencias y documentación
│
└── frontend
    ├── app
    ├── components
    │   └── ui
    ├── hooks
    ├── lib
    ├── src
    │   ├── components
    │   ├── hooks
    │   ├── pages       # Pantallas del sistema
    │   └── utils
    └── styles          # Estilos globales

🧠 Descripción Breve del Sistema

El sistema permite:

✔ Gestión de salas

Altas, bajas, edición, asignación de turnos y capacidad.

✔ Gestión de reservas

Crear, finalizar, cancelar y administrar participantes.
Incluye reglas de negocio:

No superposición de horarios

Máximo 2 horas por día por participante

Máximo 3 reservas por semana

La sala no puede estar ocupada

La reserva debe ser de 1 hora

✔ Participantes

CRUD completo vinculado al login.

✔ Sanciones

Sanciones manuales

Sanciones automáticas por inasistencia (2 meses)

✔ Autenticación

Contraseñas hasheadas con bcrypt + login básico.

✔ Reportes

Consultas estadísticas sobre ocupación y uso de salas.