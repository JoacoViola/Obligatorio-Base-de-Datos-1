"use client"

import { useState, useEffect } from "react"
import "./CRUD.css"
import FormModal from "../components/FormModal"
import Table from "../components/Table"
import { useFetch } from "../hooks/useFetch"
import { apiClient } from "../utils/api"

interface Reserva {
  id: number
  sala: string
  fecha: string
  horaInicio: string
  horaFin: string
  participantes: number
  estado: "activa" | "cancelada" | "finalizada" | "sin_asistencia"
}

export default function Reservas() {
  const { data: reservas, loading, error } = useFetch<Reserva[]>("http://localhost:8000/reservas", [])
  const [localReservas, setLocalReservas] = useState<Reserva[]>([])

  useEffect(() => {
    if (reservas) {
      setLocalReservas(reservas)
    }
  }, [reservas])

  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Partial<Reserva>>({})

  const handleAdd = () => {
    setEditingId(null)
    setFormData({})
    setShowModal(true)
  }

  const handleEdit = (reserva: Reserva) => {
    setEditingId(reserva.id)
    setFormData(reserva)
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Está seguro de eliminar esta reserva?")) {
      try {
        await apiClient.delete(`/api/reservas/${id}`)
        setLocalReservas(localReservas.filter((r) => r.id !== id))
      } catch (err) {
        alert(`Error al eliminar: ${err instanceof Error ? err.message : "Error desconocido"}`)
      }
    }
  }

  const handleSave = async () => {
    if (!formData.sala || !formData.fecha || !formData.horaInicio || !formData.horaFin) {
      alert("Por favor complete todos los campos obligatorios")
      return
    }

    try {
      if (editingId) {
        const updated = await apiClient.put(`/api/reservas/${editingId}`, formData)
        setLocalReservas(localReservas.map((r) => (r.id === editingId ? updated : r)))
      } else {
        const newReserva = await apiClient.post("/api/reservas", formData)
        setLocalReservas([...localReservas, newReserva])
      }
      setShowModal(false)
    } catch (err) {
      alert(`Error al guardar: ${err instanceof Error ? err.message : "Error desconocido"}`)
    }
  }

  const columns = [
    { key: "sala", label: "Sala" },
    { key: "fecha", label: "Fecha" },
    { key: "horaInicio", label: "Hora Inicio" },
    { key: "horaFin", label: "Hora Fin" },
    { key: "participantes", label: "Participantes" },
    { key: "estado", label: "Estado" },
  ]

  return (
    <div className="crud-page">
      <div className="page-header">
        <h2>Reservas</h2>
        <button className="btn btn-primary" onClick={handleAdd}>
          + Nueva Reserva
        </button>
      </div>

      {loading && <div className="loading-message">Cargando reservas...</div>}
      {error && <div className="error-message">Error: {error.message}</div>}

      {!loading && !error && (
        <div className="card">
          <Table columns={columns} data={localReservas} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      )}

      {showModal && (
        <FormModal
          title={editingId ? "Editar Reserva" : "Nueva Reserva"}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        >
          <div className="form-row">
            <div className="form-group">
              <label>Sala</label>
              <select value={formData.sala || ""} onChange={(e) => setFormData({ ...formData, sala: e.target.value })}>
                <option value="">Seleccionar...</option>
                <option value="Sala A-101">Sala A-101</option>
                <option value="Sala B-205">Sala B-205</option>
                <option value="Sala C-310">Sala C-310</option>
              </select>
            </div>
            <div className="form-group">
              <label>Fecha</label>
              <input
                type="date"
                value={formData.fecha || ""}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Hora Inicio</label>
              <input
                type="time"
                value={formData.horaInicio || ""}
                onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Hora Fin</label>
              <input
                type="time"
                value={formData.horaFin || ""}
                onChange={(e) => setFormData({ ...formData, horaFin: e.target.value })}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Participantes</label>
              <input
                type="number"
                value={formData.participantes || ""}
                onChange={(e) => setFormData({ ...formData, participantes: Number.parseInt(e.target.value) })}
                min="1"
              />
            </div>
            <div className="form-group">
              <label>Estado</label>
              <select
                value={formData.estado || ""}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value as any })}
              >
                <option value="">Seleccionar...</option>
                <option value="activa">Activa</option>
                <option value="cancelada">Cancelada</option>
                <option value="finalizada">Finalizada</option>
                <option value="sin_asistencia">Sin Asistencia</option>
              </select>
            </div>
          </div>
        </FormModal>
      )}
    </div>
  )
}
