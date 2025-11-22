"use client"

import { useState, useEffect } from "react"
import "./CRUD.css"
import FormModal from "../components/FormModal"
import Table from "../components/Table"
import { useFetch } from "../hooks/useFetch"
import { apiClient } from "../utils/api"

interface Sancion {
  id: number
  participante: string
  razon: string
  fechaInicio: string
  fechaFin: string
  estado: "activa" | "vencida"
}

export default function Sanciones() {
  const { data: sanciones, loading, error } = useFetch<Sancion[]>("http://localhost:8000/api/sanciones", [])
  const [localSanciones, setLocalSanciones] = useState<Sancion[]>([])

  useEffect(() => {
    if (sanciones) {
      setLocalSanciones(sanciones)
    }
  }, [sanciones])

  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Partial<Sancion>>({})

  const handleAdd = () => {
    setEditingId(null)
    setFormData({})
    setShowModal(true)
  }

  const handleEdit = (sancion: Sancion) => {
    setEditingId(sancion.id)
    setFormData(sancion)
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Está seguro de eliminar esta sanción?")) {
      try {
        await apiClient.delete(`/api/sanciones/${id}`)
        setLocalSanciones(localSanciones.filter((s) => s.id !== id))
      } catch (err) {
        alert(`Error al eliminar: ${err instanceof Error ? err.message : "Error desconocido"}`)
      }
    }
  }

  const handleSave = async () => {
    if (!formData.participante || !formData.razon || !formData.fechaInicio || !formData.fechaFin) {
      alert("Por favor complete todos los campos")
      return
    }

    try {
      if (editingId) {
        const updated = await apiClient.put(`/api/sanciones/${editingId}`, formData)
        setLocalSanciones(localSanciones.map((s) => (s.id === editingId ? updated : s)))
      } else {
        const newSancion = await apiClient.post("/api/sanciones", formData)
        setLocalSanciones([...localSanciones, newSancion])
      }
      setShowModal(false)
    } catch (err) {
      alert(`Error al guardar: ${err instanceof Error ? err.message : "Error desconocido"}`)
    }
  }

  const columns = [
    { key: "participante", label: "Participante" },
    { key: "razon", label: "Razón" },
    { key: "fechaInicio", label: "Fecha Inicio" },
    { key: "fechaFin", label: "Fecha Fin" },
    { key: "estado", label: "Estado" },
  ]

  return (
    <div className="crud-page">
      <div className="page-header">
        <h2>Sanciones</h2>
        <button className="btn btn-primary" onClick={handleAdd}>
          + Nueva Sanción
        </button>
      </div>

      {loading && <div className="loading-message">Cargando sanciones...</div>}
      {error && <div className="error-message">Error: {error.message}</div>}

      {!loading && !error && (
        <div className="card">
          <Table columns={columns} data={localSanciones} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      )}

      {showModal && (
        <FormModal
          title={editingId ? "Editar Sanción" : "Nueva Sanción"}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        >
          <div className="form-group">
            <label>Participante</label>
            <select
              value={formData.participante || ""}
              onChange={(e) => setFormData({ ...formData, participante: e.target.value })}
            >
              <option value="">Seleccionar...</option>
              <option value="Juan López">Juan López</option>
              <option value="María García">María García</option>
              <option value="Carlos Rodríguez">Carlos Rodríguez</option>
            </select>
          </div>
          <div className="form-group">
            <label>Razón de la Sanción</label>
            <select value={formData.razon || ""} onChange={(e) => setFormData({ ...formData, razon: e.target.value })}>
              <option value="">Seleccionar...</option>
              <option value="No asistencia a reserva">No asistencia a reserva</option>
              <option value="Daño de instalaciones">Daño de instalaciones</option>
              <option value="Reserva excesiva">Reserva excesiva</option>
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Fecha Inicio</label>
              <input
                type="date"
                value={formData.fechaInicio || ""}
                onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Fecha Fin</label>
              <input
                type="date"
                value={formData.fechaFin || ""}
                onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Estado</label>
            <select
              value={formData.estado || ""}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value as any })}
            >
              <option value="">Seleccionar...</option>
              <option value="activa">Activa</option>
              <option value="vencida">Vencida</option>
            </select>
          </div>
        </FormModal>
      )}
    </div>
  )
}
