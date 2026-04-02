export type QueueStatus = 'waiting' | 'called' | 'attended'

export interface QueueEntry {
  id: string
  name: string
  partySize: number
  joinedAt: number // Date.now()
  status: QueueStatus
}

// Derived at runtime, not stored
export interface QueueEntryWithPosition extends QueueEntry {
  position: number // 1-based, only among 'waiting' entries
  estimatedWaitMinutes: number
}
