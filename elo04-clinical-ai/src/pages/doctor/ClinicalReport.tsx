import { useState } from 'react'
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronRight,
  FileText,
  GitBranch,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from 'lucide-react'
import type { Patient } from '../../types'

interface ClinicalReportProps {
  patient: Patient | null
  caseId: string | null
  onApproved: () => void
}

const findings = [
  {
    title: 'Cardiopulmonary screening signal',
    confidence: 92,
    severity: 'Medium',
    evidence: 'Chest X-Ray — 12 Mar 2026',
  },
  {
    title: 'No acute ECG pattern detected',
    confidence: 96,
    severity: 'Low',
    evidence: 'ECG — 10 Mar 2026',
  },
  {
    title: 'Historical comparison recommended',
    confidence: 88,
    severity: 'Medium',
    evidence: 'Respiratory Follow-up — 18 Mar 2026',
  },
]

export default function ClinicalReport({
  patient,
  caseId,
  onApproved,
}: ClinicalReportProps) {
  const [approved, setApproved] = useState(false)
  const [comment, setComment] = useState('')

  const approveReport = () => {
    setApproved(true)

    window.setTimeout(() => {
      onApproved()
    }, 900)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400">
            Evidence Fusion
          </p>

          <h1 className="text-2xl font-semibold text-white mt-1">
            Clinical Intelligence Report
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            AI findings combined with retrieved patient evidence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-2 rounded-xl bg-white/[0.025] border border-white/[0.06] text-xs text-cyan-300 font-mono">
            {caseId ?? 'NO CASE'}
          </span>

          <span className="px-3 py-2 rounded-xl bg-amber-400/10 border border-amber-400/10 text-[10px] text-amber-300">
            Awaiting Physician Approval
          </span>
        </div>
      </div>

      <section className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-5">
          <div className="h-16 w-16 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center shrink-0">
            <span className="text-xl font-semibold text-cyan-300">
              {patient?.name
                ? patient.name
                    .split(' ')
                    .map((name) => name[0])
                    .join('')
                    .slice(0, 2)
                : 'NA'}
            </span>
          </div>

          <div className="flex-1">
            <p className="text-lg font-semibold text-white">
              {patient?.name ?? 'Unknown Patient'}
            </p>

            <p className="text-xs text-gray-600 mt-1">
              {patient?.id} • {patient?.age} years •{' '}
              {patient?.gender} • {patient?.condition}
            </p>
          </div>

          <div className="text-left md:text-right">
            <p className="text-[10px] uppercase tracking-wider text-gray-700">
              Report Status
            </p>

            <p className="text-sm text-amber-300 mt-1">
              {approved ? 'Approved' : 'Pending Review'}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-cyan-400/[0.035] border border-cyan-400/10 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Sparkles
            size={18}
            className="text-cyan-400 mt-0.5 shrink-0"
          />

          <div>
            <p className="text-sm font-semibold text-cyan-200">
              AI-generated screening summary
            </p>

            <p className="text-sm text-gray-400 leading-relaxed mt-2">
              The simulated multimodal pipeline identified a
              cardiopulmonary screening signal and recommends comparison
              against prior imaging and clinical history. The simulated ECG
              pathway did not identify an acute pattern in the demo input.
            </p>

            <div className="flex items-center gap-2 mt-4 text-[10px] text-gray-600">
              <ShieldCheck size={13} className="text-cyan-400" />
              Generated from model outputs + retrieved patient evidence
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0d1320] border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <GitBranch size={16} className="text-violet-400" />
            <h2 className="text-sm font-semibold text-white">
              Multi-Disease Findings
            </h2>
          </div>

          <p className="text-xs text-gray-600 mt-1">
            Individual findings with confidence and supporting evidence.
          </p>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {findings.map((finding) => (
            <div key={finding.title} className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="h-9 w-9 rounded-lg bg-white/[0.035] flex items-center justify-center shrink-0">
                  <FileText size={15} className="text-cyan-400" />
                </div>

                <div className="flex-1">
                  <p className="text-sm text-gray-200">
                    {finding.title}
                  </p>

                  <p className="text-[10px] text-gray-600 mt-1">
                    Supporting source: {finding.evidence}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`text-[10px] px-2 py-1 rounded-md ${
                      finding.severity === 'Medium'
                        ? 'bg-amber-400/10 text-amber-300'
                        : 'bg-emerald-400/10 text-emerald-300'
                    }`}
                  >
                    {finding.severity}
                  </span>

                  <span className="text-xs text-cyan-300">
                    {finding.confidence}%
                  </span>

                  <ChevronRight
                    size={15}
                    className="text-gray-700"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-5">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">
              Evidence Fusion
            </h2>
          </div>

          <div className="space-y-3 mt-5">
            {[
              ['AI model output', '3 findings'],
              ['Historical documents', '4 sources'],
              ['Patient timeline', '4 events'],
              ['Traceability', '100% linked'],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-xl bg-white/[0.025] border border-white/[0.04] px-4 py-3"
              >
                <span className="text-xs text-gray-500">
                  {label}
                </span>
                <span className="text-xs text-gray-300">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-5">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-400" />
            <h2 className="text-sm font-semibold text-white">
              Clinical Review
            </h2>
          </div>

          <p className="text-xs text-gray-500 leading-relaxed mt-4">
            This prototype report is an AI-assisted screening summary.
            Findings are simulated and require physician review before being
            treated as clinical conclusions.
          </p>

          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Add physician review note..."
            rows={4}
            className="w-full mt-4 resize-none bg-[#090e18] border border-white/[0.07] rounded-xl px-3 py-3 text-xs text-gray-300 placeholder:text-gray-700 outline-none focus:border-cyan-400/30"
          />
        </div>
      </section>

      <section className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center gap-5">
          <div className="h-11 w-11 rounded-xl bg-emerald-400/10 flex items-center justify-center shrink-0">
            <UserCheck size={19} className="text-emerald-400" />
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold text-white">
              Physician approval
            </p>

            <p className="text-xs text-gray-600 mt-1">
              Review the simulated findings, evidence and traceability before
              approving the report.
            </p>
          </div>

          <button
            type="button"
            onClick={approveReport}
            disabled={approved}
            className="inline-flex items-center justify-center gap-2 bg-emerald-400 text-black font-semibold text-xs px-5 py-3 rounded-xl hover:bg-emerald-300 transition disabled:opacity-60"
          >
            {approved ? (
              <>
                <Check size={15} />
                Report Approved
              </>
            ) : (
              <>
                <CheckCircle2 size={15} />
                Approve Report
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  )
}
