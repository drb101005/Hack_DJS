import { useMemo } from 'react'
import { useDemo } from '../../context/DemoContext'

import {
  Activity,
  BrainCircuit,
  CheckCircle2,
  ClipboardList,
  Cpu,
  Database,
  FileText,
  Gauge,
  HardDrive,
  ShieldCheck,
  Users,
} from 'lucide-react'

const users = [
  ['Dr. Sarah Mitchell', 'Doctor', 'Active'],
  ['James Anderson', 'Patient', 'Active'],
  ['Emily Carter', 'Patient', 'Active'],
  ['Michael Thompson', 'Patient', 'Monitoring'],
]

const models = [
  ['Chest X-Ray Screening', 'v2.4.1', 'Active', '142 ms'],
  ['Brain MRI Analyzer', 'v3.1.0', 'Active', '284 ms'],
  ['ECG Signal Model', 'v1.8.3', 'Active', '86 ms'],
  ['Clinical NLP Engine', 'v4.0.2', 'Idle', '118 ms'],
]

const auditLogs = [
  ['09:42:18', 'CASE-3042', 'AI Analysis', 'Completed'],
  ['09:41:57', 'CASE-3042', 'RAG Retrieval', 'Completed'],
  ['09:40:31', 'DOC-001', 'Patient Record', 'Accessed'],
  ['09:38:12', 'CASE-3041', 'Report Approval', 'Approved'],
  ['09:35:44', 'PAT-1003', 'Investigation', 'Uploaded'],
]

interface AdminDashboardProps {
  onLogout: () => void
}

export default function AdminDashboard({
  onLogout,
}: AdminDashboardProps) {
  const { cases, auditEvents } = useDemo()

  const recentEvents = useMemo(
    () => auditEvents.slice(0, 5),
    [auditEvents],
  )

  return (
    <div className="min-h-screen bg-[#070b14] text-white">
      <header className="border-b border-white/[0.06] bg-[#0a0f1a]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-cyan-400/10 flex items-center justify-center">
              <ShieldCheck size={18} className="text-cyan-400" />
            </div>

            <div>
              <p className="text-sm font-semibold">
                MedAI
              </p>
              <p className="text-[10px] text-gray-600">
                System Administration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-400/5 border border-emerald-400/10">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-300">
                Systems Operational
              </span>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="text-xs text-gray-600 hover:text-gray-300 transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-7 space-y-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400">
            Administration
          </p>

          <h1 className="text-2xl font-semibold mt-1">
            System Overview
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Users, AI infrastructure, resource health and audit activity.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            ['128', 'Total Patients', Users],
            ['12', 'Clinical Users', ClipboardList],
            [String(cases.length + 3), 'Active Cases', BrainCircuit],
            ['99.2%', 'System Uptime', Activity],
          ].map(([value, label, Icon]) => {
            const IconComponent = Icon as typeof Activity

            return (
              <div
                key={String(label)}
                className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-5"
              >
                <IconComponent
                  size={18}
                  className="text-cyan-400"
                />

                <p className="text-2xl font-semibold mt-4">
                  {value as string}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {label as string}
                </p>
              </div>
            )
          })}
        </div>

        <section className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.7fr] gap-5">
          <div className="bg-[#0d1320] border border-white/[0.07] rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <BrainCircuit
                  size={16}
                  className="text-cyan-400"
                />
                <h2 className="text-sm font-semibold">
                  AI Model Registry
                </h2>
              </div>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {models.map(([name, version, status, latency]) => (
                <div
                  key={name}
                  className="p-4 flex items-center gap-4"
                >
                  <div className="h-9 w-9 rounded-lg bg-cyan-400/10 flex items-center justify-center">
                    <Cpu
                      size={15}
                      className="text-cyan-400"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-xs text-gray-300">
                      {name}
                    </p>
                    <p className="text-[10px] text-gray-700 mt-1">
                      {version}
                    </p>
                  </div>

                  <span
                    className={`text-[10px] ${
                      status === 'Active'
                        ? 'text-emerald-400'
                        : 'text-gray-600'
                    }`}
                  >
                    {status}
                  </span>

                  <span className="text-[10px] text-gray-500 w-16 text-right">
                    {latency}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-5">
            <div className="flex items-center gap-2">
              <Gauge
                size={16}
                className="text-amber-400"
              />
              <h2 className="text-sm font-semibold">
                Resource Monitoring
              </h2>
            </div>

            <div className="space-y-5 mt-6">
              {[
                ['CPU', 42, Cpu],
                ['Memory', 68, HardDrive],
                ['GPU Memory', 51, Database],
                ['Inference Queue', 3, Activity],
              ].map(([label, value, Icon]) => {
                const IconComponent = Icon as typeof Activity

                return (
                  <div key={String(label)}>
                    <div className="flex items-center gap-2">
                      <IconComponent
                        size={13}
                        className="text-gray-600"
                      />

                      <span className="text-xs text-gray-500 flex-1">
                        {label as string}
                      </span>

                      <span className="text-xs text-gray-300">
                        {String(value)}
                        {label === 'Inference Queue'
                          ? ''
                          : '%'}
                      </span>
                    </div>

                    <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full bg-cyan-400 rounded-full"
                        style={{
                          width:
                            label === 'Inference Queue'
                              ? '25%'
                              : `${value}%`,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-[0.8fr_1.2fr] gap-5">
          <div className="bg-[#0d1320] border border-white/[0.07] rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Users
                  size={16}
                  className="text-violet-400"
                />
                <h2 className="text-sm font-semibold">
                  User Directory
                </h2>
              </div>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {users.map(([name, role, status]) => (
                <div
                  key={name}
                  className="p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-300">
                      {name}
                    </p>

                    <span className="text-[9px] text-emerald-400">
                      {status}
                    </span>
                  </div>

                  <p className="text-[10px] text-gray-700 mt-1">
                    {role}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0d1320] border border-white/[0.07] rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <FileText
                  size={16}
                  className="text-cyan-400"
                />
                <h2 className="text-sm font-semibold">
                  Audit Logs
                </h2>
              </div>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 flex items-center gap-4"
                >
                  <span className="text-[10px] font-mono text-gray-700">
                    {event.time}
                  </span>

                  <span className="text-[10px] font-mono text-cyan-400">
                    {event.target}
                  </span>

                  <span className="text-xs text-gray-400 flex-1">
                    {event.action}
                  </span>

                  <span className="text-[10px] text-emerald-400">
                    {event.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#0d1320] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <ClipboardList
                size={16}
                className="text-cyan-400"
              />

              <h2 className="text-sm font-semibold">
                Live Screening Cases
              </h2>
            </div>

            <p className="text-xs text-gray-600 mt-1">
              Cases generated by the clinical demo workflow.
            </p>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {cases.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="p-4 flex items-center gap-4"
              >
                <div className="h-9 w-9 rounded-lg bg-cyan-400/10 flex items-center justify-center">
                  <Activity
                    size={15}
                    className="text-cyan-400"
                  />
                </div>

                <div className="flex-1">
                  <p className="text-xs text-gray-300">
                    {item.id} • {item.patientName}
                  </p>

                  <p className="text-[10px] text-gray-700 mt-1">
                    {item.modalities.join(' + ')}
                  </p>
                </div>

                <span
                  className={`text-[10px] ${
                    item.status === 'approved'
                      ? 'text-emerald-400'
                      : item.status === 'processing'
                        ? 'text-amber-400'
                        : 'text-cyan-400'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            ['1,284', 'Documents Processed'],
            ['4,821', 'RAG Retrievals'],
            ['98.2%', 'Inference Success'],
            ['164 ms', 'Avg AI Latency'],
          ].map(([value, label]) => (
            <div
              key={label}
              className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-4"
            >
              <p className="text-lg font-semibold">
                {value}
              </p>
              <p className="text-[10px] text-gray-600 mt-1">
                {label}
              </p>
            </div>
          ))}
        </section>

        <section className="bg-emerald-400/[0.035] border border-emerald-400/10 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2
              size={18}
              className="text-emerald-400 mt-0.5"
            />

            <div>
              <p className="text-sm text-emerald-300">
                All core systems operational
              </p>

              <p className="text-xs text-gray-600 mt-1">
                AI orchestration, document processing, RAG retrieval and
                audit logging are available in the simulated environment.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
