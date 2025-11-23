// API Base URL - cambiar según tu entorno
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:8000"

// Tipos de respuesta del API
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

// Configuración de headers
const getHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
})

// Funciones genéricas para CRUD
export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: getHeaders(),
    })
    if (!response.ok) {
      throw new Error(`Error en GET ${endpoint}: ${response.statusText}`)
    }
    return response.json()
  },

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`Error en POST ${endpoint}: ${response.statusText}`)
    }
    return response.json()
  },

  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`Error en PUT ${endpoint}: ${response.statusText}`)
    }
    return response.json()
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: getHeaders(),
    })
    if (!response.ok) {
      throw new Error(`Error en DELETE ${endpoint}: ${response.statusText}`)
    }
    return response.json()
  },
}
