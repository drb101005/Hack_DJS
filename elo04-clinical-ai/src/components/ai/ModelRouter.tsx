import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Brain,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  Cpu,
  Database,
  FileText,
  HeartPulse,
  Image,
  Loader2,
  MemoryStick,
  Network,
  Pause,
  Play,
  RotateCcw,
  ScanSearch,
  Server,
  ShieldCheck,
  Sparkles,
  Timer,
  type LucideIcon,
} from 'lucide-react'

type StageStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED'
type RunStatus = 'idle' | 'running' | 'paused' | 'completed'

interface ModelRouterProps {
  modalities: string[]
  caseId: string | null
  onContinue: () => void
  onAnalysisStarted: () => void
  onAnalysisCompleted: () => void
}

interface RoutedModel {
  id: string
  name: string
  version: string
  modality: string
  sourceModalities: string[]
  memoryGb: number
  latencyMs: number
  icon: LucideIcon
}

const availableModels: RoutedModel[] = [
  { id: 'xray', name: 'Chest X-Ray Screening', version: 'v2.4.1', modality: 'Chest X-Ray', sourceModalities: ['X-Ray', 'Chest X-Ray'], memoryGb: 1.8, latencyMs: 142, icon: Image },
  { id: 'ecg', name: 'ECG Signal Model', version: 'v1.8.3', modality: 'ECG', sourceModalities: ['ECG'], memoryGb: 0.92, latencyMs: 86, icon: HeartPulse },
  { id: 'clinical-text', name: 'Clinical NLP Engine', version: 'v4.0.2', modality: 'PDF / Clinical Text', sourceModalities: ['PDF', 'Clinical Text', 'Lab Report', 'Clinical Note'], memoryGb: 0.64, latencyMs: 118, icon: FileText },
  { id: 'mri', name: 'Brain MRI Analyzer', version: 'v3.1.0', modality: 'MRI', sourceModalities: ['MRI'], memoryGb: 3.2, latencyMs: 284, icon: Brain },
  { id: 'ct', name: 'Chest CT Analyzer', version: 'v2.2.0', modality: 'CT', sourceModalities: ['CT'], memoryGb: 2.6, latencyMs: 226, icon: ScanSearch },
]

const stageDefinitions: { title: string; subtitle: string; icon: LucideIcon; duration: (count: number) => number }[] = [
  { title: 'Input Gateway', subtitle: 'Case payload received', icon: Network, duration: () => 700 },
  { title: 'Modality Detection', subtitle: 'Uploaded inputs classified', icon: ScanSearch, duration: () => 800 },
  { title: 'Model Router', subtitle: 'Specialized models selected', icon: Brain, duration: () => 700 },
  { title: 'Model Loading', subtitle: 'Sequential model paging', icon: Server, duration: (n) => n * 850 },
  { title: 'Inference', subtitle: 'Simulated model execution', icon: Cpu, duration: (n) => n * 1450 },
  { title: 'Memory Release', subtitle: 'Model weights purged', icon: MemoryStick, duration: (n) => n * 600 },
  { title: 'RAG Retrieval', subtitle: 'Patient evidence retrieved', icon: Database, duration: () => 1100 },
  { title: 'Evidence Fusion', subtitle: 'Signals and evidence combined', icon: Sparkles, duration: () => 900 },
  { title: 'Clinical Report', subtitle: 'Review-ready summary prepared', icon: FileText, duration: () => 900 },
]

const findings = [
  { title: 'Cardiopulmonary screening signal', confidence: 92, severity: 'Moderate', detail: 'A simulated screening signal is present. Review source imaging and correlate with the clinical picture.', match: ['xray', 'ct'] },
  { title: 'No acute ECG pattern detected', confidence: 96, severity: 'Low', detail: 'No acute pattern was detected in this deterministic demo waveform result.', match: ['ecg'] },
  { title: 'Historical comparison recommended', confidence: 88, severity: 'Information', detail: 'Compare with prior studies and relevant clinical notes during physician review.', match: ['clinical-text', 'mri', 'ct', 'xray'] },
]

const lifecycle = ['UNLOADED', 'LOADING', 'LOADED', 'INFERENCE', 'PURGING', 'UNLOADED']

function formatClock(timestamp: number | null, offsetMs = 0) {
  if (!timestamp) return '—'
  return new Date(timestamp + offsetMs).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function getStatus(index: number, elapsed: number, starts: number[], durations: number[], runStatus: RunStatus): StageStatus {
  if (runStatus === 'idle') return 'QUEUED'
  if (elapsed >= starts[index] + durations[index]) return 'COMPLETED'
  if (elapsed >= starts[index]) return 'RUNNING'
  return 'QUEUED'
}

export default function ModelRouter({ modalities, caseId, onContinue, onAnalysisStarted, onAnalysisCompleted }: ModelRouterProps) {
  const normalizedModalities = useMemo(() => modalities.map((value) => value.toLowerCase().replace(/[^a-z]/g, '')), [modalities])
  const routedModels = useMemo(() => availableModels.filter((model) => model.sourceModalities.some((source) => normalizedModalities.includes(source.toLowerCase().replace(/[^a-z]/g, '')))), [normalizedModalities])
  const selectedModels = routedModels.length ? routedModels : [availableModels[2]]
  const durations = useMemo(() => stageDefinitions.map((stage) => stage.duration(selectedModels.length)), [selectedModels.length])
  const starts = useMemo(() => durations.map((_, i) => durations.slice(0, i).reduce((sum, duration) => sum + duration, 0)), [durations])
  const totalDuration = durations.reduce((sum, duration) => sum + duration, 0)
  const [runStatus, setRunStatus] = useState<RunStatus>('idle')
  const [elapsed, setElapsed] = useState(0)
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [traceVisible, setTraceVisible] = useState(false)
  const traceRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (runStatus !== 'running') return
    const timer = window.setInterval(() => {
      setElapsed((current) => {
        return Math.min(totalDuration, current + 200)
      })
    }, 200)
    return () => window.clearInterval(timer)
  }, [runStatus, totalDuration])

  useEffect(() => {
    if (runStatus === 'running' && elapsed >= totalDuration) {
      setRunStatus('completed')
      onAnalysisCompleted()
    }
  }, [elapsed, onAnalysisCompleted, runStatus, totalDuration])

  const begin = (restart = false) => {
    if (restart) setElapsed(0)
    setStartedAt(Date.now())
    setElapsed(0)
    setRunStatus('running')
    onAnalysisStarted()
  }

  const revealStart = starts[4] + durations[4]
  const findingsElapsed = Math.max(0, elapsed - revealStart)
  const visibleFindings = runStatus === 'idle' || elapsed < revealStart
    ? []
    : findings.filter((finding) => finding.match.some((modelId) => selectedModels.some((model) => model.id === modelId)))
      .slice(0, Math.min(findings.length, 1 + Math.floor(findingsElapsed / 650)))

  const now = (min: number, max: number, speed: number, offset = 0) => {
    const wave = Math.sin(elapsed / speed + offset)
    return min + (max - min) * (0.5 + wave * 0.18)
  }
  const cpu = Math.round(now(28, 72, 900, 0))
  const ram = now(2.2, 3.2, 1200, 1).toFixed(1)
  const gpu = Math.round(now(35, 88, 1050, 2))
  const vram = now(1.2, 3.2, 1450, 3).toFixed(1)
  const activeIndex = starts.findIndex((start, i) => elapsed >= start && elapsed < start + durations[i])
  const activeModelIndex = activeIndex === 3
    ? Math.min(selectedModels.length - 1, Math.floor((elapsed - starts[3]) / 850))
    : activeIndex === 4
      ? Math.min(selectedModels.length - 1, Math.floor((elapsed - starts[4]) / 1450))
      : activeIndex === 5
        ? Math.min(selectedModels.length - 1, Math.floor((elapsed - starts[5]) / 600))
        : -1
  const queueDepth = runStatus === 'completed' || activeIndex >= 6
    ? 0
    : activeIndex >= 3 && activeIndex <= 5
      ? Math.max(0, selectedModels.length - activeModelIndex - (activeIndex === 5 ? 1 : 0))
      : selectedModels.length
  const telemetryModelIndex = activeModelIndex < 0 ? 0 : activeModelIndex
  const currentModelMemory = runStatus === 'completed' || activeIndex >= 6
    ? '0.0 GB'
    : `${selectedModels[telemetryModelIndex].memoryGb.toFixed(1)} GB`

  const executionEvents = useMemo(() => {
    const events: { at: number; label: string }[] = [
      { at: 0, label: 'INPUT_RECEIVED' },
      { at: starts[1], label: 'MODALITY_DETECTED' },
      { at: starts[2], label: 'ROUTER_SELECTION' },
    ]
    selectedModels.forEach((model, index) => {
      const loadAt = starts[3] + index * 850
      const inferenceAt = starts[4] + index * 1450
      const purgeAt = starts[5] + index * 600
      events.push({ at: loadAt, label: `${index ? 'NEXT_MODEL_LOAD' : 'MODEL_LOAD'} · ${model.name} ${model.version}` })
      events.push({ at: inferenceAt, label: `INFERENCE_START · ${model.id.toUpperCase()}` })
      events.push({ at: inferenceAt + 1450, label: `INFERENCE_COMPLETE · ${model.id.toUpperCase()}` })
      events.push({ at: purgeAt, label: `MEMORY_PURGE · ${model.id.toUpperCase()}` })
    })
    events.push({ at: starts[6], label: 'RAG_RETRIEVAL' })
    events.push({ at: starts[7], label: 'EVIDENCE_FUSION' })
    events.push({ at: starts[8], label: 'CLINICAL_REPORT_READY' })
    return events.sort((a, b) => a.at - b.at)
  }, [selectedModels, starts])

  const showTrace = () => {
    setTraceVisible((visible) => !visible)
    window.setTimeout(() => traceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 30)
  }

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-[#E2E8F0] p-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.14em] text-[#2563EB]"><Activity size={15} /> Simulated AI orchestration</div>
            <h2 className="mt-2 text-xl font-semibold text-[#172033]">Model pipeline</h2>
            <p className="mt-1 text-sm text-[#526174]">Sequential, resource-aware model routing for this case.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 font-mono text-xs text-[#526174]">{caseId ?? 'NO CASE'}</span>
            {runStatus === 'idle' || runStatus === 'completed' ? (
              <button type="button" onClick={() => begin()} className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8]"><Play size={15} /> Run Analysis</button>
            ) : (
              <button type="button" onClick={() => setRunStatus((status) => status === 'paused' ? 'running' : 'paused')} className="inline-flex items-center gap-2 rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-2.5 text-sm font-semibold text-[#1D4ED8]">{runStatus === 'paused' ? <Play size={15} /> : <Pause size={15} />}{runStatus === 'paused' ? 'Resume' : 'Pause'}</button>
            )}
            <button type="button" onClick={() => begin(true)} className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm font-medium text-[#334155] hover:bg-[#F8FAFC]"><RotateCcw size={15} /> Restart</button>
            <button type="button" onClick={showTrace} className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm font-medium text-[#334155] hover:bg-[#F8FAFC]"><Clock3 size={15} /> {traceVisible ? 'Hide Trace' : 'View Execution Trace'}</button>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[#F8FAFC] px-5 py-3 text-xs">
          <span className={`h-2 w-2 rounded-full ${runStatus === 'running' ? 'animate-pulse bg-[#2563EB]' : runStatus === 'completed' ? 'bg-[#16A34A]' : runStatus === 'paused' ? 'bg-[#D97706]' : 'bg-[#94A3B8]'}`} />
          <span className="font-semibold text-[#334155]">{runStatus === 'idle' ? 'READY' : runStatus.toUpperCase()}</span>
          <span className="text-[#7B8794]">{selectedModels.length} routed model{selectedModels.length === 1 ? '' : 's'} · inputs: {modalities.length ? modalities.join(', ') : 'PDF / Clinical Text'}</span>
          {runStatus === 'running' || runStatus === 'paused' ? <span className="ml-auto font-mono text-[#526174]">{Math.round(elapsed / totalDuration * 100)}%</span> : null}
        </div>

        <div className="overflow-x-auto p-5">
          <div className="flex min-w-[1050px] items-stretch gap-2">
            {stageDefinitions.map((stage, index) => {
              const Icon = stage.icon
              const status = getStatus(index, elapsed, starts, durations, runStatus)
              const stageProgress = status === 'COMPLETED' ? 100 : status === 'RUNNING' ? Math.min(100, ((elapsed - starts[index]) / durations[index]) * 100) : 0
              const stageTime = startedAt && status !== 'QUEUED' ? formatClock(startedAt, starts[index]) : '—'
              const stageDuration = status === 'QUEUED' ? '—' : `${((status === 'COMPLETED' ? durations[index] : Math.min(durations[index], Math.max(0, elapsed - starts[index]))) / 1000).toFixed(1)}s`
              const stageColor = status === 'COMPLETED' ? 'text-[#15803D]' : status === 'RUNNING' ? 'text-[#2563EB]' : status === 'FAILED' ? 'text-[#DC2626]' : 'text-[#94A3B8]'
              return <div className="flex min-w-0 flex-1 items-center gap-2" key={stage.title}>
                <div className={`min-w-[116px] flex-1 rounded-lg border p-3 ${status === 'RUNNING' ? 'border-[#93C5FD] bg-[#EFF6FF]' : status === 'COMPLETED' ? 'border-[#BBF7D0] bg-white' : 'border-[#E2E8F0] bg-[#F8FAFC]'}`}>
                  <div className="flex items-center justify-between"><Icon size={17} className={stageColor} />{status === 'COMPLETED' ? <CheckCircle2 size={15} className="text-[#16A34A]" /> : status === 'RUNNING' ? <Loader2 size={14} className="animate-spin text-[#2563EB]" /> : status === 'FAILED' ? <AlertCircle size={15} className="text-[#DC2626]" /> : <Circle size={13} className="text-[#CBD5E1]" />}</div>
                  <p className="mt-3 text-xs font-semibold text-[#172033]">{stage.title}</p>
                  <p className="mt-1 min-h-8 text-[10px] leading-4 text-[#7B8794]">{stage.subtitle}</p>
                  <div className="mt-2 flex justify-between gap-1 text-[9px] text-[#7B8794]"><span>{status}</span><span>{status === 'QUEUED' ? '—' : stageTime}</span></div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#E2E8F0]"><div className={`h-full rounded-full ${status === 'COMPLETED' ? 'bg-[#16A34A]' : status === 'FAILED' ? 'bg-[#DC2626]' : 'bg-[#2563EB]'}`} style={{ width: `${stageProgress}%` }} /></div>
                  <p className="mt-1 text-right font-mono text-[9px] text-[#94A3B8]">{stageDuration}</p>
                </div>
                {index < stageDefinitions.length - 1 && <ChevronRight size={14} className="shrink-0 text-[#CBD5E1]" />}
              </div>
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,.8fr)]">
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.13em] text-[#2563EB]">Dynamic model router</p><h3 className="mt-1 text-base font-semibold text-[#172033]">Models selected for this case</h3></div><span className="rounded-full bg-[#EFF6FF] px-3 py-1 text-[10px] font-semibold text-[#1D4ED8]">{selectedModels.length} REQUIRED</span></div>
          <div className="mt-4 space-y-3">
            {selectedModels.map((model, index) => {
              const Icon = model.icon
              const loadStart = starts[3] + index * 850
              const inferenceStart = starts[4] + index * 1450
              const purgeStart = starts[5] + index * 600
              const phaseIndex = runStatus === 'idle' || elapsed < loadStart ? 0 : elapsed < loadStart + 850 ? 1 : elapsed < inferenceStart ? 2 : elapsed < inferenceStart + 1450 ? 3 : elapsed < purgeStart + 600 ? 4 : 5
              return <article className="rounded-lg border border-[#E2E8F0] p-4" key={model.id}>
                <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3"><span className="rounded-lg bg-[#EFF6FF] p-2.5 text-[#2563EB]"><Icon size={18} /></span><div><h4 className="text-sm font-semibold text-[#172033]">{model.name}</h4><p className="mt-0.5 text-xs text-[#7B8794]">{model.version} · {model.modality}</p></div></div><span className="rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-2.5 py-1 text-[10px] font-semibold text-[#1D4ED8]">{runStatus === 'idle' ? 'ROUTED' : lifecycle[phaseIndex]}</span></div>
                <div className="mt-4 flex flex-wrap items-center gap-1.5">{lifecycle.map((phaseName, phaseStep) => { const complete = phaseStep < phaseIndex; const active = phaseStep === phaseIndex && runStatus !== 'idle'; return <span key={`${model.id}-${phaseStep}`} className={`rounded-md px-2 py-1 font-mono text-[9px] ${active ? 'bg-[#2563EB] text-white' : complete ? 'bg-[#EFF6FF] text-[#1D4ED8]' : 'bg-[#F8FAFC] text-[#94A3B8]'}`}>{phaseName}</span> })}</div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-[10px]"><div className="rounded-md bg-[#F8FAFC] p-2"><span className="text-[#7B8794]">Memory</span><p className="mt-0.5 font-semibold text-[#334155]">{model.memoryGb < 1 ? `${Math.round(model.memoryGb * 1000)} MB` : `${model.memoryGb.toFixed(1)} GB`}</p></div><div className="rounded-md bg-[#F8FAFC] p-2"><span className="text-[#7B8794]">Latency</span><p className="mt-0.5 font-semibold text-[#334155]">{model.latencyMs} ms</p></div><div className="rounded-md bg-[#F8FAFC] p-2"><span className="text-[#7B8794]">Paging</span><p className="mt-0.5 font-semibold text-[#334155]">{phaseIndex >= 2 && phaseIndex <= 4 ? 'IN MEMORY' : 'READY'}</p></div></div>
              </article>
            })}
          </div>
        </div>

        <div className="space-y-5">
          <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.13em] text-[#2563EB]">Runtime telemetry</p><h3 className="mt-1 text-base font-semibold text-[#172033]">Resource monitor</h3></div><Activity size={18} className="text-[#2563EB]" /></div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Telemetry icon={Cpu} label="CPU" value={`${cpu}%`} percent={cpu} />
              <Telemetry icon={MemoryStick} label="RAM" value={`${ram} GB`} percent={Number(ram) / 4 * 100} />
              <Telemetry icon={Activity} label="GPU" value={`${gpu}%`} percent={gpu} />
              <Telemetry icon={Server} label="VRAM" value={`${vram} GB`} percent={Number(vram) / 4 * 100} />
              <Telemetry icon={Timer} label="Inference latency" value={`${selectedModels[telemetryModelIndex].latencyMs} ms`} />
              <Telemetry icon={Database} label="Model memory" value={currentModelMemory} />
              <Telemetry icon={Network} label="Queue depth" value={String(queueDepth)} />
            </div>
            <div className="mt-4 space-y-2 rounded-lg border border-[#BFDBFE] bg-[#F5F9FF] p-3 text-[10px]">
              <p className="flex items-center gap-2 font-semibold text-[#1D4ED8]"><ShieldCheck size={13} /> Resource Guard: ACTIVE</p>
              <p className="text-[#526174]">Memory Envelope: 3.2 GB / 4.0 GB</p>
              <p className="text-[#526174]">Sequential Model Paging: ENABLED</p>
              <p className="pt-1 text-[#94A3B8]">Simulated telemetry · values are illustrative only</p>
            </div>
          </section>
          <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-[#172033]">Simulation controls</h3>
            <p className="mt-1 text-xs leading-5 text-[#7B8794]">Model paging is sequential to keep the simulated memory envelope within its demo limit.</p>
            <div className="mt-3 flex items-center gap-2 text-[10px] text-[#526174]"><Check size={13} className="text-[#16A34A]" /> No backend or machine learning is connected.</div>
          </section>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] p-5"><div><p className="text-xs font-semibold uppercase tracking-[.13em] text-[#2563EB]">Inference output</p><h3 className="mt-1 text-base font-semibold text-[#172033]">Simulated findings</h3></div><span className="text-xs text-[#7B8794]">{visibleFindings.length} / {findings.filter((f) => f.match.some((id) => selectedModels.some((m) => m.id === id))).length} available</span></div>
          {visibleFindings.length === 0 ? <div className="p-8 text-center text-sm text-[#7B8794]">Findings will appear progressively after model inference.</div> : <div className="divide-y divide-[#E2E8F0]">{visibleFindings.map((finding) => {
            const model = selectedModels.find((item) => finding.match.includes(item.id)) ?? selectedModels[0]
            return <article className="p-5" key={finding.title}><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><h4 className="text-sm font-semibold text-[#172033]">{finding.title}</h4><p className="mt-1.5 max-w-3xl text-xs leading-5 text-[#526174]">{finding.detail}</p></div><span className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold ${finding.severity === 'Moderate' ? 'bg-[#FFF7ED] text-[#B45309]' : finding.severity === 'Low' ? 'bg-[#F0FDF4] text-[#15803D]' : 'bg-[#EFF6FF] text-[#1D4ED8]'}`}>{finding.severity.toUpperCase()}</span></div><div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[10px]"><span className="font-semibold text-[#1D4ED8]">Confidence {finding.confidence}%</span><span className="text-[#526174]">Model: {model.name} {model.version}</span><span className="text-[#7B8794]">Evidence: {elapsed >= starts[6] ? 'RETRIEVED' : 'PENDING RAG'}</span></div><div className="mt-2 h-1 overflow-hidden rounded-full bg-[#E2E8F0]"><div className="h-full rounded-full bg-[#2563EB]" style={{ width: `${finding.confidence}%` }} /></div></article>
          })}</div>}
        </section>
        <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><Sparkles size={16} className="text-[#2563EB]" /><h3 className="text-sm font-semibold text-[#172033]">Explainability & traceability</h3></div><p className="mt-2 text-xs leading-5 text-[#526174]">Each deterministic demo finding is linked to a routed model, confidence score, severity and evidence retrieval state for physician review.</p><div className="mt-4 rounded-lg bg-[#F5F9FF] p-3 text-[10px] leading-5 text-[#526174]">Output is simulated and is not a medical diagnosis.</div></section>
      </section>

      {runStatus === 'completed' && <section className="flex flex-col gap-4 rounded-xl border border-[#BBF7D0] bg-white p-5 sm:flex-row sm:items-center"><CheckCircle2 size={20} className="text-[#16A34A]" /><div className="flex-1"><p className="text-sm font-semibold text-[#172033]">Simulated analysis completed</p><p className="mt-1 text-xs text-[#526174]">The case is ready for patient evidence retrieval and clinical review.</p></div><button type="button" onClick={onContinue} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8]">Continue to RAG & Evidence <ArrowRight size={15} /></button></section>}

      {traceVisible && <section ref={traceRef} className="rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] p-5 shadow-sm"><div className="mb-4 flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.13em] text-[#2563EB]">Execution trace</p><h3 className="mt-1 text-sm font-semibold text-[#172033]">Orchestrator event log</h3></div><span className="rounded-md bg-[#E2E8F0] px-2 py-1 font-mono text-[10px] text-[#526174]">SIMULATION</span></div><div className="max-h-72 space-y-1 overflow-y-auto rounded-lg bg-[#0F2744] p-3 font-mono">{executionEvents.filter((event) => event.at <= elapsed && startedAt !== null).map((event, index) => <div key={`${event.at}-${event.label}`} className="flex gap-3 border-b border-white/10 py-1.5 text-[10px] last:border-0"><span className="shrink-0 text-blue-200">{formatClock(startedAt, event.at)}</span><span className="text-slate-100">{event.label}</span>{index === executionEvents.filter((item) => item.at <= elapsed && startedAt !== null).length - 1 && runStatus === 'running' ? <Loader2 size={12} className="ml-auto animate-spin text-blue-200" /> : null}</div>)}{startedAt === null && <p className="text-[10px] text-blue-100">Run Analysis to stream orchestration events.</p>}</div></section>}
    </div>
  )
}

function Telemetry({ icon: Icon, label, value, percent }: { icon: LucideIcon; label: string; value: string; percent?: number }) {
  return <div className="rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] p-3"><div className="flex items-center justify-between gap-2"><span className="text-[10px] text-[#7B8794]">{label}</span><Icon size={13} className="text-[#2563EB]" /></div><p className="mt-1 text-sm font-semibold tabular-nums text-[#172033]">{value}</p>{percent !== undefined && <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#E2E8F0]"><div className="h-full rounded-full bg-[#3B82F6] transition-[width] duration-500" style={{ width: `${percent}%` }} /></div>}</div>
}
