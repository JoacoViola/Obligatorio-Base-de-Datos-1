"use client"

import { useEffect, useState } from "react"
import "./Reportes.css"
import { apiClient } from "../utils/api"

type ReportItem = { label: string; valor: number; pct?: string }
type ReportBlock = { titulo: string; datos: ReportItem[] }
type Stat = { titulo: string; valor: string; subtitulo: string }

export default function Reportes() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [reportes, setReportes] = useState<ReportBlock[]>([])
  const [estadisticas, setEstadisticas] = useState<Stat[]>([])
  const [reservasPorFacultad, setReservasPorFacultad] = useState<any[]>([])
  const [resumenTipoUsuario, setResumenTipoUsuario] = useState<any[]>([])

  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      setError(null)

      try {
        // Ajustá endpoints según lo que expone tu backend
        // Usar Promise.allSettled para manejar errores individuales
        const results = await Promise.allSettled([
          apiClient.get<any>("/reportes/salas-mas-reservadas"),
          apiClient.get<any>("/reportes/turnos-mas-usados"),
          apiClient.get<any>("/reportes/ocupacion-por-sala"),
          apiClient.get<any>("/reportes/asistencia-general"),
          apiClient.get<any>("/reportes/reservas-por-semana"),
          apiClient.get<any>("/reportes/cancelaciones-por-mes")
        ])

        const salasRes = results[0].status === "fulfilled" ? results[0].value : null
        const turnosRes = results[1].status === "fulfilled" ? results[1].value : null
        const ocupacionRes = results[2].status === "fulfilled" ? results[2].value : null
        const asistenciaRes = results[3].status === "fulfilled" ? results[3].value : null
        const reservasFacRes = results[4].status === "fulfilled" ? results[4].value : null
        const resumenTipoRes = results[5].status === "fulfilled" ? results[5].value : null

        // Log errores individuales si los hay
        results.forEach((result, index) => {
          if (result.status === "rejected") {
            console.warn(`Error en reporte ${index}:`, result.reason)
          }
        })

        // Backend devuelve los datos directamente, no envueltos en data.data
        const salasData = Array.isArray(salasRes) ? salasRes : []
        const turnosData = Array.isArray(turnosRes) ? turnosRes : []
        const ocupacionData = ocupacionRes || {}
        const asistenciaData = asistenciaRes || {}
        const reservasFacData = Array.isArray(reservasFacRes) ? reservasFacRes : []
        const resumenTipoData = resumenTipoRes || {}

        // Mapear datos del backend al formato esperado por el frontend
        const salasMapped = salasData.map((item: any) => ({
          label: `${item.nombre_sala || ""} - ${item.edificio || ""}`,
          valor: item.cantidad_reservas || 0,
        }))

        // El backend puede fallar si la tabla turno no tiene columna descripcion
        // Mapear con fallback
        const turnosMapped = turnosData.map((item: any) => ({
          label: item.descripcion || `Turno ${item.id_turno || ""}` || "N/A",
          valor: item.cantidad || 0,
        }))

        setReportes([
          { titulo: "Salas Más Reservadas", datos: salasMapped as ReportItem[] },
          { titulo: "Turnos Más Demandados", datos: turnosMapped as ReportItem[] }
        ])

        setEstadisticas([
          { titulo: "Ocupación Promedio", valor: ocupacionData?.promedio_ocupacion || ocupacionData?.promedio || "N/A", subtitulo: "Salas ocupadas" },
          { titulo: "Asistencia", valor: asistenciaData?.porcentaje_asistencia || asistenciaData?.porcentaje || "N/A", subtitulo: "Reservas utilizadas" },
          { titulo: "Participantes Promedio", valor: String(asistenciaData?.participantes_promedio || asistenciaData?.promedio_participantes || "N/A"), subtitulo: "Por reserva" },
          { titulo: "Reservas por Semana", valor: String(reservasFacData.length || 0), subtitulo: "Total semanas" }
        ])

        setReservasPorFacultad(reservasFacData.map((r: any) => ({
          periodo: r.semana || `Semana ${r.cantidad || ""}`,
          reservas: r.cantidad || 0,
          participantes: "-",
          asistencia: "-",
        })))
        setResumenTipoUsuario([]) // Backend no tiene este reporte específico
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  if (loading) return <div className="reportes-page"><p>Cargando reportes...</p></div>
  if (error) return <div className="reportes-page"><p className="error-message">Error: {error}</p></div>

  return (
    <div className="reportes-page">
      <div className="page-header">
        <h2>Reportes Analíticos</h2>
        <p>Métricas y análisis del sistema de gestión de salas (datos desde backend)</p>
      </div>

      <div className="stats-section">
        {estadisticas.map((stat, idx) => (
          <div key={idx} className="stat-box">
            <p className="stat-title">{stat.titulo}</p>
            <p className="stat-big">{stat.valor}</p>
            <p className="stat-subtitle">{stat.subtitulo}</p>
          </div>
        ))}
      </div>

      <div className="reportes-grid">
        {reportes.map((reporte, idx) => (
          <div key={idx} className="report-card">
            <h3>{reporte.titulo}</h3>
            <div className="report-content">
              {reporte.datos.length === 0 && <div>No hay datos</div>}
              {reporte.datos.map((item, i) => (
                <div key={i} className="report-item">
                  <div className="item-label">
                    <span>{item.label}</span>
                    <span className="pct">{item.pct ?? ""}</span>
                  </div>
                  <div className="item-bar">
                    <div className="bar-fill" style={{ width: `${Math.min(100, (item.valor / 100) * 100)}%` }} />
                  </div>
                  <span className="item-valor">{item.valor}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>Reservas por Semana / Facultad</h3>
        <table className="simple-table">
          <thead>
            <tr>
              <th>Periodo</th>
              <th>Reservas</th>
              <th>Participantes</th>
              <th>Asistencia</th>
            </tr>
          </thead>
          <tbody>
            {reservasPorFacultad.length === 0 && <tr><td colSpan={4}>Sin datos</td></tr>}
            {reservasPorFacultad.map((r, i) => (
              <tr key={i}>
                <td>{r.periodo ?? r.facultad ?? `fila ${i + 1}`}</td>
                <td>{r.reservas ?? r.valor ?? "-"}</td>
                <td>{r.participantes ?? "-"}</td>
                <td>{r.asistencia ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Resumen por Tipo de Usuario</h3>
        <table className="simple-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Reservas</th>
              <th>Asistencias</th>
              <th>No Asistencias</th>
              <th>Sanciones Activas</th>
            </tr>
          </thead>
          <tbody>
            {resumenTipoUsuario.length === 0 && <tr><td colSpan={5}>Sin datos</td></tr>}
            {resumenTipoUsuario.map((t: any, i: number) => (
              <tr key={i}>
                <td>{t.tipo}</td>
                <td>{t.reservas}</td>
                <td>{t.asistencias}</td>
                <td>{t.no_asistencias}</td>
                <td>{t.sanciones}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
