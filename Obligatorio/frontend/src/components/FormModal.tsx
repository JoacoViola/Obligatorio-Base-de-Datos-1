"use client"

import type React from "react"

import "./FormModal.css"

interface FormModalProps {
  title: string
  onClose: () => void
  onSave: () => void
  children: React.ReactNode
}

export default function FormModal({ title, onClose, onSave, children }: FormModalProps) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-content">{children}</div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={onSave}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}
