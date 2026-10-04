import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BrainCircuit,
  Clock3,
  DatabaseZap,
  FileCheck2,
  Users,
  Zap,
} from 'lucide-react'

const stats = [
  {
    label: 'Active Patients',
    value: '128',
    change: '+8.4%',
    icon: Users,
  },
  {
    label: 'Active Cases',
    value: '24',
    change: '+3 today',
    icon: Activity,
  },
  {
    label: 'Awaiting Review',
    value: '7',
    change: '2 high priority',
    icon: AlertTriangle,
  },
  {
    label: 'AI Models Active',
    value: '6',
    change: 'All systems operational',
    icon: BrainCircuit,
  },
]

const cases = [
  {
    id: 'CASE-2048',
    patient: 'Ram Sharma',
    age: 58,
    modality: 'Chest X-Ray',
    status: 'Awaiting Review',
    confidence: '91%',
    time: '8 min ago',
    priority: 'High',
  },
  {
    id: 'CASE-2047',
    patient: 'Geeta Walkar',
    age: 44,
    modality: 'Brain MRI',
    status: 'Processing',
    confidence: '87%',
    time: '14 min ago',
    priority: 'Normal',
  },
  {
    id: 'CASE-2046',
    patient: 'Arjun Patil',
    age: 67,
    modality: 'CT + Lab',
    status: 'Completed',
    confidence: '94%',
    time: '32 min ago',
    priority: 'Normal',
  },
  {
    id: 'CASE-2045',
    patient: 'Priya Deshmukh',
    age: 36,
    modality: 'ECG',
    status: 'Completed',
    confidence: '96%',
    time: '1 hr ago',
    priority: 'Normal',
  },
]

const models = [
  {
    name: 'Chest X-Ray Screening',
    version: 'v2.4.1',
    status: 'Active',
    memory: '1.8 GB',
    latency: '142 ms',
  },
  {
    name: 'Brain MRI Analyzer',
    version: 'v3.1.0',
    status: 'Active',
    memory: '3.2 GB',
    latency: '284 ms',
  },
  {
    name: 'ECG Signal Model',
    version: 'v1.8.3',
    status: 'Active',
    memory: '920 MB',
    latency: '86 ms',
  },
  {
    name: 'Clinical NLP Engine',
    version: 'v4.0.2',
    status: 'Idle',
    memory: '640 MB',
    latency: '—',
  },
]

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'Awaiting Review':
      'bg-amber-400/10 text-[#526174] border-amber-400/10',
    Processing:
      'bg-cyan-400/10 text-[#2563EB] border-cyan-400/10',
    Completed:
      'bg-[#16A34A]/10 text-[#16A34A] border-emerald-400/10',
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-md border text-[11px] ${
        styles[status] || 'bg-white/5 text-[#526174] border-[#E2E8F0]'
      }`}
    >
      {status}
    </span>
  )
}

export default function Overview() {
  return (
    <div className="space-y-7">
      {/* Page heading */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#2563EB] mb-2">
            Clinical Overview
          </p>

          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#172033]">
            Good morning, Dr. Ajay Lad
          </h1>

          <p className="text-sm text-[#526174] mt-2">
            Here's the current state of your clinical screening workspace.
          </p>
        </div>

        <button className="inline-flex items-center justify-center gap-2 bg-cyan-400 text-black font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-cyan-300 transition">
          <Zap size={16} />
          Start New Screening
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.label}
              className="bg-[#FFFFFF] border border-white/[0.07] rounded-2xl p-5 hover:border-[#E2E8F0] transition"
            >
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-xl bg-cyan-400/10 flex items-center justify-center">
                  <Icon
                    size={19}
                    className="text-[#2563EB]"
                  />
                </div>

                <ArrowUpRight
                  size={16}
                  className="text-[#7B8794]"
                />
              </div>

              <p className="text-3xl font-semibold text-[#172033] mt-5">
                {stat.value}
              </p>

              <p className="text-sm text-[#526174] mt-1">
                {stat.label}
              </p>

              <p className="text-[11px] text-[#2563EB]/70 mt-3">
                {stat.change}
              </p>
            </div>
          )
        })}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.8fr)] gap-5">
        {/* Recent cases */}
        <section className="bg-[#FFFFFF] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.07] flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-[#172033]">
                Recent Screening Cases
              </h2>

              <p className="text-xs text-[#7B8794] mt-1">
                Latest multimodal clinical investigations
              </p>
            </div>

            <button className="text-xs text-[#2563EB] hover:text-[#2563EB]">
              View all
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wider text-[#7B8794] border-b border-white/[0.05]">
                  <th className="px-5 py-3 font-medium">
                    Case
                  </th>
                  <th className="px-5 py-3 font-medium">
                    Patient
                  </th>
                  <th className="px-5 py-3 font-medium">
                    Modality
                  </th>
                  <th className="px-5 py-3 font-medium">
                    Status
                  </th>
                  <th className="px-5 py-3 font-medium">
                    Confidence
                  </th>
                  <th className="px-5 py-3 font-medium">
                    Time
                  </th>
                </tr>
              </thead>

              <tbody>
                {cases.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-white/[0.04] last:border-0 hover:bg-[#F8FAFC] transition"
                  >
                    <td className="px-5 py-4">
                      <span className="text-xs font-medium text-[#2563EB]">
                        {item.id}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm text-[#334155]">
                          {item.patient}
                        </p>
                        <p className="text-[10px] text-[#7B8794]">
                          {item.age} years
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-xs text-[#526174]">
                        {item.modality}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-xs text-[#334155]">
                        {item.confidence}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-[#7B8794] whitespace-nowrap">
                        <Clock3 size={12} />
                        {item.time}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* System health */}
        <section className="bg-[#FFFFFF] border border-white/[0.07] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-[#172033]">
                AI System Health
              </h2>

              <p className="text-xs text-[#7B8794] mt-1">
                Live infrastructure simulation
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#16A34A] animate-pulse" />
              <span className="text-xs text-[#16A34A]">
                Operational
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-[#526174]">
                  CPU Utilization
                </span>
                <span className="text-[#334155]">
                  42%
                </span>
              </div>

              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[42%] bg-cyan-400 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-[#526174]">
                  Memory
                </span>
                <span className="text-[#334155]">
                  68%
                </span>
              </div>

              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[68%] bg-blue-400 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-[#526174]">
                  GPU Memory
                </span>
                <span className="text-[#334155]">
                  51%
                </span>
              </div>

              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[51%] bg-violet-400 rounded-full" />
              </div>
            </div>
          </div>

          <div className="mt-7 pt-5 border-t border-white/[0.06] grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/[0.025] p-3">
              <p className="text-[10px] uppercase tracking-wider text-[#7B8794]">
                Avg. Latency
              </p>
              <p className="text-lg font-semibold text-[#172033] mt-1">
                164ms
              </p>
            </div>

            <div className="rounded-xl bg-white/[0.025] p-3">
              <p className="text-[10px] uppercase tracking-wider text-[#7B8794]">
                Queue
              </p>
              <p className="text-lg font-semibold text-[#172033] mt-1">
                3
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Model registry */}
      <section className="bg-[#FFFFFF] border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.07] flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-violet-400/10 flex items-center justify-center">
            <DatabaseZap
              size={17}
              className="text-violet-400"
            />
          </div>

          <div>
            <h2 className="font-semibold text-[#172033]">
              AI Model Registry
            </h2>

            <p className="text-xs text-[#7B8794] mt-0.5">
              Currently loaded clinical models
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          {models.map((model) => (
            <div
              key={model.name}
              className="p-5 border-b md:border-r border-white/[0.05] last:border-r-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      model.status === 'Active'
                        ? 'bg-[#16A34A]'
                        : 'bg-gray-600'
                    }`}
                  />

                  <span className="text-[11px] text-[#526174]">
                    {model.status}
                  </span>
                </div>

                <span className="text-[10px] text-[#7B8794]">
                  {model.version}
                </span>
              </div>

              <h3 className="text-sm font-medium text-[#334155] mt-4">
                {model.name}
              </h3>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div>
                  <p className="text-[10px] text-[#7B8794]">
                    Memory
                  </p>
                  <p className="text-xs text-[#526174] mt-1">
                    {model.memory}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-[#7B8794]">
                    Latency
                  </p>
                  <p className="text-xs text-[#526174] mt-1">
                    {model.latency}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#FFFFFF] border border-white/[0.07] rounded-2xl p-5">
          <FileCheck2
            size={19}
            className="text-[#16A34A]"
          />

          <p className="text-2xl font-semibold text-[#172033] mt-4">
            1,284
          </p>

          <p className="text-xs text-[#526174] mt-1">
            Documents processed this month
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-white/[0.07] rounded-2xl p-5">
          <BrainCircuit
            size={19}
            className="text-violet-400"
          />

          <p className="text-2xl font-semibold text-[#172033] mt-4">
            98.2%
          </p>

          <p className="text-xs text-[#526174] mt-1">
            Successful AI inference rate
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-white/[0.07] rounded-2xl p-5">
          <DatabaseZap
            size={19}
            className="text-blue-400"
          />

          <p className="text-2xl font-semibold text-[#172033] mt-4">
            4,821
          </p>

          <p className="text-xs text-[#526174] mt-1">
            RAG evidence retrievals
          </p>
        </div>
      </div>
    </div>
  )
}