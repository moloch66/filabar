import type { Table } from '../types/tables'

export const mockTables: Table[] = [
  // Internal (Área Interna — M1 to M8)
  { id: 'int-1', number: 1, area: 'internal', status: 'free' },
  { id: 'int-2', number: 2, area: 'internal', status: 'occupied' },
  { id: 'int-3', number: 3, area: 'internal', status: 'reserved' },
  { id: 'int-4', number: 4, area: 'internal', status: 'free' },
  { id: 'int-5', number: 5, area: 'internal', status: 'occupied' },
  { id: 'int-6', number: 6, area: 'internal', status: 'free' },
  { id: 'int-7', number: 7, area: 'internal', status: 'reserved' },
  { id: 'int-8', number: 8, area: 'internal', status: 'occupied' },
  // External (Área Externa — E1 to E8)
  { id: 'ext-1', number: 1, area: 'external', status: 'free' },
  { id: 'ext-2', number: 2, area: 'external', status: 'free' },
  { id: 'ext-3', number: 3, area: 'external', status: 'occupied' },
  { id: 'ext-4', number: 4, area: 'external', status: 'reserved' },
  { id: 'ext-5', number: 5, area: 'external', status: 'free' },
  { id: 'ext-6', number: 6, area: 'external', status: 'occupied' },
  { id: 'ext-7', number: 7, area: 'external', status: 'free' },
  { id: 'ext-8', number: 8, area: 'external', status: 'free' },
]
