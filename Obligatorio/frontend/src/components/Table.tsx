"use client"

import "./Table.css"

interface Column {
  key: string
  label: string
}

interface TableProps {
  columns: Column[]
  data: any[]
  onEdit: (item: any) => void
  onDelete: (id: number) => void
}

export default function Table({ columns, data, onEdit, onDelete }: TableProps) {
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={col.key === "participantes" ? "col-center" : undefined}>
                {col.label}
              </th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              {columns.map((col) => (
                <td key={col.key} className={col.key === "participantes" ? "col-center" : undefined}>
                  {typeof item[col.key] === "boolean" ? (item[col.key] ? "Sí" : "No") : item[col.key]}
                </td>
              ))}
              <td className="actions-cell">
                <button className="action-btn edit-btn" onClick={() => onEdit(item)}>
                  ✎ Editar
                </button>
                <button className="action-btn delete-btn" onClick={() => onDelete(item.id)}>
                  🗑 Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && <div className="empty-state">No hay datos para mostrar</div>}
    </div>
  )
}
