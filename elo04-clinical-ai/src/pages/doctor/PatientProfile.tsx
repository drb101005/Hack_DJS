import {
  Activity,
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  FileText,
  Heart,
  History,
  Pill,
  ScanLine,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from 'lucide-react'
import type { Patient } from '../../types'

interface PatientProfileProps {
  patient: Patient
  onBack: () => void
  onStartScreening: (patient: Patient) => void
}

const medicalHistory = [
  {
    date: '18 Mar 2026',
    title: 'Respiratory follow-up',
    description:
      'Patient reported intermittent shortness of breath during exertion. Follow-up imaging recommended.',
    type: 'Clinical Note',
  },
  {
    date: '04 Feb 2026',
    title: 'Routine blood panel',
    description:
      'CBC and metabolic panel completed. Results attached to patient record.',
    type: 'Lab Report',
  },
  {
    date: '21 Nov 2025',
    title: 'Chest X-Ray',
    description:
      'Previous chest imaging stored in the patient investigation archive.',
    type: 'Imaging',
  },
]

const prescriptions = [
  {
    medication: 'Lisinopril',
    dosage: '10 mg',
    frequency: 'Once daily',
    status: 'Active',
  },
  {
    medication: 'Atorvastatin',
    dosage: '20 mg',
    frequency: 'Once daily',
    status: 'Active',
  },
  {
    medication: 'Salbutamol',
    dosage: '100 mcg',
    frequency: 'As required',
    status: 'Review',
  },
]

const investigations = [
  {
    type: 'Chest X-Ray',
    date: '12 Mar 2026',
    status: 'Completed',
    result: 'Screening available',
  },
  {
    type: 'ECG',
    date: '10 Mar 2026',
    status: 'Completed',
    result: 'Normal sinus rhythm',
  },
  {
    type: 'Blood Panel',
    date: '04 Feb 2026',
    status: 'Completed',
    result: 'Results available',
  },
]

const timeline = [
  {
    date: 'Today',
    time: '09:42',
    title: 'Patient record accessed',
    description: 'Dr. Ajay Lad opened the clinical record.',
    icon: UserRound,
  },
  {
    date: '12 Mar 2026',
    time: '14:18',
    title: 'Chest X-Ray completed',
    description: 'Imaging uploaded to patient record.',
    icon: ScanLine,
  },
  {
    date: '10 Mar 2026',
    time: '11:32',
    title: 'ECG investigation',
    description: 'ECG waveform recorded and processed.',
    icon: Activity,
  },
  {
    date: '18 Feb 2026',
    time: '16:05',
    title: 'Clinical consultation',
    description: 'Follow-up consultation recorded.',
    icon: Stethoscope,
  },
]

function StatusBadge({
  status,
}: {
  status: Patient['status']
}) {
  const config = {
    stable: {
      label: 'Stable',
      className:
        'bg-[#16A34A]/10 text-[#16A34A] border-emerald-400/10',
    },
    monitoring: {
      label: 'Monitoring',
      className:
        'bg-amber-400/10 text-[#526174] border-amber-400/10',
    },
    critical: {
      label: 'Critical',
      className:
        'bg-red-400/10 text-[#DC2626] border-red-400/10',
    },
  }

  const current = config[status]

  return (
    <span
      className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs ${current.className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {current.label}
    </span>
  )
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof History
  title: string
  subtitle: string
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="h-9 w-9 rounded-lg bg-cyan-400/10 flex items-center justify-center">
        <Icon size={17} className="text-[#2563EB]" />
      </div>

      <div>
        <h2 className="font-semibold text-[#172033]">
          {title}
        </h2>

        <p className="text-xs text-[#7B8794] mt-0.5">
          {subtitle}
        </p>
      </div>
    </div>
  )
}

export default function PatientProfile({
  patient,
  onBack,
  onStartScreening,
}: PatientProfileProps) {
  return (
    <div className="space-y-7">
      {/* Back navigation */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs text-[#526174] hover:text-[#2563EB] transition"
      >
        <ArrowLeft size={15} />
        Back to Patients
      </button>

      {/* Patient header */}
      <section className="bg-[#FFFFFF] border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-5">
            {/* Avatar */}
            <div className="h-20 w-20 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center shrink-0">
              <span className="text-2xl font-semibold text-[#2563EB]">
                {patient.name
                  .split(' ')
                  .map((name) => name[0])
                  .join('')
                  .slice(0, 2)}
              </span>
            </div>

            {/* Identity */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold text-[#172033]">
                  {patient.name}
                </h1>

                <StatusBadge status={patient.status} />
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-xs text-[#526174]">
                <span>{patient.id}</span>
                <span>{patient.age} years old</span>
                <span>{patient.gender}</span>
                <span>Blood Group {patient.bloodGroup}</span>
              </div>

              <p className="text-sm text-[#526174] mt-3">
                {patient.condition}
              </p>
            </div>

            {/* Action */}
            <button
              type="button"
              onClick={() => onStartScreening(patient)}
              className="inline-flex items-center justify-center gap-2 bg-cyan-400 text-black font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-cyan-300 transition shrink-0"
            >
              <ClipboardList size={16} />
              Start Screening
            </button>
          </div>
        </div>

        {/* Patient information strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-white/[0.06]">
          <div className="p-4 sm:px-6 border-b sm:border-b-0 sm:border-r border-white/[0.06]">
            <p className="text-[10px] uppercase tracking-wider text-[#7B8794]">
              Phone
            </p>

            <p className="text-sm text-[#334155] mt-1">
              {patient.phone}
            </p>
          </div>

          <div className="p-4 sm:px-6 border-b sm:border-b-0 sm:border-r border-white/[0.06]">
            <p className="text-[10px] uppercase tracking-wider text-[#7B8794]">
              Email
            </p>

            <p className="text-sm text-[#334155] mt-1 truncate">
              {patient.email}
            </p>
          </div>

          <div className="p-4 sm:px-6">
            <p className="text-[10px] uppercase tracking-wider text-[#7B8794]">
              Care Status
            </p>

            <div className="mt-1">
              <StatusBadge status={patient.status} />
            </div>
          </div>
        </div>
      </section>

      {/* Clinical summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] border border-white/[0.07] rounded-2xl p-5">
          <Heart size={19} className="text-[#DC2626]" />

          <p className="text-2xl font-semibold text-[#172033] mt-4">
            72
          </p>

          <p className="text-xs text-[#526174] mt-1">
            Resting heart rate
          </p>

          <p className="text-[10px] text-[#16A34A] mt-2">
            Within expected range
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-white/[0.07] rounded-2xl p-5">
          <Activity
            size={19}
            className="text-[#2563EB]"
          />

          <p className="text-2xl font-semibold text-[#172033] mt-4">
            98%
          </p>

          <p className="text-xs text-[#526174] mt-1">
            Oxygen saturation
          </p>

          <p className="text-[10px] text-[#16A34A] mt-2">
            Latest recorded
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-white/[0.07] rounded-2xl p-5">
          <FileText
            size={19}
            className="text-violet-400"
          />

          <p className="text-2xl font-semibold text-[#172033] mt-4">
            14
          </p>

          <p className="text-xs text-[#526174] mt-1">
            Clinical documents
          </p>

          <p className="text-[10px] text-[#7B8794] mt-2">
            Across patient history
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-white/[0.07] rounded-2xl p-5">
          <ScanLine
            size={19}
            className="text-[#526174]"
          />

          <p className="text-2xl font-semibold text-[#172033] mt-4">
            8
          </p>

          <p className="text-xs text-[#526174] mt-1">
            Investigations
          </p>

          <p className="text-[10px] text-[#7B8794] mt-2">
            3 within last 30 days
          </p>
        </div>
      </div>

      {/* Main clinical grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)] gap-5">
        {/* Left column */}
        <div className="space-y-5">
          {/* Medical history */}
          <section className="bg-[#FFFFFF] border border-white/[0.07] rounded-2xl p-5">
            <SectionHeader
              icon={History}
              title="Medical History"
              subtitle="Relevant historical clinical information"
            />

            <div className="space-y-4">
              {medicalHistory.map((item, index) => (
                <div
                  key={`${item.date}-${item.title}`}
                  className="relative pl-6"
                >
                  {index !== medicalHistory.length - 1 && (
                    <div className="absolute left-[5px] top-4 bottom-[-20px] w-px bg-white/[0.07]" />
                  )}

                  <div className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-cyan-400 border-2 border-[#E2E8F0] ring-1 ring-cyan-400/20" />

                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-[#334155]">
                        {item.title}
                      </p>

                      <p className="text-xs text-[#526174] mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <span className="text-[10px] text-[#7B8794] whitespace-nowrap">
                      {item.date}
                    </span>
                  </div>

                  <span className="inline-flex mt-2 px-2 py-1 rounded-md bg-[#F8FAFC] text-[10px] text-[#7B8794]">
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Investigations */}
          <section className="bg-[#FFFFFF] border border-white/[0.07] rounded-2xl overflow-hidden">
            <div className="p-5 pb-4">
              <SectionHeader
                icon={ScanLine}
                title="Recent Investigations"
                subtitle="Patient imaging, signals and laboratory investigations"
              />
            </div>

            <div className="divide-y divide-white/[0.04]">
              {investigations.map((investigation) => (
                <div
                  key={`${investigation.type}-${investigation.date}`}
                  className="px-5 py-4 flex items-center gap-4 hover:bg-[#F8FAFC] transition"
                >
                  <div className="h-10 w-10 rounded-xl bg-blue-400/10 flex items-center justify-center">
                    <ScanLine
                      size={17}
                      className="text-blue-400"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-[#334155]">
                      {investigation.type}
                    </p>

                    <p className="text-xs text-[#7B8794] mt-1">
                      {investigation.date}
                    </p>
                  </div>

                  <div className="hidden sm:block text-right">
                    <p className="text-xs text-[#16A34A]">
                      {investigation.status}
                    </p>

                    <p className="text-[10px] text-[#7B8794] mt-1">
                      {investigation.result}
                    </p>
                  </div>

                  <ChevronRight
                    size={16}
                    className="text-[#7B8794]"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Prescriptions */}
          <section className="bg-[#FFFFFF] border border-white/[0.07] rounded-2xl p-5">
            <SectionHeader
              icon={Pill}
              title="Prescriptions"
              subtitle="Current medication records"
            />

            <div className="space-y-3">
              {prescriptions.map((prescription) => (
                <div
                  key={prescription.medication}
                  className="rounded-xl bg-white/[0.025] border border-white/[0.05] p-3.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-[#334155]">
                        {prescription.medication}
                      </p>

                      <p className="text-xs text-[#526174] mt-1">
                        {prescription.dosage} •{' '}
                        {prescription.frequency}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-1 rounded-md ${
                        prescription.status === 'Active'
                          ? 'bg-[#16A34A]/10 text-[#16A34A]'
                          : 'bg-amber-400/10 text-[#526174]'
                      }`}
                    >
                      {prescription.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Clinical notes */}
          <section className="bg-[#FFFFFF] border border-white/[0.07] rounded-2xl p-5">
            <SectionHeader
              icon={FileText}
              title="Clinical Notes"
              subtitle="Recent physician observations"
            />

            <div className="rounded-xl bg-white/[0.025] border border-white/[0.05] p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-[#7B8794]">
                  Latest Note
                </span>

                <span className="text-[10px] text-[#7B8794]">
                  18 Mar 2026
                </span>
              </div>

              <p className="text-sm text-[#334155] leading-relaxed mt-3">
                Patient reports intermittent shortness of
                breath during moderate exertion. No acute
                symptoms at time of consultation. Previous
                imaging available for comparison.
              </p>

              <button
                type="button"
                className="flex items-center gap-1.5 text-xs text-[#2563EB] mt-4 hover:text-[#2563EB]"
              >
                View all clinical notes
                <ChevronRight size={13} />
              </button>
            </div>
          </section>

          {/* Security / RAG */}
          <section className="bg-cyan-400/[0.04] border border-cyan-400/10 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-cyan-400/10 flex items-center justify-center shrink-0">
                <ShieldCheck
                  size={17}
                  className="text-[#2563EB]"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-cyan-200">
                  Patient-centric RAG ready
                </p>

                <p className="text-xs text-[#526174] leading-relaxed mt-1.5">
                  Historical records can be retrieved during
                  screening to provide relevant clinical
                  context and evidence traceability.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Timeline */}
      <section className="bg-[#FFFFFF] border border-white/[0.07] rounded-2xl p-5">
        <SectionHeader
          icon={CalendarDays}
          title="Patient Timeline"
          subtitle="Chronological record of recent clinical activity"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {timeline.map((event) => {
            const Icon = event.icon

            return (
              <div
                key={`${event.date}-${event.time}-${event.title}`}
                className="relative rounded-xl bg-white/[0.025] border border-white/[0.05] p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-cyan-400/10 flex items-center justify-center">
                    <Icon
                      size={15}
                      className="text-[#2563EB]"
                    />
                  </div>

                  <span className="text-[10px] text-[#7B8794]">
                    {event.time}
                  </span>
                </div>

                <p className="text-[10px] uppercase tracking-wider text-[#7B8794] mt-4">
                  {event.date}
                </p>

                <p className="text-sm font-medium text-[#334155] mt-2">
                  {event.title}
                </p>

                <p className="text-xs text-[#7B8794] leading-relaxed mt-1.5">
                  {event.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}