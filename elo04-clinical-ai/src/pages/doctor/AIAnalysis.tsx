import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Gauge,
  Loader2,
  MemoryStick,
  Network,
  Play,
  Server,
  Sparkles,
  Timer,
} from 'lucide-react'
import type { Patient } from '../../types'

interface AIAnalysisProps {
  patient: Patient | null
  caseId: string | null
  onContinue: () => void
}

const models = [
  {
    id: 'vision-xray',
    name: 'Chest X-Ray Screening',
    version: 'v2.4.1',
    modality: 'X-Ray',
    latency: 142,
    memory: '1.8 GB',
    confidence: 94,
  },
  {
    id: 'brain-mri',
    name: 'Brain MRI Analyzer',
    version: 'v3.1.0',
    modality: 'MRI',
    latency: 284,
    memory: '3.2 GB',
    confidence: 91,
  },
  {
    id: 'ecg-signal',
    name: 'ECG Signal Model',
    version: 'v1.8.3',
    modality: 'ECG',
    latency: 86,
    memory: '920 MB',
    confidence: 97,
  },
  {
    id: 'clinical-nlp',
    name: 'Clinical NLP Engine',
    version: 'v4.0.2',
    modality: 'Clinical Text',
    latency: 118,
    memory: '640 MB',
    confidence: 89,
  },
]

const findings = [
  {
    title: 'Cardiopulmonary screening signal',
    description:
      'Demo model identified a pattern requiring clinical review against prior records.',
    confidence: 92,
    severity: 'Medium',
    model: 'Chest X-Ray Screening v2.4.1',
  },
  {
    title: 'No acute ECG pattern detected',
    description:
      'Simulated waveform analysis did not identify an acute pattern in the demo input.',
    confidence: 96,
    severity: 'Low',
    model: 'ECG Signal Model v1.8.3',
  },
  {
    title: 'Historical comparison recommended',
    description:
      'Prior patient imaging is available and should be compared during evidence retrieval.',
    confidence: 88,
    severity: 'Medium',
    model: 'Clinical NLP Engine v4.0.2',
  },
]

export default function AIAnalysis({
  patient,
  caseId,
  onContinue,
}: AIAnalysisProps) {
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [complete, setComplete] = useState(false)

  const activeModels = useMemo(
    () => models.filter((model) => model.id !== 'brain-mri'),
    [],
  )

  useEffect(() => {
    if (!running) return

    const interval = window.setInterval(() => {
      setProgress((current) => {
        const next = Math.min(current + 10, 100)

        if (next === 100) {
          window.clearInterval(interval)
          window.setTimeout(() => {
            setRunning(false)
            setComplete(true)
          }, 400)
        }

        return next
      })
    }, 180)

    return () => window.clearInterval(interval)
  }, [running])

  const startAnalysis = () => {
    setProgress(0)
    setComplete(false)
    setRunning(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400">
            AI Orchestration
          </p>
          <h1 className="text-2xl font-semibold text-white mt-1">
            AI Analysis
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Multimodal model routing, inference and simulated findings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-xl bg-white/[0.025] border border-white/[0.06]">
            <p className="text-[9px] uppercase tracking-wider text-gray-700">
              Case
            </p>
            <p className="text-xs text-cyan-300 font-mono mt-1">
              {caseId ?? 'NO CASE'}
            </p>
          </div>

          <div className="px-3 py-2 rounded-xl bg-white/[0.025] border border-white/[0.06]">
            <p className="text-[9px] uppercase tracking-wider text-gray-700">
              Patient
            </p>
            <p className="text-xs text-gray-300 mt-1">
              {patient?.name ?? 'Unknown'}
            </p>
          </div>
        </div>
      </div>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          ['Models Active', '3', Network],
          ['Avg Latency', '148 ms', Timer],
          ['GPU Memory', '51%', MemoryStick],
          ['Inference', complete ? 'Complete' : 'Ready', CheckCircle2],
        ].map(([label, value, Icon]) => {
          const IconComponent = Icon as typeof Activity

          return (
            <div
              key={String(label)}
              className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-4"
            >
              <IconComponent size={17} className="text-cyan-400" />
              <p className="text-xl font-semibold text-white mt-4">
                {value as string}
              </p>
              <p className="text-[10px] text-gray-600 mt-1">
                {label as string}
              </p>
            </div>
          )
        })}
      </section>

      <section className="bg-[#0d1320] border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Server size={16} className="text-cyan-400" />
              <h2 className="text-sm font-semibold text-white">
                Model Router
              </h2>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Input modality determines the specialized inference path.
            </p>
          </div>

          <button
            type="button"
            onClick={startAnalysis}
            disabled={running}
            className="inline-flex items-center justify-center gap-2 bg-cyan-400 text-black font-semibold text-xs px-4 py-2.5 rounded-xl hover:bg-cyan-300 transition disabled:opacity-40"
          >
            {running ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Running Models
              </>
            ) : (
              <>
                <Play size={14} />
                {complete ? 'Run Again' : 'Run AI Analysis'}
              </>
            )}
          </button>
        </div>

        {running && (
          <div className="px-5 py-4 bg-cyan-400/[0.025] border-b border-cyan-400/10">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-cyan-300">
                Orchestrating multimodal pipeline...
              </span>
              <span className="text-gray-500">{progress}%</span>
            </div>

            <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-cyan-400 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="divide-y divide-white/[0.04]">
          {models.map((model) => {
            const isActive = activeModels.some(
              (item) => item.id === model.id,
            )

            return (
              <div
                key={model.id}
                className="p-4 flex flex-col lg:flex-row lg:items-center gap-4"
              >
                <div className="h-10 w-10 rounded-xl bg-cyan-400/10 flex items-center justify-center shrink-0">
                  <Cpu size={17} className="text-cyan-400" />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm text-gray-200">
                      {model.name}
                    </p>

                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-gray-600">
                      {model.version}
                    </span>

                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-emerald-400/10 text-emerald-400'
                          : 'bg-gray-400/10 text-gray-600'
                      }`}
                    >
                      {isActive ? 'ROUTED' : 'IDLE'}
                    </span>
                  </div>

                  <p className="text-[10px] text-gray-600 mt-1">
                    Specialized path • {model.modality}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-5 text-right">
                  <div>
                    <p className="text-[9px] uppercase text-gray-700">
                      Latency
                    </p>
                    <p className="text-xs text-gray-300 mt-1">
                      {model.latency} ms
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] uppercase text-gray-700">
                      Memory
                    </p>
                    <p className="text-xs text-gray-300 mt-1">
                      {model.memory}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] uppercase text-gray-700">
                      Confidence
                    </p>
                    <p className="text-xs text-cyan-300 mt-1">
                      {model.confidence}%
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
        <div className="bg-[#0d1320] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-violet-400" />
              <h2 className="text-sm font-semibold text-white">
                Simulated Findings
              </h2>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Demo outputs requiring physician review.
            </p>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {findings.map((finding) => (
              <div key={finding.title} className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-200">
                      {finding.title}
                    </p>

                    <p className="text-xs text-gray-500 leading-relaxed mt-1.5 max-w-2xl">
                      {finding.description}
                    </p>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-1 rounded-md shrink-0 ${
                      finding.severity === 'Medium'
                        ? 'bg-amber-400/10 text-amber-300'
                        : 'bg-emerald-400/10 text-emerald-300'
                    }`}
                  >
                    {finding.severity}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 mt-4">
                  <span className="text-[10px] text-cyan-400">
                    Confidence {finding.confidence}%
                  </span>
                  <span className="text-[10px] text-gray-600">
                    {finding.model}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-5">
            <div className="flex items-center gap-2">
              <Gauge size={16} className="text-amber-400" />
              <h2 className="text-sm font-semibold text-white">
                Runtime Resources
              </h2>
            </div>

            <div className="space-y-4 mt-5">
              {[
                ['CPU', 42],
                ['Memory', 68],
                ['GPU', 51],
              ].map(([label, value]) => (
                <div key={String(label)}>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-gray-600">
                      {label as string}
                    </span>
                    <span className="text-gray-400">
                      {value}%
                    </span>
                  </div>

                  <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full bg-cyan-400 rounded-full"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-violet-400/[0.035] border border-violet-400/10 rounded-2xl p-5">
            <p className="text-xs font-medium text-violet-200">
              Explainability trace
            </p>

            <p className="text-[11px] text-gray-600 leading-relaxed mt-2">
              Each simulated finding records its originating model,
              confidence and downstream evidence lookup.
            </p>
          </div>
        </div>
      </section>

      {complete && (
        <section className="bg-emerald-400/[0.035] border border-emerald-400/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <CheckCircle2 size={20} className="text-emerald-400" />

          <div className="flex-1">
            <p className="text-sm text-emerald-300">
              AI inference completed
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Continue to patient-centric retrieval and evidence fusion.
            </p>
          </div>

          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center justify-center gap-2 bg-cyan-400 text-black font-semibold text-xs px-4 py-2.5 rounded-xl hover:bg-cyan-300 transition"
          >
            RAG & Evidence
            <ArrowRight size={14} />
          </button>
        </section>
      )}
    </div>
  )
}
