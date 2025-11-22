import "./Dashboard.css"
import StatCard from "../components/StatCard"
import { useFetch } from "../hooks/useFetch"

interface DashboardStats {
  salasActivas: number
  reservasHoy: number
  participantes: number
  sanciones: number
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
  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
  } = useFetch<DashboardStats>("http://localhost:8000/api/dashboard/stats", [])

  const { data: reservas, loading: reservasLoading } = useFetch<Reserva[]>(
    "http://localhost:8000/api/reservas?limit=3",
    [],
  )

  const { data: horarios, loading: horariosLoading } = useFetch<HorarioDemanda[]>(
    "http://localhost:8000/api/dashboard/horarios-demanda",
    [],
  )

  const defaultStats = [
    { title: "Salas Activas", value: stats?.salasActivas || "0", icon: "🏢", color: "#2a5298" },
    { title: "Reservas Hoy", value: stats?.reservasHoy || "0", icon: "📅", color: "#00c896" },
    { title: "Participantes", value: stats?.participantes || "0", icon: "👥", color: "#ff6b6b" },
    { title: "Sanciones Activas", value: stats?.sanciones || "0", icon: "⚠️", color: "#ffa500" },
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
          ) : reservas && reservas.length > 0 ? (
            <table className="simple-table">
              <thead>
                <tr>
                  <th>Sala</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Participantes</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((reserva) => (
                  <tr key={reserva.id}>
                    <td>{reserva.sala}</td>
                    <td>{reserva.fecha}</td>
                    <td>
                      {reserva.horaInicio} - {reserva.horaFin}
                    </td>
                    <td>{reserva.participantes}</td>
                    <td>
                      <span className={`badge ${reserva.estado.toLowerCase()}`}>
                        {reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
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
          ) : horarios && horarios.length > 0 ? (
            <div className="bar-chart">
              {horarios.map((item, index) => (
                <div key={index} className="bar-item">
                  <div className="bar-label">{item.horario}</div>
                  <div className="bar-container">
                    <div className="bar" style={{ width: `${item.porcentaje}%`, backgroundColor: "#2a5298" }}></div>
                  </div>
                  <div className="bar-value">{item.porcentaje}%</div>
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
