import "./Dashboard.css"
import StatCard from "../components/StatCard"
import { useFetch } from "../hooks/useFetch"

interface DashboardStats {
  salasActivas: number
  reservasHoy: number
  participantes: number
  sanciones: number
}

interface ReservaBackend {
  id_reserva: number
  nombre_sala: string
  edificio: string
  fecha: string
  id_turno: number
  estado: "activa" | "cancelada" | "finalizada" | "sin asistencia"
}

interface Reserva {
  id: number
  sala: string
  fecha: string
  horaInicio: string
  horaFin: string
  participantes: number
  estado: string
}

interface HorarioDemanda {
  horario: string
  porcentaje: number
}

export default function Dashboard() {
  const apiBaseUrl = (import.meta as any).env?.VITE_API_URL || "http://localhost:8000"
  
  // Backend no tiene endpoint de estadísticas del dashboard, usar reportes disponibles
  const {
    data: reservasBackend,
    loading: reservasLoading,
    error: statsError,
  } = useFetch<ReservaBackend[]>(
    `${apiBaseUrl}/reservas`,
    [],
  )

  // Backend no tiene endpoint específico de horarios-demanda, usar reporte de turnos
  const { data: horarios, loading: horariosLoading, error: horariosError } = useFetch<any>(
    `${apiBaseUrl}/reportes/turnos-mas-usados`,
    [],
  )

  // Mapear reservas del backend
  const reservas = reservasBackend && Array.isArray(reservasBackend) 
    ? reservasBackend.map((r: ReservaBackend) => ({
        id: r.id_reserva,
        sala: `${r.nombre_sala} - ${r.edificio}`,
        fecha: r.fecha,
        horaInicio: `Turno ${r.id_turno}`,
        horaFin: `Turno ${r.id_turno}`,
        participantes: 0,
        estado: r.estado,
      }))
    : []

  // Calcular estadísticas desde los datos disponibles
  const reservasActivas = reservas?.filter((r) => r.estado === "activa").length || 0
  const reservasHoy = reservas?.filter((r) => {
    const hoy = new Date().toISOString().split("T")[0]
    return r.fecha === hoy
  }).length || 0

  // Mapear horarios del backend (puede fallar si el backend tiene error con descripcion)
  const horariosMapped = horarios && Array.isArray(horarios) 
    ? horarios.map((item: any) => ({
        horario: item.descripcion || `Turno ${item.id_turno || ""}` || "N/A",
        porcentaje: item.cantidad || 0,
      }))
    : []

  const defaultStats = [
    { title: "Reservas Activas", value: String(reservasActivas), icon: "🏢", color: "#2a5298" },
    { title: "Reservas Hoy", value: String(reservasHoy), icon: "📅", color: "#00c896" },
    { title: "Total Reservas", value: String(reservas?.length || 0), icon: "👥", color: "#ff6b6b" },
    { title: "Turnos Populares", value: String(horariosMapped?.length || 0), icon: "⚠️", color: "#ffa500" },
  ]

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Bienvenido al sistema de gestión de salas de estudio</p>
      </div>

      {statsError && <div className="error-message">Error cargando estadísticas</div>}

      <div className="stats-grid">
        {defaultStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="dashboard-content">
        <div className="card">
          <h3>Últimas Reservas</h3>
          {reservasLoading ? (
            <p className="loading-text">Cargando reservas...</p>
          ) : reservas && Array.isArray(reservas) && reservas.length > 0 ? (
            <table className="simple-table">
              <thead>
                <tr>
                  <th>Sala</th>
                  <th>Fecha</th>
                  <th>Turno</th>
                  <th>Participantes</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {reservas && reservas.length > 0 ? (
                  reservas.slice(0, 3).map((reserva) => (
                    <tr key={reserva.id}>
                      <td>{reserva.sala}</td>
                      <td>{reserva.fecha}</td>
                      <td>{reserva.horaInicio}</td>
                      <td>{reserva.participantes || "-"}</td>
                      <td>
                        <span className={`badge ${(reserva.estado || "").toLowerCase().replace(" ", "_")}`}>
                          {(reserva.estado || "").charAt(0).toUpperCase() + (reserva.estado || "").slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={5}>No hay reservas disponibles</td></tr>
                )}
              </tbody>
            </table>
          ) : (
            <p>No hay reservas disponibles</p>
          )}
        </div>

        <div className="card">
          <h3>Horarios Más Demandados</h3>
          {horariosLoading ? (
            <p className="loading-text">Cargando horarios...</p>
          ) : horariosError ? (
            <p className="error-message">Error cargando horarios: {horariosError.message}</p>
          ) : horariosMapped && horariosMapped.length > 0 ? (
            <div className="bar-chart">
              {horariosMapped.map((item: HorarioDemanda, index: number) => (
                <div key={index} className="bar-item">
                  <div className="bar-label">{item.horario}</div>
                  <div className="bar-container">
                    <div className="bar" style={{ width: `${Math.min(100, (item.porcentaje || 0))}%`, backgroundColor: "#2a5298" }}></div>
                  </div>
                  <div className="bar-value">{item.porcentaje || 0}</div>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay datos de horarios disponibles</p>
          )}
        </div>
      </div>
    </div>
  )
}
