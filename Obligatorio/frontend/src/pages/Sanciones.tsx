"use client"

import { useState, useEffect } from "react"
import "./CRUD.css"
import FormModal from "../components/FormModal"
import Table from "../components/Table"
import { useFetch } from "../hooks/useFetch"
import { apiClient } from "../utils/api"

interface Sancion {
  id?: number
  ci: number
  fecha_inicio: string
  fecha_fin: string
}

export default function Sanciones() {
  const { data: sanciones, loading, error } = useFetch<Sancion[]>(`${(import.meta as any).env?.VITE_API_URL || "http://localhost:8000"}/sanciones`, [])
  const [localSanciones, setLocalSanciones] = useState<Sancion[]>([])

  useEffect(() => {
    if (sanciones) {
      // Map backend format (ci_participante) to frontend interface (ci)
      const mappedData: Sancion[] = sanciones.map((item: any) => ({
        id: item.id_sancion,
        ci: item.ci_participante,
        fecha_inicio: item.fecha_inicio,
        fecha_fin: item.fecha_fin,
      }))
      setLocalSanciones(mappedData)
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
    setEditingId(sancion.id || null)
    setFormData(sancion)
    setShowModal(true)
  }

  const handleDelete = async (_id: number) => {
    // Backend no tiene endpoint DELETE para sanciones
    alert("La eliminación de sanciones no está disponible en el backend")
  }

  const handleSave = async () => {
    if (!formData.ci || !formData.fecha_inicio || !formData.fecha_fin) {
      alert("Por favor complete todos los campos")
      return
    }

    try {
      // Map frontend interface (ci) to backend format (ci_participante)
      const payload = {
        ci_participante: formData.ci,
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin,
      }
      
      if (editingId) {
        // Backend no tiene endpoint PUT para sanciones
        alert("La edición de sanciones no está disponible en el backend")
        return
      } else {
        await apiClient.post("/sanciones", payload)
        // Refresh the list
        const apiBaseUrl = (import.meta as any).env?.VITE_API_URL || "http://localhost:8000"
        const response = await fetch(`${apiBaseUrl}/sanciones`)
        const backendData = await response.json() as any[]
        // Map backend format (ci_participante) to frontend interface (ci)
        const mappedData: Sancion[] = backendData.map((item: any) => ({
          id: item.id_sancion,
          ci: item.ci_participante,
          fecha_inicio: item.fecha_inicio,
          fecha_fin: item.fecha_fin,
        }))
        setLocalSanciones(mappedData)
      }
      setShowModal(false)
    } catch (err) {
      alert(`Error al guardar: ${err instanceof Error ? err.message : "Error desconocido"}`)
    }
  }

  const columns = [
    { key: "ci", label: "CI Participante" },
    { key: "fecha_inicio", label: "Fecha Inicio" },
    { key: "fecha_fin", label: "Fecha Fin" },
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
            <label>CI Participante</label>
            <input
              type="number"
              value={formData.ci || ""}
              onChange={(e) => setFormData({ ...formData, ci: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Fecha Inicio</label>
              <input
                type="date"
                value={formData.fecha_inicio || ""}
                onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Fecha Fin</label>
              <input
                type="date"
                value={formData.fecha_fin || ""}
                onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
              />
            </div>
          </div>
        </FormModal>
      )}
    </div>
  )
}
