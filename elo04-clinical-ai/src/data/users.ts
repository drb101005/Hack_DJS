import type { User } from '../types'

export const mockUsers: User[] = [
  {
    id: 'DOC-001',
    name: 'Dr. Ajay Lad',
    email: 'ajay.lad@medai.demo',
    role: 'doctor',
  },
  {
    id: 'PAT-1001',
    name: 'Ram Sharma',
    email: 'ram.sharma@patient.demo',
    role: 'patient',
  },
  {
    id: 'ADM-001',
    name: 'System Administrator',
    email: 'admin@medai.demo',
    role: 'admin',
  },
]