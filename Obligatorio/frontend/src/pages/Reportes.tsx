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
        const [
          salasRes,
          turnosRes,
          ocupacionRes,
          asistenciaRes,
          reservasFacRes,
          resumenTipoRes
        ] = await Promise.all([
          apiClient.get<any>("/reportes/salas-mas-reservadas"),
          apiClient.get<any>("/reportes/turnos-mas-usados"),
          apiClient.get<any>("/reportes/ocupacion-por-sala"),
          apiClient.get<any>("/reportes/asistencia-general"),
          apiClient.get<any>("/reportes/reservas-por-semana"),
          apiClient.get<any>("/reportes/cancelaciones-por-mes") // ejemplo, cambiá si prefieres otro endpoint
        ])

        const salasData = salasRes?.data?.data ?? []
        const turnosData = turnosRes?.data?.data ?? []
        const ocupacionData = ocupacionRes?.data?.data ?? []
        const asistenciaData = asistenciaRes?.data?.data ?? []
        const reservasFacData = reservasFacRes?.data?.data ?? []
        const resumenTipoData = resumenTipoRes?.data?.data ?? []

        setReportes([
          { titulo: "Salas Más Reservadas", datos: salasData as ReportItem[] },
          { titulo: "Turnos Más Demandados", datos: turnosData as ReportItem[] }
        ])

        setEstadisticas([
          { titulo: "Ocupación Promedio", valor: ocupacionData?.promedio ?? "N/A", subtitulo: "Salas ocupadas" },
          { titulo: "Asistencia", valor: asistenciaData?.porcentaje ?? "N/A", subtitulo: "Reservas utilizadas" },
          { titulo: "Participantes Promedio", valor: String(asistenciaData?.participantes_promedio ?? "N/A"), subtitulo: "Por reserva" },
          { titulo: "Reservas No Asistidas", valor: String(resumenTipoData?.no_asistidas_pct ?? "N/A"), subtitulo: "Este mes" }
        ])

        setReservasPorFacultad(reservasFacData)
        setResumenTipoUsuario(resumenTipoData?.by_tipo ?? [])
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
