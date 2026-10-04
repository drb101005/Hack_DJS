import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  ArrowRight,
  Beaker,
  BookOpen,
  Check,
  CheckCircle2,
  Database,
  FileText,
  Filter,
  HeartPulse,
  History,
  Image,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { useDemo } from '../../context/DemoContext'
import { mockPatients } from '../../data/patients'
import type { Patient } from '../../types'

interface RAGEvidenceProps {
  patient: Patient | null
  caseId: string | null
  onContinue: () => void
}

const retrievalSteps = [
  'Indexing patient records',
  'Searching historical records',
  'Applying patient filter',
  'Ranking evidence',
  'Retrieval complete',
]

const pipeline = [
  { title: 'Clinical Case', subtitle: 'Current screening input', icon: FileText },
  { title: 'Patient ID Filter', subtitle: 'Strict patient scope', icon: Filter },
  { title: 'Historical Records', subtitle: 'Prior patient sources', icon: History },
  { title: 'Semantic Retrieval', subtitle: 'Query relevance match', icon: Search },
  { title: 'Relevance Ranking', subtitle: 'Rank candidate sources', icon: Activity },
  { title: 'Evidence Fusion', subtitle: 'Link findings to sources', icon: Sparkles },
]

const evidence = [
  {
    id: '01',
    title: 'Chest X-Ray Report',
    type: 'Imaging',
    date: '12 Mar 2026',
    sortDate: '2026-03-12',
    relevance: 96,
    excerpt: 'Prior chest radiograph describes clear lung fields and stable cardiomediastinal contours, with no focal air-space opacity reported.',
    why: 'Provides a recent imaging baseline for comparing the current cardiopulmonary screening signal.',
    linkedFinding: 'Finding 01 · Cardiopulmonary screening signal',
    icon: Image,
  },
  {
    id: '02',
    title: 'Respiratory Follow-up Note',
    type: 'Clinical Note',
    date: '18 Mar 2026',
    sortDate: '2026-03-18',
    relevance: 94,
    excerpt: 'Follow-up documents intermittent exertional breathlessness; symptoms and planned imaging review were recorded for clinician follow-up.',
    why: 'Adds symptom context that can be considered alongside the imaging signal and current case.',
    linkedFinding: 'Finding 01 · Cardiopulmonary screening signal',
    icon: FileText,
  },
  {
    id: '03',
    title: 'ECG Investigation',
    type: 'ECG',
    date: '10 Mar 2026',
    sortDate: '2026-03-10',
    relevance: 87,
    excerpt: 'Stored tracing summary notes sinus rhythm and does not describe an acute rhythm abnormality.',
    why: 'Offers a historical cardiac rhythm reference for the current screening review.',
    linkedFinding: 'Finding 02 · No acute ECG pattern detected',
    icon: HeartPulse,
  },
  {
    id: '04',
    title: 'Blood Panel',
    type: 'Lab Report',
    date: '04 Feb 2026',
    sortDate: '2026-02-04',
    relevance: 74,
    excerpt: 'Complete blood count and metabolic panel are present in the longitudinal record for comparison.',
    why: 'Provides broader clinical context that may inform interpretation of historical comparison needs.',
    linkedFinding: 'Finding 03 · Historical comparison recommended',
    icon: Beaker,
  },
]

const findingLinks = [
  { finding: 'Finding 01', label: 'Cardiopulmonary screening signal', sources: ['Evidence 01', 'Evidence 02'] },
  { finding: 'Finding 02', label: 'No acute ECG pattern detected', sources: ['Evidence 03'] },
  { finding: 'Finding 03', label: 'Historical comparison recommended', sources: ['Evidence 01', 'Evidence 04'] },
]

export default function RAGEvidence({ patient, caseId, onContinue }: RAGEvidenceProps) {
  const { cases, activeCase } = useDemo()
  const currentCase = cases.find((item) => item.id === caseId) ?? activeCase
  const currentPatient = useMemo(() => {
    if (patient && (!currentCase || currentCase.patientId === patient.id)) return patient
    return mockPatients.find((item) => item.id === currentCase?.patientId) ?? patient
  }, [currentCase, patient])
  const [running, setRunning] = useState(false)
  const [complete, setComplete] = useState(false)
  const [progressStep, setProgressStep] = useState(-1)

  useEffect(() => {
    if (!running) return
    const timer = window.setTimeout(() => {
      const nextStep = progressStep + 1
      setProgressStep(nextStep)
      if (nextStep >= retrievalSteps.length - 1) {
        setRunning(false)
        setComplete(true)
      }
    }, 620)
    return () => window.clearTimeout(timer)
  }, [progressStep, running])

  const runRetrieval = () => {
    setProgressStep(-1)
    setComplete(false)
    setRunning(true)
  }

  const activePipelineStep = running ? Math.min(progressStep, pipeline.length - 1) : complete ? pipeline.length : -1
  const displayedEvidence = complete ? evidence : []
  const timeline = [...evidence].sort((a, b) => a.sortDate.localeCompare(b.sortDate))
  const patientLabel = currentPatient ? `${currentPatient.id} — ${currentPatient.name}` : 'No patient selected'
  const scopeId = currentPatient?.id ?? currentCase?.patientId ?? 'NO PATIENT ID'

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#2563EB]">Patient-centric retrieval</p>
        <h1 className="mt-1 text-2xl font-semibold text-[#172033]">RAG & Evidence</h1>
        <p className="mt-1 text-sm text-[#526174]">A simulated, patient-scoped retrieval trace for clinical review.</p>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1.15fr_1.35fr_1fr]">
        <div className="rounded-xl border border-[#BFDBFE] bg-[#F5F9FF] p-4">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#2563EB]"><UserRound size={14} /> Patient scope</div>
          <p className="mt-3 text-sm font-semibold text-[#172033]">{patientLabel}</p>
          <p className="mt-1 text-[10px] text-[#7B8794]">Patient ID filter: {scopeId}</p>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#2563EB]"><Search size={14} /> Retrieval query</div>
          <p className="mt-3 text-sm font-medium leading-5 text-[#334155]">“cardiorespiratory findings compared with previous investigations”</p>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7B8794]">Current case</p>
          <p className="mt-3 font-mono text-sm font-semibold text-[#1D4ED8]">{currentCase?.id ?? caseId ?? 'NO ACTIVE CASE'}</p>
          <p className="mt-1 text-[10px] text-[#7B8794]">{currentCase?.modalities?.join(' · ') || 'Clinical screening'}</p>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-[#E2E8F0] p-5 sm:flex-row sm:items-center">
          <div><p className="text-xs font-semibold uppercase tracking-[.14em] text-[#2563EB]">Patient-isolated retrieval path</p><h2 className="mt-1 text-base font-semibold text-[#172033]">Evidence pipeline</h2></div>
          <div className="flex items-center gap-3"><span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-semibold ${complete ? 'bg-[#F0FDF4] text-[#15803D]' : running ? 'bg-[#EFF6FF] text-[#1D4ED8]' : 'bg-[#F8FAFC] text-[#7B8794]'}`}><span className={`h-1.5 w-1.5 rounded-full ${complete ? 'bg-[#16A34A]' : running ? 'animate-pulse bg-[#2563EB]' : 'bg-[#94A3B8]'}`} />{complete ? 'RETRIEVAL COMPLETE' : running ? 'RETRIEVAL RUNNING' : 'READY'}</span><button type="button" onClick={runRetrieval} disabled={running} className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1D4ED8] disabled:cursor-wait disabled:opacity-60">{running ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}{running ? 'Retrieving…' : complete ? 'Run Again' : 'Run Retrieval'}</button></div>
        </div>
        <div className="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-6">
          {pipeline.map((stage, index) => {
            const Icon = stage.icon
            const done = complete || index < activePipelineStep
            const active = running && index === activePipelineStep
            const queued = !done && !active
            return <div key={stage.title} className={`relative rounded-lg border p-3 ${active ? 'border-[#93C5FD] bg-[#EFF6FF]' : done ? 'border-[#BBF7D0] bg-white' : 'border-[#E2E8F0] bg-[#F8FAFC]'}`}>
              <div className="flex items-center justify-between"><Icon size={16} className={active ? 'text-[#2563EB]' : done ? 'text-[#16A34A]' : 'text-[#94A3B8]'} />{done ? <CheckCircle2 size={14} className="text-[#16A34A]" /> : active ? <Loader2 size={13} className="animate-spin text-[#2563EB]" /> : <span className="h-2 w-2 rounded-full bg-[#CBD5E1]" />}</div>
              <p className="mt-3 text-xs font-semibold text-[#172033]">{stage.title}</p><p className="mt-1 min-h-8 text-[10px] leading-4 text-[#7B8794]">{stage.subtitle}</p>
              <p className={`mt-2 text-[9px] font-semibold uppercase tracking-wider ${active ? 'text-[#1D4ED8]' : done ? 'text-[#15803D]' : 'text-[#94A3B8]'}`}>{done ? 'COMPLETED' : active ? 'RUNNING' : queued ? 'QUEUED' : 'QUEUED'}</p>
            </div>
          })}
        </div>
        <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4">
          <div className="mb-3 flex items-center justify-between"><p className="text-xs font-semibold text-[#334155]">Retrieval progress</p><p className="font-mono text-[10px] text-[#7B8794]">{complete ? '100%' : running ? `${Math.round((progressStep + 1) / retrievalSteps.length * 100)}%` : '0%'}</p></div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {retrievalSteps.map((label, index) => {
              const done = complete || index < progressStep
              const active = running && index === progressStep
              return <div key={label} className={`flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-[10px] ${done ? 'border-[#BBF7D0] bg-white text-[#15803D]' : active ? 'border-[#93C5FD] bg-[#EFF6FF] text-[#1D4ED8]' : 'border-[#E2E8F0] bg-white text-[#94A3B8]'}`}>
                {done ? <Check size={13} /> : active ? <Loader2 size={13} className="animate-spin" /> : <span className="h-1.5 w-1.5 rounded-full bg-[#CBD5E1]" />}{label}
              </div>
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <Summary icon={Database} value={complete ? '4' : '0'} label="Sources Retrieved" />
        <Summary icon={BookOpen} value={complete ? '3' : '0'} label="Findings Linked" />
        <Summary icon={ShieldCheck} value={complete ? '100%' : '—'} label="Traceability" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
          <div className="border-b border-[#E2E8F0] p-5"><div className="flex items-center gap-2"><BookOpen size={16} className="text-[#2563EB]" /><h2 className="text-sm font-semibold text-[#172033]">Retrieved evidence</h2></div><p className="mt-1 text-xs text-[#7B8794]">Four mock historical sources scoped to {patientLabel} and case {currentCase?.id ?? caseId ?? '—'}.</p></div>
          {!complete ? <div className="p-10 text-center"><div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">{running ? <Loader2 size={19} className="animate-spin" /> : <Database size={19} />}</div><p className="mt-3 text-sm font-medium text-[#334155]">{running ? 'Retrieving patient-scoped records' : 'Run retrieval to review matched historical sources'}</p><p className="mt-1 text-xs text-[#7B8794]">Mock evidence is isolated to the patient ID shown above.</p></div> : <div className="divide-y divide-[#E2E8F0]">{displayedEvidence.map((item) => {
            const Icon = item.icon
            return <article key={item.id} className="p-5"><div className="flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB]"><Icon size={17} /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="rounded-md bg-[#EFF6FF] px-2 py-1 font-mono text-[9px] font-semibold text-[#1D4ED8]">EVIDENCE {item.id}</span><span className="rounded-full bg-[#F8FAFC] px-2.5 py-1 text-[9px] font-medium text-[#526174]">{item.type}</span><span className="ml-auto text-[10px] text-[#7B8794]">{item.date}</span></div><h3 className="mt-2 text-sm font-semibold text-[#172033]">{item.title}</h3><p className="mt-2 text-xs leading-5 text-[#526174]">{item.excerpt}</p><div className="mt-3 rounded-lg bg-[#F5F9FF] p-3"><p className="text-[10px] font-semibold text-[#1D4ED8]">Why relevant?</p><p className="mt-1 text-[11px] leading-5 text-[#526174]">{item.why}</p></div><div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><span className="text-[10px] font-medium text-[#334155]">Linked finding: {item.linkedFinding}</span><span className="flex items-center gap-2 text-[10px] font-semibold text-[#2563EB]">{item.relevance}% relevance<span className="h-1.5 w-20 overflow-hidden rounded-full bg-[#E2E8F0]"><span className="block h-full rounded-full bg-[#3B82F6]" style={{ width: `${item.relevance}%` }} /></span></span></div></div></div><p className="mt-3 text-[9px] text-[#94A3B8]">Patient filter: {scopeId} · Case: {currentCase?.id ?? caseId ?? '—'}</p></article>
          })}</div>}
        </section>

        <div className="space-y-5">
          <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><History size={16} className="text-[#2563EB]" /><h2 className="text-sm font-semibold text-[#172033]">Evidence timeline</h2></div><p className="mt-1 text-[10px] text-[#7B8794]">Historical sources in date order</p><div className="mt-5 space-y-0">{timeline.map((item, index) => <div className="flex gap-3" key={item.id}><div className="flex flex-col items-center"><span className={`mt-1 h-2.5 w-2.5 rounded-full ${complete ? 'bg-[#2563EB]' : 'bg-[#CBD5E1]'}`} />{index < timeline.length - 1 && <span className="my-1 min-h-8 w-px flex-1 bg-[#E2E8F0]" />}</div><div className="pb-4"><p className="text-[10px] font-medium text-[#7B8794]">{item.date}</p><p className="mt-1 text-xs font-medium text-[#334155]">{item.title}</p><p className="mt-0.5 text-[9px] text-[#94A3B8]">{item.type}</p></div></div>)}</div></section>

          <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><ShieldCheck size={16} className="text-[#2563EB]" /><h2 className="text-sm font-semibold text-[#172033]">Traceability</h2></div><p className="mt-1 text-[10px] text-[#7B8794]">Finding-to-source citations</p><div className="mt-4 space-y-3">{findingLinks.map((link) => <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3" key={link.finding}><p className="text-[10px] font-semibold text-[#172033]">{link.finding} <span className="font-normal text-[#526174]">→ {link.label}</span></p><div className="mt-2 flex flex-wrap items-center gap-1.5">{link.sources.map((source, index) => <span className="inline-flex items-center gap-1 rounded-md bg-[#EFF6FF] px-2 py-1 font-mono text-[9px] font-semibold text-[#1D4ED8]" key={source}>{index > 0 ? <span>+</span> : null}{source}</span>)}</div></div>)}</div><div className="mt-4 grid grid-cols-3 gap-2 border-t border-[#E2E8F0] pt-4 text-center"><div><p className="text-base font-semibold text-[#172033]">{complete ? '4' : '0'}</p><p className="mt-1 text-[9px] text-[#7B8794]">Sources</p></div><div><p className="text-base font-semibold text-[#172033]">{complete ? '3' : '0'}</p><p className="mt-1 text-[9px] text-[#7B8794]">Findings</p></div><div><p className="text-base font-semibold text-[#16A34A]">{complete ? '100%' : '—'}</p><p className="mt-1 text-[9px] text-[#7B8794]">Linked</p></div></div></section>

          <section className="rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-4"><div className="flex items-start gap-3"><CheckCircle2 size={17} className="mt-0.5 shrink-0 text-[#16A34A]" /><div><p className="text-xs font-semibold text-[#166534]">Cross-source consistency</p><p className="mt-1 flex items-center gap-1.5 text-xs text-[#15803D]"><Check size={13} /> No major contradiction detected</p><p className="mt-2 text-[9px] text-[#7B8794]">Simulated consistency check across the retrieved mock sources.</p></div></div></section>
        </div>
      </section>

      {complete && <section className="flex flex-col gap-4 rounded-xl border border-[#BBF7D0] bg-white p-5 sm:flex-row sm:items-center"><CheckCircle2 size={20} className="text-[#16A34A]" /><div className="flex-1"><p className="text-sm font-semibold text-[#172033]">Patient-scoped retrieval complete</p><p className="mt-1 text-xs text-[#526174]">Four sources are linked to three findings for case {currentCase?.id ?? caseId ?? '—'}.</p></div><button type="button" onClick={onContinue} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1D4ED8]">Continue to Clinical Report <ArrowRight size={14} /></button></section>}

      <p className="text-center text-[10px] text-[#94A3B8]">Mock retrieval interface · No vector database or external records are connected.</p>
    </div>
  )
}

function Summary({ icon: Icon, value, label }: { icon: typeof Database; value: string; label: string }) {
  return <div className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4"><span className="rounded-lg bg-[#EFF6FF] p-2.5 text-[#2563EB]"><Icon size={17} /></span><div><p className="text-xl font-semibold text-[#172033]">{value}</p><p className="mt-0.5 text-[10px] text-[#7B8794]">{label}</p></div></div>
}
