# Sistema de Gestión de Salas – Backend (FastAPI + MySQL + Docker)

Este proyecto implementa un sistema backend para la gestión de salas de estudio de la Universidad Católica del Uruguay.
Permite administrar **salas, reservas, participantes, sanciones y reportes**, todo respaldado por una base de datos MySQL y
expuesto mediante una API REST construida con **FastAPI**.

El backend está completamente dockerizado para facilitar su instalación y despliegue.

## Requisitos
- Docker
- Docker Compose

## Instalación y ejecución

Cloná el repositorio:

```sh
git clone <URL_DEL_REPO>
cd <carpeta_del_proyecto>
```

### 1. Construir las imágenes
```sh
docker-compose build
```

### 2. Levantar los servicios
```sh
docker-compose up
```

### 3. Levantar en segundo plano (opcional)
```sh
docker-compose up -d
```

### 4. Detener los servicios
```sh
docker-compose down
```

## Acceso al backend

Una vez levantado, el backend queda disponible en:

```
http://localhost:8000
```

Documentación interactiva automática de FastAPI:

- Swagger UI → http://localhost:8000/docs
- Redoc → http://localhost:8000/redoc

## Estructura del proyecto

- routes/ → Routers de FastAPI (salas, reservas, participantes, sanciones y reportes)
- models/ → Modelos Pydantic para requests y responses
- services/ → Lógica de negocio y acceso a la base de datos
- database/ → Configuración MySQL y scripts auxiliares
- docker-compose.yml → Definición de los servicios Docker
- main.py → Configuración principal de FastAPI

## Descripción del sistema

El backend ofrece funcionalidades para:

- Gestión de salas (alta, baja, modificación, listado)
- Gestión de reservas (crear, cancelar, finalizar, agregar participantes)
- Gestión de participantes y sanciones
- Generación de reportes estadísticos sobre uso de salas, asistencia, cancelaciones, ocupación, etc.
- Integración completa con MySQL utilizando procedimientos almacenados

El objetivo del proyecto es servir como API para un sistema de gestión académico/administrativo, permitiendo un flujo claro y robusto de administración de espacios compartidos.