import { Activity, UserRound } from 'lucide-react'
import ModelRouter from '../../components/ai/ModelRouter'
import type { Patient } from '../../types'

interface AIAnalysisProps {
  patient: Patient | null
  caseId: string | null
  modalities: string[]
  onContinue: () => void
  onAnalysisStarted: () => void
  onAnalysisCompleted: () => void
}

export default function AIAnalysis({ patient, caseId, modalities, onContinue, onAnalysisStarted, onAnalysisCompleted }: AIAnalysisProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.14em] text-[#2563EB]"><Activity size={14} /> Clinical intelligence</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#172033]">AI Analysis</h1>
          <p className="mt-1 text-sm text-[#526174]">Simulated multimodal orchestration, sequential inference and review findings.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2"><p className="text-[9px] uppercase tracking-wider text-[#7B8794]">Case</p><p className="mt-1 font-mono text-xs text-[#1D4ED8]">{caseId ?? 'NO CASE'}</p></div>
          <div className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2"><UserRound size={15} className="text-[#2563EB]" /><div><p className="text-[9px] uppercase tracking-wider text-[#7B8794]">Patient</p><p className="mt-1 text-xs font-medium text-[#334155]">{patient?.name ?? 'Demo patient'}</p></div></div>
        </div>
      </div>
      <ModelRouter modalities={modalities} caseId={caseId} onContinue={onContinue} onAnalysisStarted={onAnalysisStarted} onAnalysisCompleted={onAnalysisCompleted} />
    </div>
  )
}
