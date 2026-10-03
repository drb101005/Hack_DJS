import { useMemo, useState } from 'react'
import {
  Activity,
  ArrowDownToLine,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileText,
  HeartPulse,
  History,
  LogOut,
  Pill,
  ShieldCheck,
  Stethoscope,
  UserRound,
  X,
} from 'lucide-react'

interface PatientDashboardProps {
  onLogout: () => void
}

type PatientSection =
  | 'overview'
  | 'records'
  | 'investigations'
  | 'reports'
  | 'timeline'

const records = [
  {
    id: 'REC-001',
    name: 'Chest X-Ray Report',
    type: 'Imaging',
    date: '12 Mar 2026',
    status: 'Reviewed',
    summary:
      'No acute cardiopulmonary abnormality identified in the simulated screening report.',
  },
  {
    id: 'REC-002',
    name: 'ECG Investigation',
    type: 'Cardiology',
    date: '10 Mar 2026',
    status: 'Reviewed',
    summary:
      'Sinus rhythm with no acute simulated ECG pattern detected.',
  },
  {
    id: 'REC-003',
    name: 'Blood Panel',
    type: 'Laboratory',
    date: '04 Feb 2026',
    status: 'Reviewed',
    summary:
      'Routine blood panel available for longitudinal comparison.',
  },
  {
    id: 'REC-004',
    name: 'Respiratory Follow-up',
    type: 'Clinical Note',
    date: '18 Mar 2026',
    status: 'Reviewed',
    summary:
      'Intermittent shortness of breath documented during follow-up.',
  },
]

const investigations = [
  {
    name: 'Chest X-Ray',
    date: '12 Mar 2026',
    department: 'Radiology',
    result: 'Completed',
    icon: FileText,
  },
  {
    name: 'ECG',
    date: '10 Mar 2026',
    department: 'Cardiology',
    result: 'Completed',
    icon: HeartPulse,
  },
  {
    name: 'Blood Panel',
    date: '04 Feb 2026',
    department: 'Laboratory',
    result: 'Completed',
    icon: Activity,
  },
  {
    name: 'Respiratory Review',
    date: '18 Mar 2026',
    department: 'Clinical',
    result: 'Follow-up',
    icon: Stethoscope,
  },
]

const timeline = [
  {
    date: '18 Mar 2026',
    title: 'Respiratory follow-up',
    description:
      'Clinical note added following intermittent shortness of breath.',
    type: 'Clinical',
  },
  {
    date: '12 Mar 2026',
    title: 'Chest X-Ray completed',
    description:
      'Imaging report processed and added to your medical record.',
    type: 'Investigation',
  },
  {
    date: '10 Mar 2026',
    title: 'ECG completed',
    description:
      'Cardiac investigation completed and reviewed.',
    type: 'Investigation',
  },
  {
    date: '04 Feb 2026',
    title: 'Blood panel',
    description:
      'Routine laboratory investigation recorded.',
    type: 'Laboratory',
  },
]

export default function PatientDashboard({
  onLogout,
}: PatientDashboardProps) {
  const [section, setSection] =
    useState<PatientSection>('overview')

  const [selectedRecord, setSelectedRecord] =
    useState<(typeof records)[number] | null>(null)

  const [downloaded, setDownloaded] =
    useState(false)

  const navigation = [
    ['overview', 'Overview', Activity],
    ['records', 'My Records', FileText],
    ['investigations', 'Investigations', ClipboardList],
    ['reports', 'Reports', ShieldCheck],
    ['timeline', 'Timeline', History],
  ] as const

  const pageTitle = useMemo(() => {
    const item = navigation.find(
      ([value]) => value === section,
    )

    return item?.[1] ?? 'Overview'
  }, [section])

  const handleDownload = () => {
    setDownloaded(true)

    window.setTimeout(() => {
      setDownloaded(false)
    }, 2500)
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-gray-200">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070b14]/95 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10">
              <HeartPulse className="h-5 w-5 text-cyan-400" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                MedAI Patient Portal
              </p>

              <p className="text-[10px] uppercase tracking-[0.18em] text-gray-600">
                Personal Health Workspace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-xs text-emerald-300 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Secure Session
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-gray-400 hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1500px]">
        <aside className="hidden w-60 shrink-0 border-r border-white/10 bg-[#090e19] p-4 lg:block">
          <div className="mb-6 rounded-2xl border border-cyan-500/10 bg-cyan-500/5 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
              <UserRound className="h-5 w-5 text-cyan-400" />
            </div>

            <p className="mt-3 text-sm font-semibold text-white">
              James Anderson
            </p>

            <p className="mt-1 text-[10px] text-gray-600">
              Patient ID · PAT-1001
            </p>
          </div>

          <nav className="space-y-1">
            {navigation.map(
              ([value, label, Icon]) => (
                <button
                  key={value}
                  onClick={() =>
                    setSection(value as PatientSection)
                  }
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs transition ${
                    section === value
                      ? 'bg-cyan-500/10 text-cyan-300'
                      : 'text-gray-500 hover:bg-white/[0.03] hover:text-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ),
            )}
          </nav>

          <div className="mt-8 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />

            <p className="mt-3 text-xs font-medium text-gray-300">
              Your records are traceable
            </p>

            <p className="mt-1 text-[10px] leading-4 text-gray-600">
              Reports show which clinical records and investigations
              contributed to the screening workflow.
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-4 lg:p-6">
          <div className="mb-5 flex gap-2 overflow-x-auto lg:hidden">
            {navigation.map(
              ([value, label]) => (
                <button
                  key={value}
                  onClick={() =>
                    setSection(value as PatientSection)
                  }
                  className={`whitespace-nowrap rounded-xl px-3 py-2 text-xs ${
                    section === value
                      ? 'bg-cyan-500 text-slate-950'
                      : 'border border-white/10 text-gray-400'
                  }`}
                >
                  {label}
                </button>
              ),
            )}
          </div>

          {section === 'overview' && (
            <Overview
              onNavigate={setSection}
            />
          )}

          {section === 'records' && (
            <Records
              onOpen={setSelectedRecord}
            />
          )}

          {section === 'investigations' && (
            <Investigations />
          )}

          {section === 'reports' && (
            <Reports
              onDownload={handleDownload}
            />
          )}

          {section === 'timeline' && (
            <Timeline />
          )}

          {selectedRecord && (
            <RecordModal
              record={selectedRecord}
              onClose={() =>
                setSelectedRecord(null)
              }
            />
          )}

          {downloaded && (
            <div className="fixed bottom-5 right-5 z-50 rounded-xl border border-emerald-500/20 bg-[#0b1120] px-4 py-3 shadow-2xl">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />

                <span className="text-xs text-gray-300">
                  Report prepared for download
                </span>
              </div>
            </div>
          )}
        </main>
      </div>

      <p className="mx-auto max-w-[1500px] px-6 pb-6 text-[10px] text-gray-700">
        Demo environment · All patient records and clinical
        results shown in this prototype are simulated.
      </p>

      <span className="hidden">
        {pageTitle}
      </span>
    </div>
  )
}

function Overview({
  onNavigate,
}: {
  onNavigate: (section: PatientSection) => void
}) {
  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="Health Summary"
        title="Good morning, James"
        description="Here is your current simulated health record and recent activity."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PatientStat
          icon={HeartPulse}
          label="Heart Rate"
          value="72"
          unit="BPM"
          detail="Normal resting range"
        />

        <PatientStat
          icon={Activity}
          label="Oxygen Saturation"
          value="98"
          unit="%"
          detail="Latest reading"
        />

        <PatientStat
          icon={FileText}
          label="Medical Records"
          value="14"
          unit=""
          detail="Available documents"
        />

        <PatientStat
          icon={ClipboardList}
          label="Investigations"
          value="8"
          unit=""
          detail="Completed investigations"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <section className="rounded-2xl border border-white/10 bg-[#0b1120] p-5">
          <SectionHeader
            icon={FileText}
            title="Recent Records"
            action="View all"
            onAction={() => onNavigate('records')}
          />

          <div className="mt-5 space-y-2">
            {records.slice(0, 4).map((record) => (
              <div
                key={record.id}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3"
              >
                <div className="rounded-lg bg-cyan-500/10 p-2">
                  <FileText className="h-4 w-4 text-cyan-400" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-200">
                    {record.name}
                  </p>

                  <p className="mt-1 text-[10px] text-gray-600">
                    {record.type} · {record.date}
                  </p>
                </div>

                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#0b1120] p-5">
          <SectionHeader
            icon={Pill}
            title="Current Medications"
          />

          <div className="mt-5 space-y-3">
            <Medication
              name="Lisinopril"
              dose="10 mg · Once daily"
            />

            <Medication
              name="Atorvastatin"
              dose="20 mg · Once daily"
            />

            <Medication
              name="Salbutamol"
              dose="100 mcg · As required"
            />
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="rounded-xl bg-cyan-500/10 p-3">
            <ShieldCheck className="h-6 w-6 text-cyan-400" />
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold text-white">
              Your clinical AI report is traceable
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              AI screening findings are linked to investigations,
              historical records, and the clinical evidence used in
              the simulated analysis.
            </p>
          </div>

          <button
            onClick={() => onNavigate('reports')}
            className="flex items-center gap-2 rounded-xl border border-cyan-500/20 px-4 py-2.5 text-xs font-medium text-cyan-300 hover:bg-cyan-500/10"
          >
            View report
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>
    </div>
  )
}

function Records({
  onOpen,
}: {
  onOpen: (
    record: (typeof records)[number],
  ) => void
}) {
  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="Medical Records"
        title="My Records"
        description="Clinical documents and notes associated with your patient profile."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {records.map((record) => (
          <button
            key={record.id}
            onClick={() => onOpen(record)}
            className="group rounded-2xl border border-white/10 bg-[#0b1120] p-5 text-left transition hover:border-cyan-500/20 hover:bg-cyan-500/[0.02]"
          >
            <div className="flex items-start justify-between">
              <div className="rounded-xl bg-cyan-500/10 p-3">
                <FileText className="h-5 w-5 text-cyan-400" />
              </div>

              <ChevronRight className="h-4 w-4 text-gray-700 transition group-hover:text-cyan-400" />
            </div>

            <h3 className="mt-5 text-sm font-semibold text-white">
              {record.name}
            </h3>

            <p className="mt-1 text-xs text-gray-600">
              {record.type} · {record.date}
            </p>

            <p className="mt-4 text-xs leading-5 text-gray-500">
              {record.summary}
            </p>

            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[9px] text-emerald-300">
                {record.status}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function Investigations() {
  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="Clinical Activity"
        title="Investigations"
        description="Completed investigations and their simulated clinical status."
      />

      <div className="space-y-3">
        {investigations.map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.name}
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#0b1120] p-5 sm:flex-row sm:items-center"
            >
              <div className="rounded-xl bg-cyan-500/10 p-3">
                <Icon className="h-5 w-5 text-cyan-400" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold text-white">
                  {item.name}
                </p>

                <p className="mt-1 text-xs text-gray-600">
                  {item.department} · {item.date}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1.5 text-[10px] ${
                  item.result === 'Completed'
                    ? 'bg-emerald-500/10 text-emerald-300'
                    : 'bg-amber-500/10 text-amber-300'
                }`}
              >
                {item.result}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Reports({
  onDownload,
}: {
  onDownload: () => void
}) {
  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="Clinical Intelligence"
        title="Reports"
        description="Simulated AI-assisted screening reports approved by the clinical workflow."
      />

      <div className="rounded-2xl border border-white/10 bg-[#0b1120]">
        <div className="border-b border-white/5 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="rounded-xl bg-cyan-500/10 p-3">
              <ShieldCheck className="h-6 w-6 text-cyan-400" />
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-white">
                Multimodal Clinical Screening Report
              </p>

              <p className="mt-1 text-xs text-gray-600">
                CASE-2048 · James Anderson · 18 Mar 2026
              </p>
            </div>

            <button
              onClick={onDownload}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-xs text-gray-300 hover:bg-white/5"
            >
              <ArrowDownToLine className="h-4 w-4" />
              Download
            </button>
          </div>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-3">
          <ReportMetric
            label="Overall confidence"
            value="93%"
          />

          <ReportMetric
            label="Evidence sources"
            value="4"
          />

          <ReportMetric
            label="Linked findings"
            value="3"
          />
        </div>

        <div className="border-t border-white/5 p-5">
          <p className="text-xs uppercase tracking-wider text-gray-600">
            AI screening summary
          </p>

          <p className="mt-3 text-sm leading-6 text-gray-400">
            The simulated multimodal screening pipeline identified
            cardiopulmonary screening signals and linked them to
            historical respiratory documentation, chest imaging,
            ECG results, and laboratory evidence.
          </p>
        </div>

        <div className="grid gap-3 border-t border-white/5 p-5 md:grid-cols-3">
          <Finding
            title="Cardiopulmonary screening signal"
            confidence="92%"
            severity="Medium"
          />

          <Finding
            title="No acute ECG pattern detected"
            confidence="96%"
            severity="Low"
          />

          <Finding
            title="Historical comparison recommended"
            confidence="88%"
            severity="Medium"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
        <div className="flex gap-3">
          <ShieldCheck className="h-5 w-5 shrink-0 text-amber-400" />

          <div>
            <p className="text-sm font-semibold text-white">
              Clinical review notice
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              This prototype demonstrates traceability and AI
              assistance. The displayed findings are simulated and
              are not medical advice or a real diagnosis.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Timeline() {
  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="Longitudinal Record"
        title="Health Timeline"
        description="A chronological view of investigations, clinical notes, and screening activity."
      />

      <div className="rounded-2xl border border-white/10 bg-[#0b1120] p-5">
        <div className="space-y-0">
          {timeline.map((event, index) => (
            <div
              key={`${event.date}-${event.title}`}
              className="relative flex gap-4 pb-8 last:pb-0"
            >
              {index < timeline.length - 1 && (
                <div className="absolute left-[15px] top-8 h-full w-px bg-white/10" />
              )}

              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/10">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
              </div>

              <div className="pt-1">
                <p className="text-[10px] uppercase tracking-wider text-gray-600">
                  {event.date} · {event.type}
                </p>

                <p className="mt-2 text-sm font-semibold text-white">
                  {event.title}
                </p>

                <p className="mt-1 max-w-xl text-xs leading-5 text-gray-500">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RecordModal({
  record,
  onClose,
}: {
  record: (typeof records)[number]
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0b1120] shadow-2xl">
        <div className="flex items-start justify-between border-b border-white/5 p-5">
          <div>
            <p className="text-xs uppercase tracking-wider text-cyan-400">
              Medical Record
            </p>

            <h2 className="mt-2 text-lg font-semibold text-white">
              {record.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-white/5 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <InfoLine label="Record ID" value={record.id} />
          <InfoLine label="Type" value={record.type} />
          <InfoLine label="Date" value={record.date} />
          <InfoLine label="Status" value={record.status} />

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <p className="text-[10px] uppercase tracking-wider text-gray-600">
              Summary
            </p>

            <p className="mt-2 text-xs leading-6 text-gray-400">
              {record.summary}
            </p>
          </div>
        </div>

        <div className="border-t border-white/5 p-5">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-semibold text-slate-950 hover:bg-cyan-400"
          >
            Close Record
          </button>
        </div>
      </div>
    </div>
  )
}

function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-cyan-400">
        {eyebrow}
      </p>

      <h1 className="mt-2 text-2xl font-semibold text-white">
        {title}
      </h1>

      <p className="mt-1 max-w-2xl text-sm text-gray-500">
        {description}
      </p>
    </div>
  )
}

function SectionHeader({
  icon: Icon,
  title,
  action,
  onAction,
}: {
  icon: React.ElementType
  title: string
  action?: string
  onAction?: () => void
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-cyan-400" />

        <h2 className="text-sm font-semibold text-white">
          {title}
        </h2>
      </div>

      {action && (
        <button
          onClick={onAction}
          className="text-[10px] text-cyan-400 hover:text-cyan-300"
        >
          {action}
        </button>
      )}
    </div>
  )
}

function PatientStat({
  icon: Icon,
  label,
  value,
  unit,
  detail,
}: {
  icon: React.ElementType
  label: string
  value: string
  unit: string
  detail: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b1120] p-5">
      <Icon className="h-5 w-5 text-cyan-400" />

      <p className="mt-4 text-xs text-gray-600">
        {label}
      </p>

      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-2xl font-semibold text-white">
          {value}
        </span>

        <span className="text-xs text-gray-600">
          {unit}
        </span>
      </div>

      <p className="mt-1 text-[10px] text-emerald-400">
        {detail}
      </p>
    </div>
  )
}

function Medication({
  name,
  dose,
}: {
  name: string
  dose: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <div className="rounded-lg bg-violet-500/10 p-2">
        <Pill className="h-4 w-4 text-violet-400" />
      </div>

      <div>
        <p className="text-xs font-medium text-gray-300">
          {name}
        </p>

        <p className="mt-1 text-[10px] text-gray-600">
          {dose}
        </p>
      </div>
    </div>
  )
}

function ReportMetric({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
      <p className="text-[10px] uppercase tracking-wider text-gray-600">
        {label}
      </p>

      <p className="mt-2 text-xl font-semibold text-white">
        {value}
      </p>
    </div>
  )
}

function Finding({
  title,
  confidence,
  severity,
}: {
  title: string
  confidence: string
  severity: string
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-gray-300">
          {title}
        </p>

        <span className="text-[10px] text-cyan-300">
          {confidence}
        </span>
      </div>

      <p className="mt-3 text-[10px] text-gray-600">
        Severity
      </p>

      <p className="mt-1 text-xs text-amber-300">
        {severity}
      </p>
    </div>
  )
}

function InfoLine({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0">
      <span className="text-xs text-gray-600">
        {label}
      </span>

      <span className="text-xs font-medium text-gray-300">
        {value}
      </span>
    </div>
  )
}