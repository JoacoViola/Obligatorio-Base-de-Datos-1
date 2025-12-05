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
  hora: string
  participantes: any
  estado: "activa" | "cancelada" | "finalizada" | "sin_asistencia"
}

export default function Reservas() {
  const [reloadKey, setReloadKey] = useState(0)
  const { data: reservas, loading, error } = useFetch<any[]>("http://localhost:8000/reservas", [reloadKey])
  const [localReservas, setLocalReservas] = useState<Reserva[]>([])

  const [showParticipantsModal, setShowParticipantsModal] = useState(false)
  const [participantsList, setParticipantsList] = useState<any[]>([])
  const [participantsReservaName, setParticipantsReservaName] = useState<string>("")

  useEffect(() => {
    if (!reservas) return

    let mounted = true

    const enrich = async () => {
      try {
        const mapped = await Promise.all(
          reservas.map(async (r: any) => {
            const id = r.id_reserva ?? r.id
            // fetch participantes for count
            let participantesArr: any[] = []
            try {
              participantesArr = await apiClient.get(`/reservas/${id}/participantes`)
            } catch (e) {
              participantesArr = []
            }

            const count = participantesArr.length

            const participantesElem = (
              <button className="link-btn" onClick={() => openParticipants(id, r.nombre_sala || r.sala || "") }>
                {count}
              </button>
            )

            return {
              id,
              sala: r.nombre_sala || r.sala || "",
              edificio: r.edificio || "",
              fecha: r.fecha,
              hora: turnos[(r.id_turno ?? r.idTurno) - 1] || "",
              participantes: participantesElem,
              estado: r.estado,
            }
          })
        )

        if (mounted) setLocalReservas(mapped)
      } catch (err) {
        if (mounted) setLocalReservas([])
      }
    }

    enrich()

    return () => {
      mounted = false
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
        await apiClient.delete(`/reservas/${id}`)
        setReloadKey((k) => k + 1)
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
        await apiClient.put(`/reservas/${editingId}`, formData)
      } else {
        await apiClient.post(`/reservas`, formData)
      }
      setReloadKey((k) => k + 1)
      setShowModal(false)
    } catch (err) {
      alert(`Error al guardar: ${err instanceof Error ? err.message : "Error desconocido"}`)
    }
  }

  const columns = [
    { key: "sala", label: "Sala" },
    { key: "edificio", label: "Edificio" },
    { key: "fecha", label: "Fecha" },
    { key: "hora", label: "Hora" },
    { key: "participantes", label: "Participantes" },
    { key: "estado", label: "Estado" },
  ]

  // Turnos fijos (1..15)
  const turnos = [
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 13:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
    "18:00 - 19:00",
    "19:00 - 20:00",
    "20:00 - 21:00",
    "21:00 - 22:00",
    "22:00 - 23:00",
  ]

  const openParticipants = async (id_reserva: number, reservaName: string) => {
    try {
      const res = await apiClient.get(`/reservas/${id_reserva}/participantes`)
      setParticipantsList(res)
      setParticipantsReservaName(reservaName)
      setShowParticipantsModal(true)
    } catch (err) {
      alert(`Error al obtener participantes: ${err instanceof Error ? err.message : "Error desconocido"}`)
    }
  }

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

      {showParticipantsModal && (
        <FormModal
          title={`Participantes - ${participantsReservaName}`}
          onClose={() => setShowParticipantsModal(false)}
          onSave={() => setShowParticipantsModal(false)}
        >
          <div className="participants-list">
            {participantsList.length === 0 && <div>No hay participantes inscritos</div>}
            {participantsList.map((p) => (
              <div key={p.ci_participante} className="participant-item">
                <strong>{p.nombre} {p.apellido}</strong> — CI: {p.ci_participante}
              </div>
            ))}
          </div>
        </FormModal>
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
