import { useMemo, useState } from 'react'
import {
  Activity,
  ChevronRight,
  Filter,
  HeartPulse,
  Search,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import { mockPatients } from '../../data/patients'
import type { Patient } from '../../types'

interface PatientsProps {
  onOpenPatient: (patient: Patient) => void
}

function StatusBadge({ status }: { status: Patient['status'] }) {
  const config = {
    stable: {
      label: 'Stable',
      className:
        'bg-emerald-400/10 text-emerald-300 border-emerald-400/10',
    },
    monitoring: {
      label: 'Monitoring',
      className:
        'bg-amber-400/10 text-amber-300 border-amber-400/10',
    },
    critical: {
      label: 'Critical',
      className:
        'bg-red-400/10 text-red-300 border-red-400/10',
    },
  }

  const current = config[status]

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] ${current.className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {current.label}
    </span>
  )
}

function PatientAvatar({ patient }: { patient: Patient }) {
  return (
    <div className="h-11 w-11 rounded-xl bg-cyan-400/10 border border-cyan-400/10 flex items-center justify-center shrink-0">
      <span className="text-sm font-semibold text-cyan-300">
        {patient.name
          .split(' ')
          .map((name) => name[0])
          .join('')
          .slice(0, 2)}
      </span>
    </div>
  )
}

export default function Patients({
  onOpenPatient,
}: PatientsProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<
    'all' | Patient['status']
  >('all')

  const filteredPatients = useMemo(() => {
    return mockPatients.filter((patient) => {
      const matchesSearch =
        patient.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        patient.id
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        patient.condition
          .toLowerCase()
          .includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === 'all' ||
        patient.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter])

  const stableCount = mockPatients.filter(
    (patient) => patient.status === 'stable'
  ).length

  const monitoringCount = mockPatients.filter(
    (patient) => patient.status === 'monitoring'
  ).length

  const criticalCount = mockPatients.filter(
    (patient) => patient.status === 'critical'
  ).length

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-400 mb-2">
            Patient Hub
          </p>

          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Patients
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Manage patient records, investigations and clinical
            screening cases.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 bg-cyan-400 text-black font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-cyan-300 transition"
        >
          <UserRound size={16} />
          Add Patient
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-5">
          <div className="h-10 w-10 rounded-xl bg-cyan-400/10 flex items-center justify-center">
            <UserRound size={19} className="text-cyan-400" />
          </div>

          <p className="text-2xl font-semibold text-white mt-4">
            {mockPatients.length}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Total patients
          </p>
        </div>

        <div className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-5">
          <div className="h-10 w-10 rounded-xl bg-emerald-400/10 flex items-center justify-center">
            <HeartPulse
              size={19}
              className="text-emerald-400"
            />
          </div>

          <p className="text-2xl font-semibold text-white mt-4">
            {stableCount}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Stable
          </p>
        </div>

        <div className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-5">
          <div className="h-10 w-10 rounded-xl bg-amber-400/10 flex items-center justify-center">
            <Activity
              size={19}
              className="text-amber-400"
            />
          </div>

          <p className="text-2xl font-semibold text-white mt-4">
            {monitoringCount + criticalCount}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Require monitoring
          </p>
        </div>
      </div>

      {/* Search / filters */}
      <div className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by patient name, ID or condition..."
              className="w-full h-11 bg-[#080d17] border border-white/[0.07] rounded-xl pl-11 pr-4 text-sm text-white placeholder:text-gray-700 outline-none focus:border-cyan-400/30 transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-600" />

            {(
              [
                ['all', 'All'],
                ['stable', 'Stable'],
                ['monitoring', 'Monitoring'],
                ['critical', 'Critical'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setStatusFilter(value)
                }
                className={`h-10 px-3 rounded-lg text-xs border transition ${
                  statusFilter === value
                    ? 'bg-cyan-400/10 border-cyan-400/20 text-cyan-300'
                    : 'bg-white/[0.02] border-white/[0.06] text-gray-500 hover:text-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Patient table */}
      <section className="bg-[#0d1320] border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.07] flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-white">
              Patient Directory
            </h2>

            <p className="text-xs text-gray-600 mt-1">
              {filteredPatients.length} patients displayed
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-600">
            <ShieldCheck size={14} />
            Protected clinical workspace
          </div>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {filteredPatients.map((patient) => (
            <button
              key={patient.id}
              type="button"
              onClick={() => onOpenPatient(patient)}
              className="w-full text-left px-5 py-4 hover:bg-white/[0.025] transition group"
            >
              <div className="flex items-center gap-4">
                <PatientAvatar patient={patient} />

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                    <p className="text-sm font-medium text-gray-200">
                      {patient.name}
                    </p>

                    <span className="text-[10px] text-gray-700">
                      {patient.id}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 mt-1 truncate">
                    {patient.age} years • {patient.gender} •{' '}
                    {patient.bloodGroup} • {patient.condition}
                  </p>
                </div>

                <div className="hidden md:block">
                  <StatusBadge status={patient.status} />
                </div>

                <div className="hidden lg:flex items-center gap-2 text-xs text-gray-600">
                  <span>View profile</span>

                  <ChevronRight
                    size={15}
                    className="group-hover:text-cyan-400 group-hover:translate-x-0.5 transition"
                  />
                </div>
              </div>
            </button>
          ))}

          {filteredPatients.length === 0 && (
            <div className="py-16 text-center">
              <Search
                size={24}
                className="mx-auto text-gray-700"
              />

              <p className="text-sm text-gray-500 mt-3">
                No patients found
              </p>

              <p className="text-xs text-gray-700 mt-1">
                Try changing your search or filter.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
