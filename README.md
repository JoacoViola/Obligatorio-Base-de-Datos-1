# Sistema de Gestión de Salas – Proyecto Bases de Datos I
### FastAPI + MySQL + Docker + React/Vite

Este proyecto implementa un sistema completo para gestionar salas de estudio, reservas, participantes, sanciones y reportes, utilizando un **backend en FastAPI**, **frontend en React**, y una **base de datos MySQL en Docker**.

---

## ✅ Requisitos

### Backend + Base de Datos
- Docker  
- Docker Compose  

### Frontend
- Node.js 18+  
- npm 8+  

---

##  Instalación y Ejecución

### 🔶 1. Clonar el repositorio

```sh
git clone <URL_DEL_REPO>
cd Obligatorio
```


### 🔶 2. Backend + MySQL (Docker)

#### ▶️ Construir imágenes

```sh
docker-compose build
```

#### ▶️ Iniciar servicios

```sh
docker-compose up
```

#### 🟦 Iniciar en segundo plano

```sh
docker-compose up -d
```

#### ⏹ Detener servicios

```sh
docker-compose down
```

#### 🌐 Acceso al backend

- API base → http://localhost:8000  
- Swagger UI → http://localhost:8000/docs  

---

### 🔶 2. Frontend (React + Vite + TailwindCSS)

#### 📂 Entrar al frontend

```sh
cd frontend
```

#### 📦 Instalar dependencias

```sh
npm install
```

#### ▶️ Ejecutar

```sh
npm run dev
```

#### 🌐 Abrir en navegador

http://localhost:5173

---

## 📁 Estructura del Proyecto

```
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
├── docs                # Informe y documentación
│
└── frontend
    ├── app
    ├── components
    │   └── ui
    ├── hooks
    ├── lib
    └── src
        ├── components
        ├── hooks
        ├── pages       # Pantallas del sistema
        └── utils
    └── styles          # Estilos globales
    ...
```

---

## 📋 Descripción Breve del Sistema

El sistema permite:

---

### ✔ Gestión de salas
- Altas, bajas y edición  
- Asignación de turnos  
- Control de capacidad  

---

### ✔ Gestión de reservas
Incluye validaciones de negocio como:

- No superposición de horarios  
- Máximo **2 horas por día por participante**  
- Máximo **3 reservas por semana**  
- La sala no puede estar ocupada  
- Reserva fija de **1 hora**  
- Finalizar, cancelar y administrar participantes  

---

### ✔ Participantes
- CRUD completo  
- Vinculado al sistema de login  

---

### ✔ Sanciones
- Sanciones manuales  
- Sanciones automáticas por inasistencia (duración: **2 meses**)  

---

### ✔ Autenticación
- Contraseñas hasheadas con **bcrypt**  
- Login básico  

---

### ✔ Reportes
Consultas estadísticas sobre:

- Uso de salas  
- Ocupación  
- Reservas  
- Asistencias  
- Cancelaciones  

---
