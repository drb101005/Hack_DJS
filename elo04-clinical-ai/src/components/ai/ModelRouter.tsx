import {
  Activity,
  Brain,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Database,
  FileText,
  HeartPulse,
  Image,
  Network,
  ScanSearch,
  Server,
  Sparkles,
  Timer,
} from 'lucide-react'

interface ModelRouterProps {
  running?: boolean
}

const pipeline = [
  {
    title: 'Input Gateway',
    subtitle: 'Multimodal payload received',
    icon: Network,
    status: 'Complete',
  },
  {
    title: 'Modality Detection',
    subtitle: 'MRI / X-Ray / ECG / PDF classification',
    icon: ScanSearch,
    status: 'Complete',
  },
  {
    title: 'Model Router',
    subtitle: 'Specialized model selection',
    icon: Brain,
    status: 'Active',
  },
  {
    title: 'Parallel Inference',
    subtitle: 'Clinical models execute concurrently',
    icon: Cpu,
    status: 'Running',
  },
  {
    title: 'RAG Retrieval',
    subtitle: 'Patient-specific evidence retrieval',
    icon: Database,
    status: 'Queued',
  },
  {
    title: 'Evidence Fusion',
    subtitle: 'AI findings + historical evidence',
    icon: Sparkles,
    status: 'Queued',
  },
]

const routedModels = [
  {
    name: 'Chest X-Ray Screening',
    version: 'v2.4.1',
    modality: 'X-Ray',
    latency: '142 ms',
    memory: '1.8 GB',
    confidence: 94,
    icon: Image,
  },
  {
    name: 'Brain MRI Analyzer',
    version: 'v3.1.0',
    modality: 'MRI',
    latency: '284 ms',
    memory: '3.2 GB',
    confidence: 91,
    icon: Brain,
  },
  {
    name: 'ECG Signal Model',
    version: 'v1.8.3',
    modality: 'ECG',
    latency: '86 ms',
    memory: '920 MB',
    confidence: 97,
    icon: HeartPulse,
  },
  {
    name: 'Clinical NLP Engine',
    version: 'v4.0.2',
    modality: 'Clinical Text',
    latency: '118 ms',
    memory: '640 MB',
    confidence: 89,
    icon: FileText,
  },
]

export default function ModelRouter({
  running = true,
}: ModelRouterProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-[#0b1120] p-5">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-400">
              AI Orchestration
            </p>

            <h2 className="mt-2 text-xl font-semibold text-white">
              Multimodal Model Router
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Dynamic routing across specialized clinical AI models.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
            <span
              className={`h-2 w-2 rounded-full ${
                running
                  ? 'animate-pulse bg-emerald-400'
                  : 'bg-gray-500'
              }`}
            />

            <span className="text-xs font-medium text-emerald-300">
              {running ? 'ORCHESTRATOR ACTIVE' : 'IDLE'}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-[900px] items-center">
            {pipeline.map((step, index) => {
              const Icon = step.icon
              const active = step.status === 'Active'
              const complete = step.status === 'Complete'
              const runningStep = step.status === 'Running'

              return (
                <div
                  key={step.title}
                  className="flex flex-1 items-center"
                >
                  <div
                    className={`min-w-[135px] rounded-2xl border p-4 ${
                      active || runningStep
                        ? 'border-cyan-500/40 bg-cyan-500/10'
                        : complete
                          ? 'border-emerald-500/20 bg-emerald-500/5'
                          : 'border-white/10 bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon
                        className={`h-5 w-5 ${
                          active || runningStep
                            ? 'text-cyan-400'
                            : complete
                              ? 'text-emerald-400'
                              : 'text-gray-500'
                        }`}
                      />

                      {complete && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      )}
                    </div>

                    <p className="mt-3 text-xs font-semibold text-white">
                      {step.title}
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-gray-500">
                      {step.subtitle}
                    </p>

                    <div className="mt-3 text-[10px] uppercase tracking-wider text-gray-600">
                      {step.status}
                    </div>
                  </div>

                  {index < pipeline.length - 1 && (
                    <ChevronRight className="mx-2 h-4 w-4 shrink-0 text-gray-700" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {routedModels.map((model) => {
          const Icon = model.icon

          return (
            <div
              key={model.name}
              className="rounded-2xl border border-white/10 bg-[#0b1120] p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-2.5">
                    <Icon className="h-5 w-5 text-cyan-400" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {model.name}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      {model.version} · {model.modality}
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                  LOADED
                </span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <Metric
                  icon={Timer}
                  label="Latency"
                  value={model.latency}
                />

                <Metric
                  icon={Server}
                  label="Memory"
                  value={model.memory}
                />

                <Metric
                  icon={Activity}
                  label="Confidence"
                  value={`${model.confidence}%`}
                />
              </div>

              <div className="mt-4">
                <div className="mb-2 flex justify-between text-[10px]">
                  <span className="text-gray-500">
                    Inference confidence
                  </span>

                  <span className="text-cyan-300">
                    {model.confidence}%
                  </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-cyan-400"
                    style={{
                      width: `${model.confidence}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </section>
    </div>
  )
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <Icon className="h-3.5 w-3.5 text-gray-600" />

      <p className="mt-2 text-[10px] uppercase tracking-wider text-gray-600">
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold text-gray-300">
        {value}
      </p>
    </div>
  )
}