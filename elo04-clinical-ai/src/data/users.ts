import type { User } from '../types'

export const mockUsers: User[] = [
  {
    id: 'DOC-001',
    name: 'Dr. Sarah Mitchell',
    email: 'sarah.mitchell@medai.demo',
    role: 'doctor',
  },
  {
    id: 'PAT-1001',
    name: 'James Anderson',
    email: 'james.anderson@patient.demo',
    role: 'patient',
  },
  {
    id: 'ADM-001',
    name: 'System Administrator',
    email: 'admin@medai.demo',
    role: 'admin',
  },
]
