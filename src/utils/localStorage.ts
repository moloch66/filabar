import { mockQueue } from '../data/fila'
import type { QueueEntry, QueueEntryWithPosition } from '../types/queue'

const QUEUE_KEY = 'filabar_queue'
const CURRENT_ID_KEY = 'filabar_current_id'
const WAIT_MINUTES_PER_GROUP = 8

export function getQueue(): QueueEntry[] {
  const raw = localStorage.getItem(QUEUE_KEY)
  if (!raw) {
    // Seed with mock data on first load
    saveQueue(mockQueue)
    return mockQueue
  }
  return JSON.parse(raw) as QueueEntry[]
}

export function saveQueue(queue: QueueEntry[]): void {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
}

export function getCurrentId(): string | null {
  return localStorage.getItem(CURRENT_ID_KEY)
}

export function setCurrentId(id: string): void {
  localStorage.setItem(CURRENT_ID_KEY, id)
}

export function clearCurrentId(): void {
  localStorage.removeItem(CURRENT_ID_KEY)
}

export function addToQueue(name: string, partySize: number): QueueEntry {
  const queue = getQueue()
  const entry: QueueEntry = {
    id: crypto.randomUUID(),
    name,
    partySize,
    joinedAt: Date.now(),
    status: 'waiting',
  }
  saveQueue([...queue, entry])
  setCurrentId(entry.id)
  return entry
}

export function callNext(): void {
  const queue = getQueue()
  const nextIndex = queue.findIndex((e) => e.status === 'waiting')
  if (nextIndex === -1) return
  const updated = queue.map((e, i) =>
    i === nextIndex ? { ...e, status: 'called' as const } : e
  )
  saveQueue(updated)
}

export function markAttended(id: string): void {
  const queue = getQueue()
  const updated = queue.map((e) =>
    e.id === id ? { ...e, status: 'attended' as const } : e
  )
  saveQueue(updated)
}

export function removeFromQueue(id: string): void {
  const queue = getQueue()
  saveQueue(queue.filter((e) => e.id !== id))
}

export function clearQueue(): void {
  localStorage.removeItem(QUEUE_KEY)
  localStorage.removeItem(CURRENT_ID_KEY)
}

// Derives position and estimated wait for 'waiting' entries only
export function withPositions(queue: QueueEntry[]): QueueEntryWithPosition[] {
  let pos = 0
  return queue.map((entry) => {
    if (entry.status === 'waiting') pos++
    return {
      ...entry,
      position: entry.status === 'waiting' ? pos : 0,
      estimatedWaitMinutes:
        entry.status === 'waiting' ? pos * WAIT_MINUTES_PER_GROUP : 0,
    }
  })
}

export function getWaitingSince(joinedAt: number): string {
  const diffMs = Date.now() - joinedAt
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'agora'
  return `${mins} min`
}
