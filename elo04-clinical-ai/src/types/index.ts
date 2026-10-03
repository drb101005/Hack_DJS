export type UserRole = 'doctor' | 'patient' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

export interface Patient {
  id: string
  name: string
  age: number
  gender: string
  bloodGroup: string
  phone: string
  email: string
  condition: string
  status: 'stable' | 'monitoring' | 'critical'
}

export interface MedicalDocument {
  id: string
  patientId: string
  name: string
  type: 'MRI' | 'CT' | 'X-Ray' | 'ECG' | 'Lab Report' | 'Clinical Note' | 'Prescription'
  date: string
  status: 'processed' | 'processing' | 'pending'
}

export interface ScreeningCase {
  id: string
  patientId: string
  title: string
  createdAt: string
  status: 'processing' | 'awaiting-review' | 'completed'
  modalities: string[]
}

export interface AIModel {
  id: string
  name: string
  modality: string
  version: string
  status: 'active' | 'idle' | 'loading' | 'offline'
  accuracy: number
  memoryUsage: number
}

export interface Finding {
  id: string
  title: string
  description: string
  confidence: number
  severity: 'low' | 'medium' | 'high'
  model: string
}

export interface Evidence {
  id: string
  source: string
  type: string
  date: string
  relevance: number
  excerpt: string
}
