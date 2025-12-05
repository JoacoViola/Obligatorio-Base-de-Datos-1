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
}

export default function Participantes() {
  const {
    data: participantes,
    loading,
    error,
  } = useFetch<Participante[]>("http://localhost:8000/participantes", [])
  const [localParticipantes, setLocalParticipantes] = useState<Participante[]>([])

  useEffect(() => {
    if (participantes) {
      // Backend identifies participants by `ci`. Table expects `id` for keys/actions,
      // so normalize each participante to include `id = ci`.
      setLocalParticipantes(
        participantes.map((p: any) => ({ ...p, id: p.ci }))
      )
    }
  }, [participantes])

  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  type FormShape = Partial<Participante> & { password?: string }
  const [formData, setFormData] = useState<FormShape>({})

  const handleAdd = () => {
    setEditingId(null)
    setFormData({})
    setShowModal(true)
  }

  const handleEdit = (participante: Participante) => {
    setEditingId(participante.id)
    // don't populate password when editing
    const { id, ci, nombre, apellido, email } = participante
    setFormData({ id, ci, nombre, apellido, email })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    const ci = typeof id === "number" ? id : (id?.ci ?? id?.id)
    if (!ci) {
      alert("No se pudo determinar el CI del participante a eliminar")
      return
    }

    if (confirm("¿Está seguro de eliminar este participante?")) {
      try {
        await apiClient.delete(`/participantes/${ci}`)
        setLocalParticipantes(localParticipantes.filter((p) => p.id !== ci))
      } catch (err) {
        alert(`Error al eliminar: ${err instanceof Error ? err.message : "Error desconocido"}`)
      }
    }
  }

  const handleSave = async () => {
    if (!formData.ci || !formData.nombre || !formData.apellido || !formData.email) {
      alert("Por favor complete todos los campos")
      return
    }
    try {
      if (editingId) {
        // Use PATCH to update by CI
        await apiClient.patch(`/participantes/${editingId}`, {
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
        })
        setLocalParticipantes(localParticipantes.map((p) => (p.id === editingId ? { ...p, nombre: formData.nombre, apellido: formData.apellido, email: formData.email } : p)))
      } else {
        // For creation: first create login, then create participante
        if (!formData.password) {
          alert("Por favor ingrese una contraseña para el nuevo participante")
          return
        }

        // Create login (POST /login/)
        await apiClient.post(`/login/`, {
          correo: formData.email,
          contrasenia: formData.password,
        })

        // Then create participante
        const newParticipante = await apiClient.post(`/participantes`, {
          ci: formData.ci,
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
        })
        // API returns body with ci, nombre, apellido, email. Normalize id for table.
        setLocalParticipantes([...localParticipantes, { ...newParticipante, id: newParticipante.ci }])
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
        {!editingId && (
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={formData.password || ""}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Contraseña"
            />
          </div>
        )}
      </FormModal>
      )}
    </div>
  )
}
