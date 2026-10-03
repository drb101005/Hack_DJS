import { useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Database,
  FileText,
  History,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import type { Patient } from '../../types'

interface RAGEvidenceProps {
  patient: Patient | null
  caseId: string | null
  onContinue: () => void
}

const evidence = [
  {
    source: 'Chest X-Ray Report — 12 Mar 2026',
    type: 'Imaging',
    date: '12 Mar 2026',
    relevance: 96,
    excerpt:
      'Prior chest imaging stored for longitudinal comparison. No acute intervention documented.',
  },
  {
    source: 'Respiratory Follow-up Note — 18 Mar 2026',
    type: 'Clinical Note',
    date: '18 Mar 2026',
    relevance: 94,
    excerpt:
      'Patient reported intermittent shortness of breath during exertion. Follow-up imaging recommended.',
  },
  {
    source: 'ECG Investigation — 10 Mar 2026',
    type: 'ECG',
    date: '10 Mar 2026',
    relevance: 87,
    excerpt:
      'Normal sinus rhythm recorded. No acute rhythm abnormality documented in the stored report.',
  },
  {
    source: 'Blood Panel — 04 Feb 2026',
    type: 'Lab Report',
    date: '04 Feb 2026',
    relevance: 74,
    excerpt:
      'CBC and metabolic panel available in the historical patient record.',
  },
]

export default function RAGEvidence({
  patient,
  caseId,
  onContinue,
}: RAGEvidenceProps) {
  const [query, setQuery] = useState(
    'Compare current screening findings with relevant prior patient records.',
  )
  const [running, setRunning] = useState(false)
  const [complete, setComplete] = useState(false)

  const runRetrieval = () => {
    setRunning(true)
    setComplete(false)

    window.setTimeout(() => {
      setRunning(false)
      setComplete(true)
    }, 1800)
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400">
          Patient-Centric Retrieval
        </p>
        <h1 className="text-2xl font-semibold text-white mt-1">
          RAG & Evidence
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Retrieve relevant historical context and trace every evidence source.
        </p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-4">
          <Database size={17} className="text-cyan-400" />
          <p className="text-xl font-semibold text-white mt-4">14</p>
          <p className="text-[10px] text-gray-600 mt-1">
            Patient documents indexed
          </p>
        </div>

        <div className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-4">
          <Search size={17} className="text-violet-400" />
          <p className="text-xl font-semibold text-white mt-4">4</p>
          <p className="text-[10px] text-gray-600 mt-1">
            Relevant sources retrieved
          </p>
        </div>

        <div className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-4">
          <Clock3 size={17} className="text-amber-400" />
          <p className="text-xl font-semibold text-white mt-4">74 ms</p>
          <p className="text-[10px] text-gray-600 mt-1">
            Retrieval latency
          </p>
        </div>
      </section>

      <section className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-cyan-400/10 flex items-center justify-center shrink-0">
            <Sparkles size={18} className="text-cyan-400" />
          </div>

          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-wider text-gray-600">
              Retrieval Query
            </p>

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full bg-transparent outline-none text-sm text-gray-300 mt-1"
            />
          </div>

          <button
            type="button"
            onClick={runRetrieval}
            disabled={running}
            className="inline-flex items-center justify-center gap-2 bg-cyan-400 text-black font-semibold text-xs px-4 py-2.5 rounded-xl hover:bg-cyan-300 transition disabled:opacity-40 shrink-0"
          >
            {running ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Retrieving
              </>
            ) : (
              <>
                <Search size={14} />
                Run Retrieval
              </>
            )}
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="bg-[#0d1320] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-violet-400" />
              <h2 className="text-sm font-semibold text-white">
                Retrieved Evidence
              </h2>
            </div>

            <p className="text-xs text-gray-600 mt-1">
              Ranked against the active patient's historical record.
            </p>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {evidence.map((item, index) => (
              <div key={item.source} className="p-5">
                <div className="flex items-start gap-4">
                  <div className="h-9 w-9 rounded-lg bg-white/[0.035] flex items-center justify-center shrink-0">
                    <FileText size={15} className="text-cyan-400" />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm text-gray-200">
                        {item.source}
                      </p>

                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-gray-600">
                        {item.type}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed mt-2">
                      {item.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-4 mt-3">
                      <span className="text-[10px] text-gray-700">
                        Source {index + 1}
                      </span>
                      <span className="text-[10px] text-gray-600">
                        {item.date}
                      </span>
                      <span className="text-[10px] text-cyan-400">
                        Relevance {item.relevance}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <section className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-5">
            <div className="flex items-center gap-2">
              <History size={16} className="text-amber-400" />
              <h2 className="text-sm font-semibold text-white">
                Evidence Timeline
              </h2>
            </div>

            <div className="space-y-4 mt-5">
              {[
                ['18 Mar 2026', 'Respiratory follow-up'],
                ['12 Mar 2026', 'Chest X-Ray'],
                ['10 Mar 2026', 'ECG'],
                ['04 Feb 2026', 'Blood panel'],
              ].map(([date, title]) => (
                <div
                  key={date}
                  className="flex items-start gap-3"
                >
                  <div className="mt-1 h-2 w-2 rounded-full bg-cyan-400 shrink-0" />

                  <div>
                    <p className="text-[10px] text-gray-700">
                      {date}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-cyan-400/[0.035] border border-cyan-400/10 rounded-2xl p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-cyan-400" />
              <p className="text-sm font-medium text-cyan-200">
                Traceability
              </p>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed mt-2">
              Every retrieved source retains its document type, date,
              relevance score and excerpt for downstream report citations.
            </p>
          </section>

          <section className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-5">
            <p className="text-[10px] uppercase tracking-wider text-gray-700">
              Active Context
            </p>

            <p className="text-sm text-gray-300 mt-2">
              {patient?.name ?? 'No patient selected'}
            </p>

            <p className="text-[10px] text-gray-600 mt-1">
              {caseId ?? 'No active case'}
            </p>
          </section>
        </div>
      </section>

      {complete && (
        <section className="bg-emerald-400/[0.035] border border-emerald-400/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <CheckCircle2 size={20} className="text-emerald-400" />

          <div className="flex-1">
            <p className="text-sm text-emerald-300">
              Evidence retrieval completed
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Four relevant historical sources are ready for evidence fusion.
            </p>
          </div>

          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center justify-center gap-2 bg-cyan-400 text-black font-semibold text-xs px-4 py-2.5 rounded-xl hover:bg-cyan-300 transition"
          >
            Generate Clinical Report
            <ArrowRight size={14} />
          </button>
        </section>
      )}
    </div>
  )
}
