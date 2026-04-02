import type { QueueEntry } from '../types/queue'

// Mock data — matches names and party sizes from the Stitch dashboard design
const now = Date.now()
const min = (m: number) => now - m * 60 * 1000

export const mockQueue: QueueEntry[] = [
  {
    id: 'mock-001',
    name: 'Ricardo Milos',
    partySize: 4,
    joinedAt: min(24),
    status: 'waiting',
  },
  {
    id: 'mock-002',
    name: 'Amanda Silveira',
    partySize: 2,
    joinedAt: min(18),
    status: 'waiting',
  },
  {
    id: 'mock-003',
    name: 'Carlos Andrade',
    partySize: 6,
    joinedAt: min(12),
    status: 'waiting',
  },
  {
    id: 'mock-004',
    name: 'Juliana Ferreira',
    partySize: 3,
    joinedAt: min(8),
    status: 'waiting',
  },
  {
    id: 'mock-005',
    name: 'Thiago Costa',
    partySize: 1,
    joinedAt: min(5),
    status: 'waiting',
  },
  {
    id: 'mock-006',
    name: 'Beatriz Ramos',
    partySize: 3,
    joinedAt: min(30),
    status: 'called',
  },
  {
    id: 'mock-007',
    name: 'Marcos V.',
    partySize: 2,
    joinedAt: min(34),
    status: 'called',
  },
  {
    id: 'mock-008',
    name: 'Felipe Gonsalves',
    partySize: 2,
    joinedAt: min(60),
    status: 'attended',
  },
  {
    id: 'mock-009',
    name: 'Luiza Trajano',
    partySize: 5,
    joinedAt: min(65),
    status: 'attended',
  },
  {
    id: 'mock-010',
    name: 'Henrique M.',
    partySize: 1,
    joinedAt: min(80),
    status: 'attended',
  },
]
