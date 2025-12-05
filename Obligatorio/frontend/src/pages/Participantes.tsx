"use client"

import { useState, useEffect } from "react"
import "./CRUD.css"
import FormModal from "../components/FormModal"
import Table from "../components/Table"
import { useFetch } from "../hooks/useFetch"
import { apiClient } from "../utils/api"

interface Participante {
  id: number
  ci: string
  nombre: string
  apellido: string
  email: string
  tipo: "grado" | "posgrado" | "docente"
  programa: string
}

export default function Participantes() {
  const {
    data: participantes,
    loading,
    error,
  } = useFetch<Participante[]>(`${(import.meta as any).env?.VITE_API_URL || "http://localhost:8000"}/participantes`, [])
  const [localParticipantes, setLocalParticipantes] = useState<Participante[]>([])

  useEffect(() => {
    if (participantes) {
      setLocalParticipantes(participantes)
    }
  }, [participantes])

  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Partial<Participante>>({})

  const handleAdd = () => {
    setEditingId(null)
    setFormData({})
    setShowModal(true)
  }

  const handleEdit = (participante: Participante) => {
    setEditingId(participante.id)
    setFormData(participante)
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    // Backend no tiene endpoint DELETE para participantes
    alert("La eliminación de participantes no está disponible en el backend")
  }

  const handleSave = async () => {
    if (!formData.ci || !formData.nombre || !formData.apellido || !formData.email) {
      alert("Por favor complete todos los campos")
      return
    }

    try {
      if (editingId) {
        // Backend no tiene endpoint PUT para participantes
        alert("La edición de participantes no está disponible en el backend")
        return
      } else {
        await apiClient.post("/participantes", formData)
        // Refresh the list
        const apiBaseUrl = (import.meta as any).env?.VITE_API_URL || "http://localhost:8000"
        const response = await fetch(`${apiBaseUrl}/participantes`)
        const backendData = await response.json() as Participante[]
        setLocalParticipantes(backendData)
      }
      setShowModal(false)
    } catch (err) {
      alert(`Error al guardar: ${err instanceof Error ? err.message : "Error desconocido"}`)
    }
  }

  const columns = [
    { key: "ci", label: "CI" },
    { key: "nombre", label: "Nombre" },
    { key: "apellido", label: "Apellido" },
    { key: "email", label: "Email" },
    { key: "tipo", label: "Tipo" },
    { key: "programa", label: "Programa" },
  ]

  return (
    <div className="crud-page">
      <div className="page-header">
        <h2>Participantes</h2>
        <button className="btn btn-primary" onClick={handleAdd}>
          + Nuevo Participante
        </button>
      </div>

      {loading && <div className="loading-message">Cargando participantes...</div>}
      {error && <div className="error-message">Error: {error.message}</div>}

      {!loading && !error && (
        <div className="card">
          <Table columns={columns} data={localParticipantes} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      )}

      {showModal && (
        <FormModal
          title={editingId ? "Editar Participante" : "Nuevo Participante"}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        >
          <div className="form-group">
            <label>CI</label>
            <input
              type="text"
              value={formData.ci || ""}
              onChange={(e) => setFormData({ ...formData, ci: e.target.value })}
              placeholder="Ej: 12345678"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                value={formData.nombre || ""}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Nombre"
              />
            </div>
            <div className="form-group">
              <label>Apellido</label>
              <input
                type="text"
                value={formData.apellido || ""}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                placeholder="Apellido"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@ucu.edu.uy"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Tipo</label>
              <select
                value={formData.tipo || ""}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
              >
                <option value="">Seleccionar...</option>
                <option value="grado">Estudiante Grado</option>
                <option value="posgrado">Estudiante Posgrado</option>
                <option value="docente">Docente</option>
              </select>
            </div>
            <div className="form-group">
              <label>Programa</label>
              <input
                type="text"
                value={formData.programa || ""}
                onChange={(e) => setFormData({ ...formData, programa: e.target.value })}
                placeholder="Ej: Ingeniería"
              />
            </div>
          </div>
        </FormModal>
      )}
    </div>
  )
}
