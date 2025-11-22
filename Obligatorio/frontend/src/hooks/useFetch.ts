"use client"

import { useState, useEffect } from "react"

interface UseFetchState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

export function useFetch<T>(url: string, dependencies: any[] = []): UseFetchState<T> {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }))
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }
        const json = await response.json()
        if (isMounted) {
          setState({ data: json, loading: false, error: null })
        }
      } catch (err) {
        if (isMounted) {
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err : new Error("Error desconocido"),
          })
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, dependencies)

  return state
}
