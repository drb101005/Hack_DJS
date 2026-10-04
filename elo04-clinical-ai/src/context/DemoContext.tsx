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

export interface DemoClinicalFinding {
  id: string
  title: string
  confidence: number
  severity: 'Low' | 'Moderate' | 'High'
  model: string
  explanation: string
  evidenceIds: string[]
}

export interface DemoRAGEvidence {
  id: string
  title: string
  type: string
  date: string
  sortDate: string
  relevance: number
  excerpt: string
  whyRelevant: string
}

export interface FindingReview {
  findingId: string
  action: 'Accepted' | 'Modified' | 'Overridden' | 'Rejected'
  revision?: string
}

export interface DemoClinicalReport {
  caseId: string
  patientId: string
  patientName: string
  screeningDate: string
  status: 'draft' | 'approved' | 'shared'
  summary: string
  comment: string
  reviews: FindingReview[]
  savedAt: string
  approvedAt?: string
}

export interface AuditEvent {
  id: string
  time: string
  actor: string
  action: string
  target: string
  status:
    | 'Completed'
    | 'Approved'
    | 'Accessed'
    | 'Uploaded'
    | 'Running'
    | 'Saved'
    | 'Shared'
}

interface DemoContextValue {
  cases: DemoCase[]
  auditEvents: AuditEvent[]
  reports: DemoClinicalReport[]
  aiFindings: DemoClinicalFinding[]
  ragEvidence: DemoRAGEvidence[]
  activeCase: DemoCase | null
  createCase: (
    patientId: string,
    patientName: string,
    modalities: string[],
  ) => string
  approveCase: (caseId: string) => void
  markCaseAwaitingReview: (caseId: string) => void
  saveClinicalReport: (report: DemoClinicalReport) => void
  approveClinicalReport: (
    report: DemoClinicalReport,
    shareWithPatient: boolean,
  ) => void
  addAuditEvent: (
    action: string,
    target: string,
    status?: AuditEvent['status'],
    actor?: string,
  ) => void
}

const DemoContext = createContext<DemoContextValue | null>(null)

const CASES_KEY = 'elo04_demo_cases'
const AUDIT_KEY = 'elo04_demo_audit'
const REPORTS_KEY = 'elo04_demo_reports'

export const demoRAGEvidence: DemoRAGEvidence[] = [
  {
    id: '01',
    title: 'Chest X-Ray Report',
    type: 'Imaging',
    date: '12 Mar 2026',
    sortDate: '2026-03-12',
    relevance: 96,
    excerpt:
      'Prior chest radiograph describes clear lung fields and stable cardiomediastinal contours, with no focal air-space opacity reported.',
    whyRelevant:
      'Provides a recent imaging baseline for comparing the current cardiopulmonary screening signal.',
  },
  {
    id: '02',
    title: 'Respiratory Follow-up Note',
    type: 'Clinical Note',
    date: '18 Mar 2026',
    sortDate: '2026-03-18',
    relevance: 94,
    excerpt:
      'Follow-up documents intermittent exertional breathlessness; symptoms and planned imaging review were recorded for clinician follow-up.',
    whyRelevant:
      'Adds symptom context that can be considered alongside the imaging signal and current case.',
  },
  {
    id: '03',
    title: 'ECG Investigation',
    type: 'ECG',
    date: '10 Mar 2026',
    sortDate: '2026-03-10',
    relevance: 87,
    excerpt:
      'Stored tracing summary notes sinus rhythm and does not describe an acute rhythm abnormality.',
    whyRelevant:
      'Offers a historical cardiac rhythm reference for the current screening review.',
  },
  {
    id: '04',
    title: 'Blood Panel',
    type: 'Lab Report',
    date: '04 Feb 2026',
    sortDate: '2026-02-04',
    relevance: 74,
    excerpt:
      'Complete blood count and metabolic panel are present in the longitudinal record for comparison.',
    whyRelevant:
      'Provides broader clinical context that may inform interpretation of historical comparison needs.',
  },
]

export const demoAiFindings: DemoClinicalFinding[] = [
  {
    id: 'FIND-01',
    title: 'Cardiopulmonary screening signal',
    confidence: 92,
    severity: 'Moderate',
    model: 'Chest X-Ray Screening v2.4.1',
    explanation:
      'A simulated screening signal is present. Review source imaging and correlate with the clinical picture.',
    evidenceIds: ['01', '02'],
  },
  {
    id: 'FIND-02',
    title: 'No acute ECG pattern detected',
    confidence: 96,
    severity: 'Low',
    model: 'ECG Signal Model v1.8.3',
    explanation:
      'No acute pattern was detected in this deterministic demo waveform result.',
    evidenceIds: ['03'],
  },
  {
    id: 'FIND-03',
    title: 'Historical comparison recommended',
    confidence: 88,
    severity: 'Moderate',
    model: 'Clinical NLP Engine v4.0.2',
    explanation:
      'Compare with prior studies and relevant clinical notes during physician review.',
    evidenceIds: ['01', '04'],
  },
]

const initialCases: DemoCase[] = [
  {
    id: 'CASE-2048',
    patientId: 'PAT-1001',
    patientName: 'Ram Sharma',
    status: 'awaiting-review',
    createdAt: '8 min ago',
    modalities: ['X-Ray', 'Clinical Text'],
    confidence: 91,
  },
  {
    id: 'CASE-2047',
    patientId: 'PAT-1002',
    patientName: 'Geeta Walkar',
    status: 'processing',
    createdAt: '14 min ago',
    modalities: ['MRI'],
    confidence: 87,
  },
  {
    id: 'CASE-2046',
    patientId: 'PAT-1003',
    patientName: 'Arjun Patil',
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
    actor: 'Dr. Ajay Lad',
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
    actor: 'Dr. Ajay Lad',
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

  const [reports, setReports] = useState<DemoClinicalReport[]>(
    () => load(REPORTS_KEY, []),
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

  useEffect(() => {
    localStorage.setItem(
      REPORTS_KEY,
      JSON.stringify(reports),
    )
  }, [reports])

  const addAuditEvent = (
    action: string,
    target: string,
    status: AuditEvent['status'] = 'Completed',
    actor = 'Dr. Ajay Lad',
  ) => {
    const now = new Date()

    const event: AuditEvent = {
      id: `AUD-${Date.now()}`,
      time: now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      actor,
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

  const markCaseAwaitingReview = (caseId: string) => {
    setCases((current) =>
      current.map((item) =>
        item.id === caseId &&
        item.status === 'processing'
          ? {
              ...item,
              status: 'awaiting-review',
            }
          : item,
      ),
    )
  }

  const saveClinicalReport = (
    report: DemoClinicalReport,
  ) => {
    setReports((current) => [
      report,
      ...current.filter(
        (item) => item.caseId !== report.caseId,
      ),
    ])

    addAuditEvent(
      'Clinical Report Draft Saved',
      report.caseId,
      'Saved',
    )
  }

  const approveClinicalReport = (
    report: DemoClinicalReport,
    shareWithPatient: boolean,
  ) => {
    const status = shareWithPatient
      ? 'shared'
      : 'approved'

    setReports((current) => [
      {
        ...report,
        status,
        approvedAt: new Date().toISOString(),
      },
      ...current.filter(
        (item) => item.caseId !== report.caseId,
      ),
    ])

    setCases((current) =>
      current.map((item) =>
        item.id === report.caseId
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
      'Clinical Report Approved',
      report.caseId,
      'Approved',
    )

    if (shareWithPatient) {
      addAuditEvent(
        'Clinical Report Shared with Patient',
        report.caseId,
        'Shared',
      )
    }
  }

  const activeCase = cases[0] ?? null

  const value = useMemo(
    () => ({
      cases,
      auditEvents,
      reports,
      aiFindings: demoAiFindings,
      ragEvidence: demoRAGEvidence,
      activeCase,
      createCase,
      approveCase,
      markCaseAwaitingReview,
      saveClinicalReport,
      approveClinicalReport,
      addAuditEvent,
    }),
    [
      cases,
      auditEvents,
      reports,
      activeCase,
    ],
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