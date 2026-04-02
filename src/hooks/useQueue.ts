import { useState, useEffect, useCallback } from 'react'
import {
  getQueue,
  withPositions,
  callNext,
  markAttended,
  removeFromQueue,
  clearQueue,
} from '../utils/localStorage'
import type { QueueEntryWithPosition } from '../types/queue'

const POLL_INTERVAL_MS = 3000

export function useQueue() {
  const [queue, setQueue] = useState<QueueEntryWithPosition[]>(() =>
    withPositions(getQueue())
  )

  const refresh = useCallback(() => {
    setQueue(withPositions(getQueue()))
  }, [])

  useEffect(() => {
    const id = setInterval(refresh, POLL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [refresh])

  const waiting = queue.filter((e) => e.status === 'waiting')
  const called = queue.filter((e) => e.status === 'called')
  const attended = queue.filter((e) => e.status === 'attended')

  function handleCallNext() {
    callNext()
    refresh()
  }

  function handleMarkAttended(id: string) {
    markAttended(id)
    refresh()
  }

  function handleRemove(id: string) {
    removeFromQueue(id)
    refresh()
  }

  function handleClearAll() {
    clearQueue()
    refresh()
  }

  return {
    queue,
    waiting,
    called,
    attended,
    refresh,
    callNext: handleCallNext,
    markAttended: handleMarkAttended,
    remove: handleRemove,
    clearAll: handleClearAll,
  }
}

// Lightweight hook for the client waiting room — polls and returns own entry
export function useClientEntry(id: string | null) {
  const [entry, setEntry] = useState<QueueEntryWithPosition | null>(null)

  const refresh = useCallback(() => {
    if (!id) return
    const all = withPositions(getQueue())
    setEntry(all.find((e) => e.id === id) ?? null)
  }, [id])

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [refresh])

  return { entry, refresh }
}
