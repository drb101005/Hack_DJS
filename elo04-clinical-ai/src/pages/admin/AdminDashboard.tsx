import { useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  Brain,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Database,
  FileClock,
  Gauge,
  HardDrive,
  LayoutDashboard,
  Lock,
  MonitorCog,
  MoreHorizontal,
  Network,
  Search,
  Server,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  UserRound,
  XCircle,
} from 'lucide-react'
import { useDemo } from '../../context/DemoContext'
import { mockPatients } from '../../data/patients'

interface AdminDashboardProps {
  onLogout: () => void
}

type AdminSection =
  | 'overview'
  | 'users'
  | 'models'
  | 'resources'
  | 'audit'
  | 'settings'

const doctors = [
  {
    id: 'DOC-001',
    name: 'Dr. Sarah Mitchell',
    specialty: 'Clinical Specialist',
    status: 'Active',
    cases: 42,
  },
  {
    id: 'DOC-002',
    name: 'Dr. David Wilson',
    specialty: 'Radiology',
    status: 'Active',
    cases: 31,
  },
  {
    id: 'DOC-003',
    name: 'Dr. Priya Shah',
    specialty: 'Cardiology',
    status: 'Active',
    cases: 27,
  },
  {
    id: 'DOC-004',
    name: 'Dr. Michael Chen',
    specialty: 'Neurology',
    status: 'Offline',
    cases: 18,
  },
]

const models = [
  {
    name: 'Chest X-Ray Screening',
    version: 'v2.4.1',
    modality: 'X-Ray',
    status: 'Active',
    latency: 142,
    memory: 1.8,
    accuracy: 94,
  },
  {
    name: 'Brain MRI Analyzer',
    version: 'v3.1.0',
    modality: 'MRI',
    status: 'Active',
    latency: 284,
    memory: 3.2,
    accuracy: 91,
  },
  {
    name: 'ECG Signal Model',
    version: 'v1.8.3',
    modality: 'ECG',
    status: 'Active',
    latency: 86,
    memory: 0.92,
    accuracy: 97,
  },
  {
    name: 'Clinical NLP Engine',
    version: 'v4.0.2',
    modality: 'Clinical Text',
    status: 'Idle',
    latency: 118,
    memory: 0.64,
    accuracy: 89,
  },
]

const resourceData = [
  {
    label: 'CPU Utilization',
    value: 42,
    unit: '%',
    icon: Cpu,
  },
  {
    label: 'Memory Usage',
    value: 68,
    unit: '%',
    icon: HardDrive,
  },
  {
    label: 'GPU Memory',
    value: 51,
    unit: '%',
    icon: MonitorCog,
  },
  {
    label: 'Inference Queue',
    value: 3,
    unit: '',
    icon: Activity,
  },
]

export default function AdminDashboard({
  onLogout,
}: AdminDashboardProps) {
  const { cases, auditEvents } = useDemo()

  const [section, setSection] =
    useState<AdminSection>('overview')

  const [search, setSearch] = useState('')

  const [modelFilter, setModelFilter] =
    useState('All')

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) return mockPatients

    return mockPatients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(query) ||
        patient.id.toLowerCase().includes(query) ||
        patient.condition.toLowerCase().includes(query),
    )
  }, [search])

  const filteredModels = useMemo(() => {
    if (modelFilter === 'All') return models

    return models.filter(
      (model) => model.modality === modelFilter,
    )
  }, [modelFilter])

  const recentEvents = auditEvents.slice(0, 8)

  return (
    <div className="min-h-screen bg-[#070b14] text-gray-200">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070b14]/95 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10">
              <ShieldCheck className="h-5 w-5 text-cyan-400" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                MedAI Clinical Intelligence
              </p>

              <p className="text-[10px] uppercase tracking-[0.18em] text-gray-600">
                ELO-04 Administration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-xs text-emerald-300 sm:flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Systems Operational
            </div>

            <button
              onClick={onLogout}
              className="rounded-xl border border-white/10 px-3 py-2 text-xs text-gray-400 transition hover:bg-white/5 hover:text-white"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside className="hidden w-60 shrink-0 border-r border-white/10 bg-[#090e19] p-4 lg:block">
          <nav className="space-y-1">
            <NavItem
              active={section === 'overview'}
              icon={LayoutDashboard}
              label="System Overview"
              onClick={() => setSection('overview')}
            />

            <NavItem
              active={section === 'users'}
              icon={Users}
              label="Users & Patients"
              onClick={() => setSection('users')}
            />

            <NavItem
              active={section === 'models'}
              icon={Brain}
              label="AI Models"
              onClick={() => setSection('models')}
            />

            <NavItem
              active={section === 'resources'}
              icon={Gauge}
              label="Resources"
              onClick={() => setSection('resources')}
            />

            <NavItem
              active={section === 'audit'}
              icon={FileClock}
              label="Audit Logs"
              onClick={() => setSection('audit')}
            />

            <NavItem
              active={section === 'settings'}
              icon={Settings}
              label="Settings"
              onClick={() => setSection('settings')}
            />
          </nav>

          <div className="mt-8 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-gray-600" />

              <span className="text-xs font-medium text-gray-400">
                Admin Access
              </span>
            </div>

            <p className="mt-2 text-[10px] leading-4 text-gray-600">
              Full system visibility, model management, audit
              access and resource monitoring.
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-4 lg:p-6">
          <div className="mb-5 flex gap-2 overflow-x-auto lg:hidden">
            {[
              ['overview', 'Overview'],
              ['users', 'Users'],
              ['models', 'Models'],
              ['resources', 'Resources'],
              ['audit', 'Audit'],
              ['settings', 'Settings'],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() =>
                  setSection(value as AdminSection)
                }
                className={`whitespace-nowrap rounded-xl px-3 py-2 text-xs ${
                  section === value
                    ? 'bg-cyan-500 text-slate-950'
                    : 'border border-white/10 text-gray-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {section === 'overview' && (
            <OverviewSection
              casesCount={cases.length + 3}
              auditCount={auditEvents.length}
              onNavigate={setSection}
            />
          )}

          {section === 'users' && (
            <UsersSection
              search={search}
              setSearch={setSearch}
              patients={filteredPatients}
              cases={cases.length}
            />
          )}

          {section === 'models' && (
            <ModelsSection
              filter={modelFilter}
              setFilter={setModelFilter}
              models={filteredModels}
            />
          )}

          {section === 'resources' && (
            <ResourcesSection />
          )}

          {section === 'audit' && (
            <AuditSection events={recentEvents} />
          )}

          {section === 'settings' && (
            <AdminSettings />
          )}
        </main>
      </div>
    </div>
  )
}

function OverviewSection({
  casesCount,
  auditCount,
  onNavigate,
}: {
  casesCount: number
  auditCount: number
  onNavigate: (section: AdminSection) => void
}) {
  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="System Control"
        title="System Overview"
        description="Real-time administrative view of the ELO-04 clinical AI platform."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Users}
          label="Registered Patients"
          value="1,284"
          detail="+34 this month"
        />

        <StatCard
          icon={UserRound}
          label="Clinical Users"
          value="48"
          detail="42 active today"
        />

        <StatCard
          icon={Activity}
          label="Active Cases"
          value={String(casesCount)}
          detail="3 currently processing"
        />

        <StatCard
          icon={Server}
          label="System Uptime"
          value="99.98%"
          detail="Last 30 days"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-2xl border border-white/10 bg-[#0b1120] p-5">
          <SectionTitle
            icon={Network}
            title="Live Screening Pipeline"
            action="View Resources"
            onAction={() => onNavigate('resources')}
          />

          <div className="mt-5 space-y-3">
            {[
              ['Document ingestion', 92, 'Healthy'],
              ['Modality detection', 98, 'Healthy'],
              ['Model inference', 94, 'Healthy'],
              ['RAG retrieval', 97, 'Healthy'],
              ['Evidence fusion', 91, 'Healthy'],
            ].map(([label, value, status]) => (
              <div key={String(label)}>
                <div className="mb-2 flex justify-between text-xs">
                  <span className="text-gray-400">
                    {String(label)}
                  </span>

                  <span className="text-emerald-300">
                    {String(status)}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-cyan-400"
                    style={{ width: `${Number(value)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#0b1120] p-5">
          <SectionTitle
            icon={Activity}
            title="System Health"
            action="Resources"
            onAction={() => onNavigate('resources')}
          />

          <div className="mt-5 space-y-4">
            <HealthRow
              label="API Gateway"
              value="Operational"
            />
            <HealthRow
              label="AI Orchestrator"
              value="Operational"
            />
            <HealthRow
              label="RAG Service"
              value="Operational"
            />
            <HealthRow
              label="Document Scanner"
              value="Operational"
            />
            <HealthRow
              label="Audit Service"
              value="Operational"
            />
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-[#0b1120] p-5">
          <SectionTitle
            icon={Brain}
            title="AI Model Registry"
            action="Manage Models"
            onAction={() => onNavigate('models')}
          />

          <div className="mt-4 space-y-2">
            {models.map((model) => (
              <div
                key={model.name}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3"
              >
                <div>
                  <p className="text-xs font-medium text-gray-200">
                    {model.name}
                  </p>

                  <p className="mt-1 text-[10px] text-gray-600">
                    {model.version} · {model.modality}
                  </p>
                </div>

                <span
                  className={`rounded-full px-2 py-1 text-[9px] ${
                    model.status === 'Active'
                      ? 'bg-emerald-500/10 text-emerald-300'
                      : 'bg-gray-500/10 text-gray-400'
                  }`}
                >
                  {model.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#0b1120] p-5">
          <SectionTitle
            icon={FileClock}
            title="Recent Audit Activity"
            action="View All"
            onAction={() => onNavigate('audit')}
          />

          <div className="mt-4 space-y-2">
            <AuditPreview />

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
              <p className="text-xs font-medium text-white">
                {auditCount} tracked events
              </p>

              <p className="mt-1 text-[10px] text-gray-600">
                Clinical and system actions are retained in the demo audit trail.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function UsersSection({
  search,
  setSearch,
  patients,
  cases,
}: {
  search: string
  setSearch: (value: string) => void
  patients: typeof mockPatients
  cases: number
}) {
  const [tab, setTab] =
    useState<'patients' | 'doctors'>('patients')

  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="Identity Management"
        title="Users & Patients"
        description="Manage clinical users and registered patient records."
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setTab('patients')}
            className={`rounded-xl px-4 py-2 text-xs ${
              tab === 'patients'
                ? 'bg-cyan-500 text-slate-950'
                : 'border border-white/10 text-gray-400'
            }`}
          >
            Patients
          </button>

          <button
            onClick={() => setTab('doctors')}
            className={`rounded-xl px-4 py-2 text-xs ${
              tab === 'doctors'
                ? 'bg-cyan-500 text-slate-950'
                : 'border border-white/10 text-gray-400'
            }`}
          >
            Doctors
          </button>
        </div>

        {tab === 'patients' && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search patient..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-9 pr-3 text-xs text-gray-200 outline-none placeholder:text-gray-700 focus:border-cyan-500/40"
            />
          </div>
        )}
      </div>

      {tab === 'patients' ? (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1120]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="border-b border-white/5 bg-white/[0.02]">
                <tr>
                  {[
                    'Patient',
                    'ID',
                    'Condition',
                    'Status',
                    'Cases',
                    '',
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-5 py-4 text-[10px] uppercase tracking-wider text-gray-600"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {patients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="transition hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4">
                      <p className="text-xs font-medium text-white">
                        {patient.name}
                      </p>

                      <p className="mt-1 text-[10px] text-gray-600">
                        {patient.age} · {patient.gender}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-xs text-gray-500">
                      {patient.id}
                    </td>

                    <td className="px-5 py-4 text-xs text-gray-400">
                      {patient.condition}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={patient.status} />
                    </td>

                    <td className="px-5 py-4 text-xs text-gray-400">
                      {cases + patient.age % 4}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button className="rounded-lg p-2 text-gray-600 hover:bg-white/5 hover:text-white">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="rounded-2xl border border-white/10 bg-[#0b1120] p-5"
            >
              <div className="flex items-start justify-between">
                <div className="rounded-xl bg-cyan-500/10 p-3">
                  <UserRound className="h-5 w-5 text-cyan-400" />
                </div>

                <StatusBadge status={doctor.status} />
              </div>

              <h3 className="mt-5 text-sm font-semibold text-white">
                {doctor.name}
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                {doctor.specialty}
              </p>

              <div className="mt-5 flex justify-between border-t border-white/5 pt-4 text-xs">
                <span className="text-gray-600">
                  Clinical cases
                </span>

                <span className="font-semibold text-gray-300">
                  {doctor.cases}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ModelsSection({
  filter,
  setFilter,
  models: visibleModels,
}: {
  filter: string
  setFilter: (value: string) => void
  models: typeof models
}) {
  const filters = [
    'All',
    'X-Ray',
    'MRI',
    'ECG',
    'Clinical Text',
  ]

  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="AI Infrastructure"
        title="AI Model Registry"
        description="Monitor loaded models, versions, latency, memory, and inference confidence."
      />

      <div className="flex gap-2 overflow-x-auto">
        {filters.map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`whitespace-nowrap rounded-xl px-3 py-2 text-xs ${
              filter === item
                ? 'bg-cyan-500 text-slate-950'
                : 'border border-white/10 text-gray-500 hover:text-white'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {visibleModels.map((model) => (
          <div
            key={model.name}
            className="rounded-2xl border border-white/10 bg-[#0b1120] p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  {model.name}
                </p>

                <p className="mt-1 text-xs text-gray-600">
                  {model.version} · {model.modality}
                </p>
              </div>

              <StatusBadge status={model.status} />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <MiniMetric
                label="Latency"
                value={`${model.latency} ms`}
              />

              <MiniMetric
                label="Memory"
                value={`${model.memory} GB`}
              />

              <MiniMetric
                label="Confidence"
                value={`${model.accuracy}%`}
              />
            </div>

            <div className="mt-5">
              <div className="mb-2 flex justify-between text-[10px]">
                <span className="text-gray-600">
                  Model confidence
                </span>

                <span className="text-cyan-300">
                  {model.accuracy}%
                </span>
              </div>

              <div className="h-1.5 rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-cyan-400"
                  style={{
                    width: `${model.accuracy}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ResourcesSection() {
  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="Infrastructure"
        title="Resource Monitoring"
        description="Simulated infrastructure telemetry for AI inference services."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {resourceData.map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-[#0b1120] p-5"
            >
              <Icon className="h-5 w-5 text-cyan-400" />

              <p className="mt-4 text-xs text-gray-600">
                {item.label}
              </p>

              <p className="mt-1 text-2xl font-semibold text-white">
                {item.value}
                {item.unit}
              </p>

              <div className="mt-4 h-1.5 rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-cyan-400"
                  style={{
                    width: `${
                      item.unit === '%'
                        ? item.value
                        : 24
                    }%`,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ResourcePanel
          title="Compute Nodes"
          icon={Server}
          items={[
            ['Inference Node 01', 'Healthy', '42% CPU'],
            ['Inference Node 02', 'Healthy', '37% CPU'],
            ['GPU Node 01', 'Healthy', '51% VRAM'],
            ['Document Node 01', 'Healthy', '31% CPU'],
          ]}
        />

        <ResourcePanel
          title="Services"
          icon={Database}
          items={[
            ['Model Registry', 'Operational', '6 models'],
            ['RAG Index', 'Operational', '4,821 retrievals'],
            ['Document Scanner', 'Operational', '98.7% OCR'],
            ['Audit Service', 'Operational', '24/7'],
          ]}
        />
      </div>
    </div>
  )
}

function AuditSection({
  events,
}: {
  events: Array<{
    id: string
    time: string
    actor: string
    action: string
    target: string
    status: string
  }>
}) {
  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="Compliance"
        title="Audit Logs"
        description="Traceable activity across clinical, AI, and administrative workflows."
      />

      <div className="rounded-2xl border border-white/10 bg-[#0b1120]">
        <div className="border-b border-white/5 p-5">
          <div className="flex items-center gap-3">
            <FileClock className="h-5 w-5 text-cyan-400" />

            <div>
              <p className="text-sm font-semibold text-white">
                Activity Timeline
              </p>

              <p className="text-xs text-gray-600">
                Latest recorded system events
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">
                <Activity className="h-4 w-4 text-cyan-400" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-white">
                  {event.action}
                </p>

                <p className="mt-1 text-[10px] text-gray-600">
                  {event.actor} · {event.target}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-[10px] text-gray-500">
                  {event.time}
                </p>

                <span className="mt-1 inline-block rounded-full bg-emerald-500/10 px-2 py-1 text-[9px] text-emerald-300">
                  {event.status}
                </span>
              </div>
            </div>
          ))}

          {events.length === 0 && (
            <div className="p-10 text-center text-xs text-gray-600">
              No audit events recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AdminSettings() {
  const [maintenance, setMaintenance] =
    useState(false)

  const [logging, setLogging] = useState(true)

  const [strictReview, setStrictReview] =
    useState(true)

  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="Administration"
        title="System Settings"
        description="Configure platform-level demo controls and clinical governance behavior."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-[#0b1120] p-5">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="h-5 w-5 text-cyan-400" />

            <div>
              <h2 className="text-sm font-semibold text-white">
                Platform Controls
              </h2>

              <p className="mt-1 text-xs text-gray-600">
                Demo environment configuration.
              </p>
            </div>
          </div>

          <div className="mt-5 divide-y divide-white/5">
            <AdminToggle
              label="Maintenance mode"
              description="Temporarily pause new screening cases."
              enabled={maintenance}
              onChange={() =>
                setMaintenance(!maintenance)
              }
            />

            <AdminToggle
              label="Audit logging"
              description="Record all clinical workflow activity."
              enabled={logging}
              onChange={() => setLogging(!logging)}
            />

            <AdminToggle
              label="Strict clinical review"
              description="Require physician approval before case completion."
              enabled={strictReview}
              onChange={() =>
                setStrictReview(!strictReview)
              }
            />
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#0b1120] p-5">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-cyan-400" />

            <div>
              <h2 className="text-sm font-semibold text-white">
                Security Status
              </h2>

              <p className="mt-1 text-xs text-gray-600">
                Current simulated platform security posture.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <SecurityRow
              label="Authentication"
              status="Protected"
            />

            <SecurityRow
              label="Role-based access"
              status="Enabled"
            />

            <SecurityRow
              label="Audit trail"
              status="Enabled"
            />

            <SecurityRow
              label="Clinical approval gate"
              status="Enabled"
            />
          </div>
        </section>
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

function NavItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ElementType
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs transition ${
        active
          ? 'bg-cyan-500/10 text-cyan-300'
          : 'text-gray-500 hover:bg-white/[0.03] hover:text-gray-200'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

function SectionTitle({
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
          className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300"
        >
          {action}
          <ChevronRight className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: React.ElementType
  label: string
  value: string
  detail: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b1120] p-5">
      <div className="flex items-center justify-between">
        <Icon className="h-5 w-5 text-cyan-400" />

        <span className="h-2 w-2 rounded-full bg-emerald-400" />
      </div>

      <p className="mt-5 text-xs text-gray-600">
        {label}
      </p>

      <p className="mt-1 text-2xl font-semibold text-white">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-emerald-400">
        {detail}
      </p>
    </div>
  )
}

function HealthRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0">
      <span className="text-xs text-gray-400">
        {label}
      </span>

      <span className="flex items-center gap-2 text-[10px] text-emerald-300">
        <CheckCircle2 className="h-3.5 w-3.5" />
        {value}
      </span>
    </div>
  )
}

function AuditPreview() {
  return (
    <div className="space-y-2">
      {[
        ['09:42:18', 'AI Analysis', 'CASE-2048'],
        ['09:41:57', 'RAG Retrieval', 'CASE-2048'],
        ['09:40:31', 'Patient Record', 'PAT-1001'],
      ].map(([time, action, target]) => (
        <div
          key={`${time}-${action}`}
          className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3"
        >
          <span className="font-mono text-[9px] text-gray-600">
            {time}
          </span>

          <span className="flex-1 text-xs text-gray-400">
            {action}
          </span>

          <span className="text-[10px] text-cyan-400">
            {target}
          </span>
        </div>
      ))}
    </div>
  )
}

function StatusBadge({
  status,
}: {
  status: string
}) {
  const positive =
    status === 'Active' ||
    status === 'stable' ||
    status === 'Operational'

  const warning =
    status === 'monitoring' ||
    status === 'Idle'

  return (
    <span
      className={`rounded-full px-2 py-1 text-[9px] ${
        positive
          ? 'bg-emerald-500/10 text-emerald-300'
          : warning
            ? 'bg-amber-500/10 text-amber-300'
            : 'bg-red-500/10 text-red-300'
      }`}
    >
      {status}
    </span>
  )
}

function MiniMetric({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <p className="text-[9px] uppercase tracking-wider text-gray-600">
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold text-gray-300">
        {value}
      </p>
    </div>
  )
}

function ResourcePanel({
  title,
  icon: Icon,
  items,
}: {
  title: string
  icon: React.ElementType
  items: string[][]
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#0b1120] p-5">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-cyan-400" />

        <h2 className="text-sm font-semibold text-white">
          {title}
        </h2>
      </div>

      <div className="mt-4 space-y-2">
        {items.map(([name, status, detail]) => (
          <div
            key={name}
            className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3"
          >
            <div className="h-2 w-2 rounded-full bg-emerald-400" />

            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-300">
                {name}
              </p>

              <p className="mt-1 text-[10px] text-gray-600">
                {status}
              </p>
            </div>

            <span className="text-[10px] text-cyan-300">
              {detail}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

function AdminToggle({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string
  description: string
  enabled: boolean
  onChange: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-5">
      <div>
        <p className="text-sm font-medium text-gray-200">
          {label}
        </p>

        <p className="mt-1 text-xs leading-5 text-gray-600">
          {description}
        </p>
      </div>

      <button
        onClick={onChange}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? 'bg-cyan-500' : 'bg-gray-700'
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            enabled ? 'left-6' : 'left-1'
          }`}
        />
      </button>
    </div>
  )
}

function SecurityRow({
  label,
  status,
}: {
  label: string
  status: string
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <span className="text-xs text-gray-400">
        {label}
      </span>

      <span className="flex items-center gap-1.5 text-[10px] text-emerald-300">
        <CheckCircle2 className="h-3.5 w-3.5" />
        {status}
      </span>
    </div>
  )
}