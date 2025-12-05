import "./Dashboard.css"
import StatCard from "../components/StatCard"
import { useFetch } from "../hooks/useFetch"
import { useState, useEffect } from "react"
import { apiClient } from "../utils/api"
import FormModal from "../components/FormModal"

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

  // Fetch para las reservas recientes (limitadas) que se mostrarán en la tabla
  const { data: reservasRecientes, loading: recientesLoading } = useFetch<any[]>(
    "http://localhost:8000/reservas?limit=3",
    [],
  )

  const [localReservas, setLocalReservas] = useState<any[]>([])
  const [showParticipantsModal, setShowParticipantsModal] = useState(false)
  const [participantsList, setParticipantsList] = useState<any[]>([])
  const [participantsReservaName, setParticipantsReservaName] = useState("")

  // turnos 1..15
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

  useEffect(() => {
    if (!reservasRecientes) return

    let mounted = true

    ;(async () => {
      try {
        const mapped = await Promise.all(
          reservasRecientes.map(async (r: any) => {
            const id = r.id_reserva ?? r.id
            let participantesArr: any[] = []
            try {
              participantesArr = await apiClient.get(`/reservas/${id}/participantes`)
            } catch (e) {
              participantesArr = []
            }
            const count = participantesArr.length
            return {
              id,
              sala: r.nombre_sala || r.sala || "",
              fecha: r.fecha,
              hora: turnos[(r.id_turno ?? r.idTurno) - 1] || "",
              participantes: (
                <button className="link-btn" onClick={() => openParticipants(id, r.nombre_sala || r.sala || "") }>
                  {count}
                </button>
              ),
              estado: r.estado,
            }
          }),
        )
        if (mounted) setLocalReservas(mapped)
      } catch (e) {
        if (mounted) setLocalReservas([])
      }
    })()

    return () => {
      mounted = false
    }
  }, [reservasRecientes])

  // Backend no tiene endpoint específico de horarios-demanda, usar reporte de turnos
  const { data: horarios, loading: horariosLoading, error: horariosError } = useFetch<HorarioDemanda[]>(
    "http://localhost:8000/api/dashboard/horarios-demanda",
    [],
  )

  // Mapear reservas del backend (para estadísticas generales)
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
          {recientesLoading ? (
            <p className="loading-text">Cargando reservas...</p>
          ) : localReservas && localReservas.length > 0 ? (
            <table className="simple-table">
              <thead>
                <tr>
                  <th>Sala</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th className="col-center">Participantes</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {localReservas.map((reserva) => (
                  <tr key={reserva.id}>
                    <td>{reserva.sala}</td>
                    <td>{reserva.fecha}</td>
                    <td>{reserva.hora || ""}</td>
                    <td className="col-center">{reserva.participantes}</td>
                    <td>
                      <span className={`badge ${String(reserva.estado).toLowerCase()}`}>
                        {String(reserva.estado).charAt(0).toUpperCase() + String(reserva.estado).slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay reservas disponibles</p>
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
