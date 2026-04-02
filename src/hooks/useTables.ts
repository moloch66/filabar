import { useState, useEffect, useCallback } from 'react'
import {
  getTables,
  assignClientToTable,
  setTableStatus,
  resetTables,
} from '../utils/localStorage'
import type { Table, TableStatus } from '../types/tables'

const POLL_INTERVAL_MS = 3000

export function useTables() {
  const [tables, setTables] = useState<Table[]>(() => getTables())

  const refresh = useCallback(() => {
    setTables(getTables())
  }, [])

  useEffect(() => {
    const id = setInterval(refresh, POLL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [refresh])

  const internal = tables.filter((t) => t.area === 'internal')
  const external = tables.filter((t) => t.area === 'external')

  function handleAssign(tableId: string, clientId: string) {
    assignClientToTable(tableId, clientId)
    refresh()
  }

  function handleSetStatus(tableId: string, status: TableStatus) {
    setTableStatus(tableId, status)
    refresh()
  }

  function handleReset() {
    resetTables()
    refresh()
  }

  return {
    tables,
    internal,
    external,
    assign: handleAssign,
    setStatus: handleSetStatus,
    reset: handleReset,
    refresh,
  }
}
