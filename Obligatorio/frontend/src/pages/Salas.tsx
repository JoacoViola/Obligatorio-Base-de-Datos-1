"use client"

import { useState, useEffect } from "react"
import "./CRUD.css"
import FormModal from "../components/FormModal"
import Table from "../components/Table"
import { useFetch } from "../hooks/useFetch"
import { apiClient } from "../utils/api"

interface Sala {
  id?: number
  nombre_sala: string
  edificio: string
  capacidad: number
  tipo_sala: "libre" | "posgrado" | "docente"
}

export default function Salas() {
  const [reloadKey, setReloadKey] = useState(0)
  const { data: salas, loading, error } = useFetch<Sala[]>("http://localhost:8000/salas/", [reloadKey])
  const [localSalas, setLocalSalas] = useState<Sala[]>([])

  useEffect(() => {
    if (salas) {
      setLocalSalas(salas)
    }
  }, [salas])

  const [showModal, setShowModal] = useState(false)
  const [editingKey, setEditingKey] = useState<{ nombre_sala: string; edificio: string } | null>(null)
  const [formData, setFormData] = useState<Partial<Sala>>({})

  const handleAdd = () => {
    setEditingKey(null)
    setFormData({})
    setShowModal(true)
  }

  const handleEdit = (sala: Sala) => {
    setEditingKey({ nombre_sala: sala.nombre_sala, edificio: sala.edificio })
    setFormData(sala)
    setShowModal(true)
  }

  const handleDelete = async (payload: any) => {
    // payload may be the sala object (from Table) or the id
    const nombre = typeof payload === "string" ? payload : payload?.nombre_sala ?? payload?.nombre
    const edificio = payload?.edificio

    if (!nombre || !edificio) {
      alert("No se pudo determinar la sala a eliminar (falta nombre o edificio)")
      return
    }

    if (confirm("¿Está seguro de eliminar esta sala?")) {
      try {
        await apiClient.delete(`/salas/${encodeURIComponent(nombre)}/${encodeURIComponent(edificio)}`)
        setReloadKey((k) => k + 1)
      } catch (err) {
        alert(`Error al eliminar: ${err instanceof Error ? err.message : "Error desconocido"}`)
      }
    }
  }

  const handleSave = async () => {
    if (!formData.nombre_sala || !formData.edificio || !formData.capacidad) {
      alert("Por favor complete todos los campos obligatorios")
      return
    }

    try {
      if (editingKey) {
        const { nombre_sala: origNombre, edificio: origEdificio } = editingKey
        await apiClient.put(`/salas/${encodeURIComponent(origNombre)}/${encodeURIComponent(origEdificio)}`, {
          nombre_sala: formData.nombre_sala,
          edificio: formData.edificio,
          capacidad: formData.capacidad,
          tipo_sala: formData.tipo_sala,
        })
        setReloadKey((k) => k + 1)
        setEditingKey(null)
      } else {
        await apiClient.post("/salas", {
          nombre_sala: formData.nombre_sala,
          edificio: formData.edificio,
          capacidad: formData.capacidad,
          tipo_sala: formData.tipo_sala,
        })
        setReloadKey((k) => k + 1)
      }
      setShowModal(false)
    } catch (err) {
      alert(`Error al guardar: ${err instanceof Error ? err.message : "Error desconocido"}`)
    }
  }

  const columns = [
    { key: "nombre_sala", label: "Nombre" },
    { key: "edificio", label: "Edificio" },
    { key: "capacidad", label: "Capacidad" },
    { key: "tipo_sala", label: "Tipo" },
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
          title={editingKey ? "Editar Sala" : "Nueva Sala"}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        >
          <div className="form-row">
            <div className="form-group">
              <label>Nombre de la Sala</label>
              <input
                type="text"
                value={formData.nombre_sala || ""}
                onChange={(e) => setFormData({ ...formData, nombre_sala: e.target.value })}
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
                value={formData.tipo_sala || ""}
                onChange={(e) => setFormData({ ...formData, tipo_sala: e.target.value as any })}
              >
                <option value="">Seleccionar...</option>
                <option value="libre">Uso Libre</option>
                <option value="posgrado">Exclusiva Posgrado</option>
                <option value="docente">Exclusiva Docentes</option>
              </select>
            </div>
          </div>
          {/* ubicacion removed from model */}
        </FormModal>
      )}
    </div>
  )
}
