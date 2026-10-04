import { useMemo, useState } from 'react'

import {
  AlertTriangle,
  Check,
  CheckCircle2,
  CircleAlert,
  FileCheck2,
  GitBranch,
  Link2,
  MessageSquareText,
  Save,
  Send,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from 'lucide-react'

import {
  useDemo,
  type DemoClinicalReport,
  type FindingReview,
} from '../../context/DemoContext'

import { mockPatients } from '../../data/patients'

import { useToast } from '../../context/ToastContext'

import type { Patient } from '../../types'

interface ClinicalReportProps {
  patient: Patient | null
  caseId: string | null
}

const summaryText =
  'The simulated multimodal screening identified a cardiopulmonary screening signal and recommends comparison with prior imaging and clinical history. The demo ECG pathway did not identify an acute pattern. Findings are presented for physician review with linked patient evidence.'

function todayLabel() {
  return new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function ClinicalReport({
  patient,
  caseId,
}: ClinicalReportProps) {
  const {
    cases,
    activeCase,
    aiFindings,
    ragEvidence,
    reports,
    saveClinicalReport,
    approveClinicalReport,
  } = useDemo()

  const { showToast } = useToast()

  const currentCase =
    cases.find((item) => item.id === caseId) ?? activeCase

  const currentPatient =
    patient?.id === currentCase?.patientId
      ? patient
      : mockPatients.find(
          (item) => item.id === currentCase?.patientId,
        ) ?? patient

  const existingReport = reports.find(
    (item) =>
      item.caseId === (currentCase?.id ?? caseId),
  )

  const [comment, setComment] = useState(
    existingReport?.comment ?? '',
  )

  const [summary] = useState(
    existingReport?.summary ?? summaryText,
  )

  const [reviews, setReviews] = useState<
    Record<string, FindingReview>
  >(() =>
    Object.fromEntries(
      (existingReport?.reviews ?? []).map(
        (review) => [review.findingId, review],
      ),
    ),
  )

  const [editingFinding, setEditingFinding] =
    useState<string | null>(null)

  const [revisionAction, setRevisionAction] =
    useState<'Modified' | 'Overridden'>('Modified')

  const [revisionText, setRevisionText] = useState('')

  const [screeningDate] = useState(
    existingReport?.screeningDate ?? todayLabel(),
  )

  const approved =
    existingReport?.status === 'approved' ||
    existingReport?.status === 'shared'

  const shared = existingReport?.status === 'shared'

  const investigationTypes =
    currentCase?.modalities.length
      ? currentCase.modalities
      : ['X-Ray', 'ECG', 'Clinical Text']

  const overallConfidence = Math.round(
    aiFindings.reduce(
      (sum, item) => sum + item.confidence,
      0,
    ) / Math.max(1, aiFindings.length),
  )

  const evidenceById = useMemo(
    () =>
      new Map(
        ragEvidence.map((item) => [item.id, item]),
      ),
    [ragEvidence],
  )

  const buildReport = (
    status: DemoClinicalReport['status'],
  ): DemoClinicalReport => ({
    caseId:
      currentCase?.id ?? caseId ?? 'CASE-DEMO',

    patientId:
      currentCase?.patientId ??
      currentPatient?.id ??
      'PAT-1001',

    patientName:
      currentCase?.patientName ??
      currentPatient?.name ??
      'Ram Sharma',

    screeningDate,

    status,

    summary,

    comment,

    reviews: aiFindings.map(
      (finding) =>
        reviews[finding.id] ?? {
          findingId: finding.id,
          action: 'Accepted',
        },
    ),

    savedAt: new Date().toISOString(),
  })

  const recordReview = (
    findingId: string,
    action: FindingReview['action'],
  ) => {
    setReviews((current) => ({
      ...current,
      [findingId]: {
        findingId,
        action,
      },
    }))

    setEditingFinding(null)

    showToast(
      'Review recorded',
      `Finding marked ${action.toLowerCase()}.`,
      'info',
    )
  }

  const editReview = (
    findingId: string,
    action: 'Modified' | 'Overridden',
  ) => {
    const finding = aiFindings.find(
      (item) => item.id === findingId,
    )

    setRevisionAction(action)

    setRevisionText(
      reviews[findingId]?.revision ??
        finding?.title ??
        '',
    )

    setEditingFinding(findingId)
  }

  const saveRevision = (findingId: string) => {
    if (!revisionText.trim()) {
      showToast(
        'Revision required',
        'Enter the physician wording before saving.',
        'warning',
      )
      return
    }

    setReviews((current) => ({
      ...current,
      [findingId]: {
        findingId,
        action: revisionAction,
        revision: revisionText.trim(),
      },
    }))

    setEditingFinding(null)

    showToast(
      'Physician revision saved',
      'The finding is marked as physician-modified.',
      'success',
    )
  }

  const handleSaveDraft = () => {
    saveClinicalReport(buildReport('draft'))

    showToast(
      'Draft saved',
      'The report draft is available in the clinical workspace.',
      'success',
    )
  }

  const handleApprove = (shareWithPatient: boolean) => {
    approveClinicalReport(
      buildReport(
        shareWithPatient ? 'shared' : 'approved',
      ),
      shareWithPatient,
    )

    showToast(
      shareWithPatient
        ? 'Report approved and shared'
        : 'Report approved',
      shareWithPatient
        ? 'The approved report is now available in the Patient Portal.'
        : 'The report status is now Doctor Approved.',
      'success',
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.18em] text-[#2563EB]">
            <FileCheck2 size={14} />
            Final clinical review
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#172033] sm:text-3xl">
            Multimodal Clinical Screening Report
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-[#526174]">
            A presentation-ready, evidence-linked screening summary for physician interpretation.
          </p>
        </div>

        <span
          className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${
            shared
              ? 'bg-[#F0FDF4] text-[#15803D]'
              : approved
                ? 'bg-[#EFF6FF] text-[#1D4ED8]'
                : 'bg-[#FFF7ED] text-[#B45309]'
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              shared
                ? 'bg-[#16A34A]'
                : approved
                  ? 'bg-[#2563EB]'
                  : 'bg-[#D97706]'
            }`}
          />

          {shared
            ? 'Doctor Approved · Shared with Patient'
            : approved
              ? 'Doctor Approved'
              : 'Awaiting Clinical Review'}
        </span>
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#D8E3F1] bg-white shadow-[0_12px_32px_rgba(23,32,51,.07)]">
        <div className="bg-gradient-to-r from-[#EFF6FF] via-white to-white p-5 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#2563EB] text-xl font-bold text-white shadow-sm">
              {currentPatient?.name
                ?.split(' ')
                .map((part) => part[0])
                .join('')
                .slice(0, 2) ?? 'RS'}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[.15em] text-[#526174]">
                ELO-04 · Clinical decision support
              </p>

              <h2 className="mt-1 text-lg font-bold text-[#172033]">
                {currentPatient?.name ??
                  currentCase?.patientName ??
                  'Ram Sharma'}
              </h2>

              <p className="mt-1 text-xs text-[#526174]">
                {currentPatient?.id ??
                  currentCase?.patientId ??
                  'PAT-1001'}

                {currentPatient
                  ? ` · ${currentPatient.age} years · ${currentPatient.gender}`
                  : ''}

                {currentPatient?.condition
                  ? ` · ${currentPatient.condition}`
                  : ''}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:text-right">
              <ReportMeta
                label="Case ID"
                value={
                  currentCase?.id ??
                  caseId ??
                  'CASE-DEMO'
                }
              />

              <ReportMeta
                label="Screening date"
                value={screeningDate}
              />

              <ReportMeta
                label="Report status"
                value={
                  shared
                    ? 'Shared with Patient'
                    : approved
                      ? 'Doctor Approved'
                      : 'Awaiting Clinical Review'
                }
              />

              <ReportMeta
                label="Investigation types"
                value={investigationTypes.join(' · ')}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 border-t border-[#E2E8F0] bg-white">
          <ReportKpi
            label="AI confidence"
            value={`${overallConfidence}%`}
          />

          <ReportKpi
            label="Evidence sources"
            value={String(ragEvidence.length)}
          />

          <ReportKpi
            label="Findings linked"
            value={`${aiFindings.length} / ${aiFindings.length}`}
          />
        </div>
      </section>

      <section className="rounded-xl border border-[#BFDBFE] bg-[#F5F9FF] p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="rounded-lg bg-white p-2 text-[#2563EB] shadow-sm">
            <Sparkles size={18} />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
              Executive summary
            </p>

            <p className="mt-2 text-sm leading-6 text-[#334155]">
              {summary}
            </p>

            <div className="mt-3 flex items-center gap-2 text-[10px] text-[#526174]">
              <ShieldCheck
                size={13}
                className="text-[#2563EB]"
              />
              Synthesized from simulated model outputs and patient-scoped historical evidence
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
        <div className="border-b border-[#E2E8F0] p-5">
          <div className="flex items-center gap-2">
            <GitBranch
              size={17}
              className="text-[#2563EB]"
            />
            <h2 className="text-base font-semibold text-[#172033]">
              Multimodal findings
            </h2>
          </div>

          <p className="mt-1 text-xs text-[#7B8794]">
            Review each simulated finding and its evidence trace before finalizing.
          </p>
        </div>

        <div className="divide-y divide-[#E2E8F0]">
          {aiFindings.map((finding, index) => {
            const review = reviews[finding.id]

            const linkedEvidence = finding.evidenceIds
              .map((id) => evidenceById.get(id))
              .filter(
                (item) => item !== undefined,
              )

            const isModified =
              review?.action === 'Modified' ||
              review?.action === 'Overridden'

            return (
              <article
                key={finding.id}
                className={`p-5 sm:p-6 ${
                  isModified
                    ? 'bg-[#F5F9FF]/60'
                    : ''
                }`}
              >
                <div className="flex flex-col gap-4 xl:flex-row">
                  <div className="flex min-w-0 flex-1 gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] font-mono text-xs font-bold text-[#1D4ED8]">
                      0{index + 1}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-[#172033]">
                          {finding.title}
                        </h3>

                        {review && (
                          <span
                            className={`rounded-full px-2 py-1 text-[9px] font-semibold ${
                              isModified
                                ? 'bg-[#EFF6FF] text-[#1D4ED8]'
                                : review.action ===
                                    'Rejected'
                                  ? 'bg-[#FEF2F2] text-[#B91C1C]'
                                  : 'bg-[#F0FDF4] text-[#15803D]'
                            }`}
                          >
                            {isModified
                              ? 'PHYSICIAN MODIFIED'
                              : `PHYSICIAN ${review.action.toUpperCase()}`}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        <FindingMeta
                          label="Source model"
                          value={finding.model}
                        />

                        <FindingMeta
                          label="Confidence"
                          value={`${finding.confidence}%`}
                        />

                        <FindingMeta
                          label="Severity"
                          value={finding.severity}
                        />
                      </div>

                      <p className="mt-3 text-xs leading-5 text-[#526174]">
                        {finding.explanation}
                      </p>

                      <div className="mt-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7B8794]">
                          Linked evidence
                        </p>

                        <div className="mt-1.5 flex flex-wrap gap-2">
                          {linkedEvidence.map(
                            (item) => (
                              <span
                                key={item.id}
                                className="inline-flex items-center gap-1.5 rounded-md border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-[10px] text-[#334155]"
                              >
                                <Link2
                                  size={11}
                                  className="text-[#2563EB]"
                                />
                                Evidence {item.id} ·{' '}
                                {item.title}
                              </span>
                            ),
                          )}
                        </div>
                      </div>

                      {review?.revision && (
                        <p className="mt-3 rounded-lg border-l-2 border-[#2563EB] bg-white px-3 py-2 text-xs text-[#334155]">
                          <span className="font-semibold text-[#1D4ED8]">
                            Physician revision:
                          </span>{' '}
                          {review.revision}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 xl:w-[350px] xl:justify-end xl:self-start">
                    <ReviewButton
                      label="Accept"
                      icon={Check}
                      active={
                        review?.action ===
                        'Accepted'
                      }
                      onClick={() =>
                        recordReview(
                          finding.id,
                          'Accepted',
                        )
                      }
                    />

                    <ReviewButton
                      label="Modify"
                      active={
                        review?.action ===
                        'Modified'
                      }
                      onClick={() =>
                        editReview(
                          finding.id,
                          'Modified',
                        )
                      }
                    />

                    <ReviewButton
                      label="Override"
                      active={
                        review?.action ===
                        'Overridden'
                      }
                      onClick={() =>
                        editReview(
                          finding.id,
                          'Overridden',
                        )
                      }
                    />

                    <ReviewButton
                      label="Reject"
                      icon={CircleAlert}
                      danger
                      active={
                        review?.action ===
                        'Rejected'
                      }
                      onClick={() =>
                        recordReview(
                          finding.id,
                          'Rejected',
                        )
                      }
                    />
                  </div>
                </div>

                {editingFinding === finding.id && (
                  <div className="mt-4 rounded-lg border border-[#BFDBFE] bg-[#F5F9FF] p-3">
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#1D4ED8]">
                      Physician{' '}
                      {revisionAction.toLowerCase()}{' '}
                      revision
                    </label>

                    <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                      <input
                        value={revisionText}
                        onChange={(event) =>
                          setRevisionText(
                            event.target.value,
                          )
                        }
                        className="min-w-0 flex-1 rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-xs text-[#172033] outline-none focus:border-[#2563EB]"
                        placeholder="Enter revised finding wording"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          saveRevision(
                            finding.id,
                          )
                        }
                        className="rounded-lg bg-[#2563EB] px-3 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8]"
                      >
                        Save Revision
                      </button>
                    </div>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
          <div className="flex items-center gap-2">
            <GitBranch
              size={16}
              className="text-[#2563EB]"
            />
            <h2 className="text-sm font-semibold text-[#172033]">
              Evidence fusion
            </h2>
          </div>

          <div className="mt-5 grid items-stretch gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] sm:items-center">
            <FusionBlock
              label="AI Findings"
              value={`${aiFindings.length} model findings`}
            />

            <span className="text-center text-[#94A3B8]">
              +
            </span>

            <FusionBlock
              label="Historical Records"
              value={`${ragEvidence.length} patient sources`}
            />

            <span className="text-center text-[#94A3B8]">
              +
            </span>

            <FusionBlock
              label="Timeline"
              value="Longitudinal context"
            />

            <span className="text-center text-[#2563EB]">
              =
            </span>

            <FusionBlock
              label="Evidence-Grounded"
              value="Screening Summary"
              emphasis
            />
          </div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck
              size={16}
              className="text-[#2563EB]"
            />
            <h2 className="text-sm font-semibold text-[#172033]">
              Traceability
            </h2>
          </div>

          <p className="mt-1 text-xs text-[#7B8794]">
            Evidence sources linked to every finding
          </p>

          <div className="mt-4 space-y-2">
            {aiFindings.map((finding, index) => (
              <div
                key={finding.id}
                className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3"
              >
                <p className="text-[10px] font-semibold text-[#172033]">
                  Finding 0{index + 1}{' '}
                  <span className="font-normal text-[#526174]">
                    → {finding.title}
                  </span>
                </p>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {finding.evidenceIds.map(
                    (id) => (
                      <span
                        className="rounded-md bg-[#EFF6FF] px-2 py-1 font-mono text-[9px] font-semibold text-[#1D4ED8]"
                        key={id}
                      >
                        Evidence {id}
                      </span>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-5">
        <div className="flex items-center gap-2">
          <MessageSquareText
            size={16}
            className="text-[#2563EB]"
          />

          <h2 className="text-sm font-semibold text-[#172033]">
            Physician comment
          </h2>
        </div>

        <textarea
          value={comment}
          onChange={(event) =>
            setComment(event.target.value)
          }
          placeholder="Document clinical context, interpretation, or follow-up guidance…"
          rows={4}
          className="mt-3 w-full resize-y rounded-lg border border-[#CBD5E1] bg-white px-3 py-3 text-sm text-[#172033] outline-none placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
        />
      </section>

      <section className="flex items-start gap-3 rounded-xl border-2 border-[#93C5FD] bg-[#EFF6FF] p-4 sm:p-5">
        <AlertTriangle
          size={18}
          className="mt-0.5 shrink-0 text-[#1D4ED8]"
        />

        <p className="text-sm font-semibold leading-6 text-[#1E3A5F]">
          AI-generated screening support. Final clinical interpretation remains with the reviewing physician.
        </p>
      </section>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
            <UserCheck size={20} />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#172033]">
              Physician review and disposition
            </p>

            <p className="mt-1 text-xs leading-5 text-[#526174]">
              Confirm finding-level decisions, add a physician comment, then save or approve the report.
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {!approved && (
                <span className="rounded-full bg-[#FFF7ED] px-2.5 py-1 text-[10px] font-semibold text-[#B45309]">
                  Awaiting Clinical Review
                </span>
              )}

              {approved && (
                <span className="rounded-full bg-[#EFF6FF] px-2.5 py-1 text-[10px] font-semibold text-[#1D4ED8]">
                  Doctor Approved
                </span>
              )}

              {shared && (
                <span className="rounded-full bg-[#F0FDF4] px-2.5 py-1 text-[10px] font-semibold text-[#15803D]">
                  Shared with Patient
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={approved}
              className="inline-flex items-center gap-2 rounded-lg border border-[#CBD5E1] bg-white px-3 py-2.5 text-xs font-semibold text-[#334155] hover:bg-[#F8FAFC] disabled:opacity-50"
            >
              <Save size={14} />
              Save Draft
            </button>

            <button
              type="button"
              onClick={() => handleApprove(false)}
              disabled={approved}
              className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-3 py-2.5 text-xs font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-50"
            >
              <CheckCircle2 size={14} />
              Approve Report
            </button>

            <button
              type="button"
              onClick={() => handleApprove(true)}
              disabled={shared}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1E3A5F] px-3 py-2.5 text-xs font-semibold text-white hover:bg-[#172F4D] disabled:opacity-50"
            >
              <Send size={14} />
              Approve & Share with Patient
            </button>
          </div>
        </div>
      </section>

      <p className="text-center text-[10px] text-[#94A3B8]">
        Simulated clinical decision-support report · Not an autonomous diagnosis
      </p>
    </div>
  )
}

function ReportMeta({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <p className="text-[9px] font-semibold uppercase tracking-wider text-[#7B8794]">
        {label}
      </p>

      <p className="mt-1 max-w-44 text-xs font-semibold text-[#334155]">
        {value}
      </p>
    </div>
  )
}

function ReportKpi({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="border-r border-[#E2E8F0] p-4 text-center last:border-0 sm:p-5">
      <p className="text-lg font-bold tabular-nums text-[#172033]">
        {value}
      </p>

      <p className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-[#7B8794]">
        {label}
      </p>
    </div>
  )
}

function FindingMeta({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-md bg-[#F8FAFC] px-3 py-2">
      <p className="text-[9px] uppercase tracking-wider text-[#7B8794]">
        {label}
      </p>

      <p className="mt-1 text-[10px] font-semibold text-[#334155]">
        {value}
      </p>
    </div>
  )
}

function ReviewButton({
  label,
  icon: Icon,
  danger,
  active,
  onClick,
}: {
  label: string
  icon?: typeof Check
  danger?: boolean
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-2 text-[10px] font-semibold transition ${
        active
          ? danger
            ? 'border-red-200 bg-red-50 text-red-700'
            : 'border-blue-200 bg-blue-50 text-blue-700'
          : danger
            ? 'border-[#E2E8F0] bg-white text-[#B91C1C] hover:bg-red-50'
            : 'border-[#E2E8F0] bg-white text-[#526174] hover:bg-[#F8FAFC]'
      }`}
    >
      {Icon ? <Icon size={12} /> : null}
      {label}
    </button>
  )
}

function FusionBlock({
  label,
  value,
  emphasis,
}: {
  label: string
  value: string
  emphasis?: boolean
}) {
  return (
    <div
      className={`rounded-lg border p-3 text-center ${
        emphasis
          ? 'border-[#BFDBFE] bg-[#EFF6FF]'
          : 'border-[#E2E8F0] bg-[#F8FAFC]'
      }`}
    >
      <p
        className={`text-[10px] font-semibold ${
          emphasis
            ? 'text-[#1D4ED8]'
            : 'text-[#334155]'
        }`}
      >
        {label}
      </p>

      <p className="mt-1 text-[9px] text-[#7B8794]">
        {value}
      </p>
    </div>
  )
}