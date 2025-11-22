"use client"

import { useState } from "react"
import "./App.css"
import Sidebar from "./components/Sidebar"
import Dashboard from "./pages/Dashboard"
import Participantes from "./pages/Participantes"
import Salas from "./pages/Salas"
import Reservas from "./pages/Reservas"
import Sanciones from "./pages/Sanciones"
import Reportes from "./pages/Reportes"

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard")

  const renderPage = () => {
    switch (currentPage) {
      case "participantes":
        return <Participantes />
      case "salas":
        return <Salas />
      case "reservas":
        return <Reservas />
      case "sanciones":
        return <Sanciones />
      case "reportes":
        return <Reportes />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="app-container">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="main-content">{renderPage()}</main>
    </div>
  )
}

export default App
