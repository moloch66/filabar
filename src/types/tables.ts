export type TableArea = 'internal' | 'external'
export type TableStatus = 'free' | 'occupied' | 'reserved'

export interface Table {
  id: string
  number: number
  area: TableArea
  status: TableStatus
  assignedClientId?: string
  assignedAt?: number
}
