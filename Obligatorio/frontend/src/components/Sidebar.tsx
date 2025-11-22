"use client"

import "./Sidebar.css"

interface SidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "participantes", label: "Participantes", icon: "👥" },
    { id: "salas", label: "Salas", icon: "🏢" },
    { id: "reservas", label: "Reservas", icon: "📅" },
    { id: "sanciones", label: "Sanciones", icon: "⚠️" },
    { id: "reportes", label: "Reportes", icon: "📈" },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>UGestión</h1>
        <p>Salas de Estudio</p>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentPage === item.id ? "active" : ""}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <p>Universidad Católica</p>
        <p className="version">v1.0</p>
      </div>
    </aside>
  )
}
