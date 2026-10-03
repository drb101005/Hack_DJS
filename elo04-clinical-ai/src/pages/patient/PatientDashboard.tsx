import {
  Activity,
  CalendarDays,
  ChevronRight,
  FileText,
  Heart,
  Pill,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react'
import { mockPatients } from '../../data/patients'

const patient = mockPatients[0]

const records = [
  ['Chest X-Ray', '12 Mar 2026', 'Completed'],
  ['ECG', '10 Mar 2026', 'Completed'],
  ['Blood Panel', '04 Feb 2026', 'Completed'],
  ['Clinical Follow-up', '18 Mar 2026', 'Reviewed'],
]

const timeline = [
  ['Today', 'Clinical record accessed', 'Dr. Sarah Mitchell'],
  ['18 Mar 2026', 'Respiratory follow-up', 'Clinical consultation'],
  ['12 Mar 2026', 'Chest X-Ray completed', 'Imaging'],
  ['10 Mar 2026', 'ECG investigation', 'Cardiology'],
]

interface PatientDashboardProps {
  onLogout: () => void
}

export default function PatientDashboard({
  onLogout,
}: PatientDashboardProps) {
  return (
    <div className="min-h-screen bg-[#070b14] text-white">
      <header className="border-b border-white/[0.06] bg-[#0a0f1a]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-cyan-400/10 flex items-center justify-center">
              <Activity size={18} className="text-cyan-400" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                MedAI
              </p>
              <p className="text-[10px] text-gray-600">
                Patient Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-gray-500">
              {patient.name}
            </span>

            <div className="h-8 w-8 rounded-lg bg-cyan-400/10 flex items-center justify-center">
              <span className="text-xs font-semibold text-cyan-300">
                JA
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
        <section className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-5">
            <div className="h-20 w-20 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
              <span className="text-2xl font-semibold text-cyan-300">
                JA
              </span>
            </div>

            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400">
                Health Summary
              </p>

              <h1 className="text-2xl font-semibold mt-1">
                Welcome, {patient.name.split(' ')[0]}
              </h1>

              <p className="text-sm text-gray-500 mt-2">
                Your medical records, investigations and care timeline.
              </p>
            </div>

            <div className="px-3 py-2 rounded-xl bg-amber-400/10 border border-amber-400/10">
              <span className="text-xs text-amber-300">
                Monitoring
              </span>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            ['72', 'Heart Rate', Heart, 'bpm'],
            ['98%', 'Oxygen Saturation', Activity, 'SpO₂'],
            ['14', 'Documents', FileText, 'records'],
            ['8', 'Investigations', Stethoscope, 'total'],
          ].map(([value, label, Icon, unit]) => {
            const IconComponent = Icon as typeof Activity

            return (
              <div
                key={String(label)}
                className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-4"
              >
                <IconComponent
                  size={17}
                  className="text-cyan-400"
                />

                <p className="text-2xl font-semibold mt-4">
                  {value as string}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {label as string}
                </p>

                <p className="text-[10px] text-gray-700 mt-1">
                  {unit as string}
                </p>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.8fr] gap-5">
          <section className="bg-[#0d1320] border border-white/[0.07] rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-cyan-400" />
                <h2 className="text-sm font-semibold">
                  My Records
                </h2>
              </div>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {records.map(([name, date, status]) => (
                <div
                  key={name}
                  className="px-5 py-4 flex items-center gap-4 hover:bg-white/[0.02]"
                >
                  <div className="h-9 w-9 rounded-lg bg-white/[0.035] flex items-center justify-center">
                    <FileText
                      size={15}
                      className="text-cyan-400"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-gray-300">
                      {name}
                    </p>
                    <p className="text-[10px] text-gray-700 mt-1">
                      {date}
                    </p>
                  </div>

                  <span className="text-[10px] text-emerald-400">
                    {status}
                  </span>

                  <ChevronRight
                    size={15}
                    className="text-gray-700"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-5">
            <div className="flex items-center gap-2">
              <Pill size={16} className="text-violet-400" />
              <h2 className="text-sm font-semibold">
                Medications
              </h2>
            </div>

            <div className="space-y-3 mt-5">
              {[
                ['Lisinopril', '10 mg • Once daily'],
                ['Atorvastatin', '20 mg • Once daily'],
                ['Salbutamol', '100 mcg • As required'],
              ].map(([name, dosage]) => (
                <div
                  key={name}
                  className="rounded-xl bg-white/[0.025] border border-white/[0.05] p-3"
                >
                  <p className="text-xs text-gray-300">
                    {name}
                  </p>
                  <p className="text-[10px] text-gray-600 mt-1">
                    {dosage}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <CalendarDays
              size={16}
              className="text-cyan-400"
            />
            <h2 className="text-sm font-semibold">
              Health Timeline
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {timeline.map(([date, title, type]) => (
              <div
                key={`${date}-${title}`}
                className="rounded-xl bg-white/[0.025] border border-white/[0.05] p-4"
              >
                <p className="text-[10px] text-gray-700">
                  {date}
                </p>

                <p className="text-sm text-gray-300 mt-2">
                  {title}
                </p>

                <p className="text-[10px] text-gray-600 mt-1">
                  {type}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-cyan-400/[0.035] border border-cyan-400/10 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck
              size={18}
              className="text-cyan-400 mt-0.5"
            />

            <div>
              <p className="text-sm text-cyan-200 font-medium">
                Your records are traceable
              </p>

              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Investigation records and AI-assisted screening outputs in
                this prototype are linked to their source documents for
                demonstration purposes.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
