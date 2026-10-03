import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export interface DemoCase {
  id: string
  patientId: string
  patientName: string
  status:
    | 'processing'
    | 'awaiting-review'
    | 'approved'
  createdAt: string
  modalities: string[]
  confidence: number
}

export interface AuditEvent {
  id: string
  time: string
  actor: string
  action: string
  target: string
  status: 'Completed' | 'Approved' | 'Accessed' | 'Uploaded'
}

interface DemoContextValue {
  cases: DemoCase[]
  auditEvents: AuditEvent[]
  activeCase: DemoCase | null
  createCase: (
    patientId: string,
    patientName: string,
    modalities: string[],
  ) => string
  approveCase: (caseId: string) => void
  addAuditEvent: (
    action: string,
    target: string,
    status?: AuditEvent['status'],
  ) => void
}

const DemoContext = createContext<DemoContextValue | null>(null)

const CASES_KEY = 'elo04_demo_cases'
const AUDIT_KEY = 'elo04_demo_audit'

const initialCases: DemoCase[] = [
  {
    id: 'CASE-2048',
    patientId: 'PAT-1001',
    patientName: 'James Anderson',
    status: 'awaiting-review',
    createdAt: '8 min ago',
    modalities: ['X-Ray', 'Clinical Text'],
    confidence: 91,
  },
  {
    id: 'CASE-2047',
    patientId: 'PAT-1002',
    patientName: 'Emily Carter',
    status: 'processing',
    createdAt: '14 min ago',
    modalities: ['MRI'],
    confidence: 87,
  },
  {
    id: 'CASE-2046',
    patientId: 'PAT-1003',
    patientName: 'Michael Thompson',
    status: 'approved',
    createdAt: '32 min ago',
    modalities: ['CT', 'Lab Report'],
    confidence: 94,
  },
]

const initialAudit: AuditEvent[] = [
  {
    id: 'AUD-001',
    time: '09:42:18',
    actor: 'Dr. Sarah Mitchell',
    action: 'AI Analysis',
    target: 'CASE-2048',
    status: 'Completed',
  },
  {
    id: 'AUD-002',
    time: '09:41:57',
    actor: 'AI Orchestrator',
    action: 'RAG Retrieval',
    target: 'CASE-2048',
    status: 'Completed',
  },
  {
    id: 'AUD-003',
    time: '09:40:31',
    actor: 'Dr. Sarah Mitchell',
    action: 'Patient Record',
    target: 'PAT-1001',
    status: 'Accessed',
  },
]

function load<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key)

    if (!stored) return fallback

    return JSON.parse(stored) as T
  } catch {
    return fallback
  }
}

export function DemoProvider({
  children,
}: {
  children: ReactNode
}) {
  const [cases, setCases] = useState<DemoCase[]>(() =>
    load(CASES_KEY, initialCases),
  )

  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(
    () => load(AUDIT_KEY, initialAudit),
  )

  useEffect(() => {
    localStorage.setItem(CASES_KEY, JSON.stringify(cases))
  }, [cases])

  useEffect(() => {
    localStorage.setItem(
      AUDIT_KEY,
      JSON.stringify(auditEvents),
    )
  }, [auditEvents])

  const addAuditEvent = (
    action: string,
    target: string,
    status: AuditEvent['status'] = 'Completed',
  ) => {
    const now = new Date()

    const event: AuditEvent = {
      id: `AUD-${Date.now()}`,
      time: now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      actor: 'Dr. Sarah Mitchell',
      action,
      target,
      status,
    }

    setAuditEvents((current) => [
      event,
      ...current,
    ].slice(0, 50))
  }

  const createCase = (
    patientId: string,
    patientName: string,
    modalities: string[],
  ) => {
    const id = `CASE-${Math.floor(3000 + Math.random() * 6999)}`

    const newCase: DemoCase = {
      id,
      patientId,
      patientName,
      status: 'processing',
      createdAt: 'Just now',
      modalities,
      confidence: 0,
    }

    setCases((current) => [
      newCase,
      ...current,
    ])

    addAuditEvent(
      'Screening Case Created',
      id,
      'Completed',
    )

    return id
  }

  const approveCase = (caseId: string) => {
    setCases((current) =>
      current.map((item) =>
        item.id === caseId
          ? {
              ...item,
              status: 'approved',
              confidence:
                item.confidence || 93,
            }
          : item,
      ),
    )

    addAuditEvent(
      'Report Approval',
      caseId,
      'Approved',
    )
  }

  const activeCase = cases[0] ?? null

  const value = useMemo(
    () => ({
      cases,
      auditEvents,
      activeCase,
      createCase,
      approveCase,
      addAuditEvent,
    }),
    [cases, auditEvents, activeCase],
  )

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  )
}

export function useDemo() {
  const context = useContext(DemoContext)

  if (!context) {
    throw new Error(
      'useDemo must be used inside DemoProvider',
    )
  }

  return context
}
