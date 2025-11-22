import "./Reportes.css"

export default function Reportes() {
  const reportes = [
    {
      titulo: "Salas Más Reservadas",
      datos: [
        { label: "Sala A-101", valor: 45, pct: "23%" },
        { label: "Sala B-205", valor: 38, pct: "19%" },
        { label: "Sala C-310", valor: 32, pct: "16%" },
      ],
    },
    {
      titulo: "Turnos Más Demandados",
      datos: [
        { label: "10:00 - 11:00", valor: 72, pct: "18%" },
        { label: "14:00 - 15:00", valor: 63, pct: "16%" },
        { label: "15:00 - 16:00", valor: 58, pct: "15%" },
      ],
    },
  ]

  const estadisticas = [
    { titulo: "Ocupación Promedio", valor: "68.5%", subtitulo: "Salas ocupadas" },
    { titulo: "Asistencia", valor: "92.3%", subtitulo: "Reservas utilizadas" },
    { titulo: "Participantes Promedio", valor: "5.2", subtitulo: "Por reserva" },
    { titulo: "Reservas No Asistidas", valor: "7.7%", subtitulo: "Este mes" },
  ]

  return (
    <div className="reportes-page">
      <div className="page-header">
        <h2>Reportes Analíticos</h2>
        <p>Métricas y análisis del sistema de gestión de salas</p>
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
              {reporte.datos.map((item, i) => (
                <div key={i} className="report-item">
                  <div className="item-label">
                    <span>{item.label}</span>
                    <span className="pct">{item.pct}</span>
                  </div>
                  <div className="item-bar">
                    <div className="bar-fill" style={{ width: `${(item.valor / 72) * 100}%` }}></div>
                  </div>
                  <span className="item-valor">{item.valor}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>Reservas por Facultad</h3>
        <table className="simple-table">
          <thead>
            <tr>
              <th>Facultad</th>
              <th>Reservas</th>
              <th>Participantes</th>
              <th>Asistencia</th>
              <th>Sanciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ingeniería</td>
              <td>67</td>
              <td>312</td>
              <td>94.0%</td>
              <td>1</td>
            </tr>
            <tr>
              <td>Negocios</td>
              <td>54</td>
              <td>278</td>
              <td>91.5%</td>
              <td>2</td>
            </tr>
            <tr>
              <td>Humanidades</td>
              <td>42</td>
              <td>189</td>
              <td>93.2%</td>
              <td>1</td>
            </tr>
            <tr>
              <td>Derecho</td>
              <td>38</td>
              <td>156</td>
              <td>89.5%</td>
              <td>3</td>
            </tr>
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
            <tr>
              <td>Estudiante Grado</td>
              <td>142</td>
              <td>132</td>
              <td>10</td>
              <td>2</td>
            </tr>
            <tr>
              <td>Estudiante Posgrado</td>
              <td>67</td>
              <td>64</td>
              <td>3</td>
              <td>1</td>
            </tr>
            <tr>
              <td>Docentes</td>
              <td>52</td>
              <td>51</td>
              <td>1</td>
              <td>0</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
