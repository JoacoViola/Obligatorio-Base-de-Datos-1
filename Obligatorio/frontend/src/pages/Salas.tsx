"use client"

import { useState, useEffect } from "react"
import "./CRUD.css"
import FormModal from "../components/FormModal"
import Table from "../components/Table"
import { useFetch } from "../hooks/useFetch"
import { apiClient } from "../utils/api"

interface Sala {
  id: number
  nombre: string
  edificio: string
  capacidad: number
  tipo: "libre" | "posgrado" | "docente"
  ubicacion: string
}

export default function Salas() {
  const { data: salas, loading, error } = useFetch<Sala[]>("http://localhost:8000/salas/", [])
  const [localSalas, setLocalSalas] = useState<Sala[]>([])

  useEffect(() => {
    if (salas) {
      setLocalSalas(salas)
    }
  }, [salas])

  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Partial<Sala>>({})

  const handleAdd = () => {
    setEditingId(null)
    setFormData({})
    setShowModal(true)
  }

  const handleEdit = (sala: Sala) => {
    setEditingId(sala.id)
    setFormData(sala)
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Está seguro de eliminar esta sala?")) {
      try {
        await apiClient.delete(`/salas/${id}`)
        setLocalSalas(localSalas.filter((s) => s.id !== id))
      } catch (err) {
        alert(`Error al eliminar: ${err instanceof Error ? err.message : "Error desconocido"}`)
      }
    }
  }

  const handleSave = async () => {
    if (!formData.nombre || !formData.edificio || !formData.capacidad) {
      alert("Por favor complete todos los campos obligatorios")
      return
    }

    try {
      if (editingId) {
        const updated = await apiClient.put<Sala>(`/api/salas/${editingId}`, formData)
        setLocalSalas(localSalas.map((s) => (s.id === editingId ? updated : s)))
      } else {
        const newSala = await apiClient.post("/api/salas", formData)
        setLocalSalas([...localSalas, newSala])
      }
      setShowModal(false)
    } catch (err) {
      alert(`Error al guardar: ${err instanceof Error ? err.message : "Error desconocido"}`)
    }
  }

  const columns = [
    { key: "nombre", label: "Nombre" },
    { key: "edificio", label: "Edificio" },
    { key: "capacidad", label: "Capacidad" },
    { key: "tipo", label: "Tipo" },
    { key: "ubicacion", label: "Ubicación" },
  ]

  return (
    <div className="crud-page">
      <div className="page-header">
        <h2>Salas de Estudio</h2>
        <button className="btn btn-primary" onClick={handleAdd}>
          + Nueva Sala
        </button>
      </div>

      {loading && <div className="loading-message">Cargando salas...</div>}
      {error && <div className="error-message">Error: {error.message}</div>}

      {!loading && !error && (
        <div className="card">
          <Table columns={columns} data={localSalas} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      )}

      {showModal && (
        <FormModal
          title={editingId ? "Editar Sala" : "Nueva Sala"}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        >
          <div className="form-row">
            <div className="form-group">
              <label>Nombre de la Sala</label>
              <input
                type="text"
                value={formData.nombre || ""}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Sala A-101"
              />
            </div>
            <div className="form-group">
              <label>Edificio</label>
              <input
                type="text"
                value={formData.edificio || ""}
                onChange={(e) => setFormData({ ...formData, edificio: e.target.value })}
                placeholder="Ej: Edificio A"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Capacidad</label>
              <input
                type="number"
                value={formData.capacidad || ""}
                onChange={(e) => setFormData({ ...formData, capacidad: Number.parseInt(e.target.value) })}
                placeholder="Número de personas"
                min="1"
              />
            </div>
            <div className="form-group">
              <label>Tipo de Sala</label>
              <select
                value={formData.tipo || ""}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
              >
                <option value="">Seleccionar...</option>
                <option value="libre">Uso Libre</option>
                <option value="posgrado">Exclusiva Posgrado</option>
                <option value="docente">Exclusiva Docentes</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Ubicación / Piso</label>
            <input
              type="text"
              value={formData.ubicacion || ""}
              onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
              placeholder="Ej: Piso 1"
            />
          </div>
        </FormModal>
      )}
    </div>
  )
}
