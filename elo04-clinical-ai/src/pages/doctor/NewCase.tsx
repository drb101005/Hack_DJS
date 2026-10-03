import { useMemo, useRef, useState } from 'react'
import {
  Activity,
  ArrowLeft,
  Check,
  ChevronDown,
  FileText,
  Image,
  Loader2,
  ScanLine,
  Sparkles,
  Upload,
  X,
  Zap,
} from 'lucide-react'
import { mockPatients } from '../../data/patients'
import type { Patient } from '../../types'

interface NewCaseProps {
  selectedPatient?: Patient | null
  onBack: () => void
  onCaseCreated: (caseId: string) => void
}

type Modality = 'MRI' | 'CT' | 'X-Ray' | 'ECG' | 'PDF'

interface UploadedFile {
  id: string
  name: string
  size: string
  modality: Modality
  status: 'ready' | 'processing' | 'complete'
  progress: number
  detected?: boolean
}

const modalityCards = [
  {
    type: 'MRI' as Modality,
    title: 'MRI',
    description: 'Brain, spine and soft-tissue imaging',
    accept: 'DICOM, PNG, JPG',
  },
  {
    type: 'CT' as Modality,
    title: 'CT',
    description: 'Computed tomography studies',
    accept: 'DICOM, PNG, JPG',
  },
  {
    type: 'X-Ray' as Modality,
    title: 'X-Ray',
    description: 'Chest, bone and radiographic images',
    accept: 'PNG, JPG, JPEG',
  },
  {
    type: 'ECG' as Modality,
    title: 'ECG',
    description: 'Electrocardiogram waveform records',
    accept: 'PDF, CSV, JSON',
  },
  {
    type: 'PDF' as Modality,
    title: 'Reports',
    description: 'Lab reports and clinical documents',
    accept: 'PDF, TXT',
  },
]

const mockFiles: Record<Modality, { name: string; size: string }> = {
  MRI: {
    name: 'brain_mri_2026_03_18.dcm',
    size: '18.4 MB',
  },
  CT: {
    name: 'chest_ct_axial_series.zip',
    size: '42.8 MB',
  },
  'X-Ray': {
    name: 'chest_xray_pa_view.png',
    size: '4.2 MB',
  },
  ECG: {
    name: 'ecg_resting_2026_03_18.pdf',
    size: '1.8 MB',
  },
  PDF: {
    name: 'clinical_history_and_labs.pdf',
    size: '3.6 MB',
  },
}

function getIcon(modality: Modality) {
  if (modality === 'ECG') return Activity
  if (modality === 'PDF') return FileText
  return Image
}

function detectModality(fileName: string): Modality {
  const name = fileName.toLowerCase()

  if (name.includes('mri') || name.includes('brain')) return 'MRI'
  if (name.includes('ct') || name.includes('tomograph')) return 'CT'
  if (name.includes('xray') || name.includes('x-ray') || name.includes('chest')) {
    return 'X-Ray'
  }
  if (name.includes('ecg') || name.includes('ekg')) return 'ECG'

  return 'PDF'
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function NewCase({
  selectedPatient,
  onBack,
  onCaseCreated,
}: NewCaseProps) {
  const [patientId, setPatientId] = useState(
    selectedPatient?.id ?? '',
  )
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [scannerOpen, setScannerOpen] = useState(false)
  const [scannerRunning, setScannerRunning] = useState(false)
  const [scannerComplete, setScannerComplete] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [caseCreated, setCaseCreated] = useState(false)
  const [caseId, setCaseId] = useState('')
  const [notes, setNotes] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const patient = useMemo(
    () => mockPatients.find((item) => item.id === patientId),
    [patientId],
  )

  const addMockFile = (modality: Modality) => {
    const mock = mockFiles[modality]

    setFiles((current) => [
      ...current,
      {
        id: `${modality}-${Date.now()}-${Math.random()}`,
        name: mock.name,
        size: mock.size,
        modality,
        status: 'ready',
        progress: 0,
      },
    ])
  }

  const addRealFiles = (incoming: FileList | File[]) => {
    const newFiles = Array.from(incoming).map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      name: file.name,
      size: formatFileSize(file.size),
      modality: detectModality(file.name),
      status: 'ready' as const,
      progress: 0,
      detected: true,
    }))

    setFiles((current) => [...current, ...newFiles])
  }

  const removeFile = (id: string) => {
    setFiles((current) => current.filter((file) => file.id !== id))
  }

  const runScanner = () => {
    setScannerRunning(true)
    setScannerComplete(false)

    window.setTimeout(() => {
      setScannerRunning(false)
      setScannerComplete(true)

      const scannedFile: UploadedFile = {
        id: `scan-${Date.now()}`,
        name: 'scanned_clinical_document.pdf',
        size: '2.4 MB',
        modality: 'PDF',
        status: 'complete',
        progress: 100,
        detected: true,
      }

      setFiles((current) => [...current, scannedFile])
    }, 1800)
  }

  const processCase = () => {
    if (!patient || files.length === 0) return

    setProcessing(true)

    setFiles((current) =>
      current.map((file) => ({
        ...file,
        status: 'processing',
        progress: 10,
      })),
    )

    let progress = 10

    const interval = window.setInterval(() => {
      progress += 30

      setFiles((current) =>
        current.map((file) => ({
          ...file,
          progress: Math.min(progress, 100),
          status: progress >= 100 ? 'complete' : 'processing',
        })),
      )

      if (progress >= 100) {
        window.clearInterval(interval)

        const generatedCaseId = `CASE-${Math.floor(
          3000 + Math.random() * 999,
        )}`

        window.setTimeout(() => {
          setCaseId(generatedCaseId)
          setCaseCreated(true)
          setProcessing(false)
        }, 500)
      }
    }, 550)
  }

  const resetCase = () => {
    setFiles([])
    setNotes('')
    setCaseCreated(false)
    setCaseId('')
    setScannerComplete(false)
  }

  if (caseCreated) {
    return (
      <div className="max-w-4xl mx-auto">
        <section className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-8 sm:p-10 text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
            <Check size={30} className="text-emerald-400" />
          </div>

          <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 mt-6">
            Case Created
          </p>

          <h1 className="text-2xl sm:text-3xl font-semibold text-white mt-2">
            Screening case is ready
          </h1>

          <p className="text-sm text-gray-500 mt-3 max-w-lg mx-auto leading-relaxed">
            The multimodal intake pipeline has accepted the uploaded data.
            Modality detection, model routing and patient-centric evidence
            retrieval can now be simulated.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 text-left">
            <div className="rounded-xl bg-white/[0.025] border border-white/[0.05] p-4">
              <p className="text-[10px] uppercase tracking-wider text-gray-600">
                Case
              </p>
              <p className="text-sm text-cyan-300 mt-2 font-mono">
                {caseId}
              </p>
            </div>

            <div className="rounded-xl bg-white/[0.025] border border-white/[0.05] p-4">
              <p className="text-[10px] uppercase tracking-wider text-gray-600">
                Patient
              </p>
              <p className="text-sm text-gray-300 mt-2">
                {patient?.name}
              </p>
            </div>

            <div className="rounded-xl bg-white/[0.025] border border-white/[0.05] p-4">
              <p className="text-[10px] uppercase tracking-wider text-gray-600">
                Inputs
              </p>
              <p className="text-sm text-gray-300 mt-2">
                {files.length} files
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
            <button
              type="button"
              onClick={() => onCaseCreated(caseId)}
              className="inline-flex items-center justify-center gap-2 bg-cyan-400 text-black font-semibold text-sm px-5 py-3 rounded-xl hover:bg-cyan-300 transition"
            >
              <Sparkles size={16} />
              Continue to AI Analysis
            </button>

            <button
              type="button"
              onClick={resetCase}
              className="inline-flex items-center justify-center gap-2 border border-white/10 text-gray-300 text-sm px-5 py-3 rounded-xl hover:bg-white/5 transition"
            >
              Create Another Case
            </button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-cyan-300 transition mb-4"
          >
            <ArrowLeft size={14} />
            Back
          </button>

          <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400">
            Clinical Intake
          </p>

          <h1 className="text-2xl font-semibold text-white mt-1">
            New Case Screening
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Upload multimodal clinical data for simulated AI screening.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-400/5 border border-emerald-400/10">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-300">
            AI intake pipeline ready
          </span>
        </div>
      </div>

      <section className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-9 w-9 rounded-lg bg-cyan-400/10 flex items-center justify-center">
            <Activity size={17} className="text-cyan-400" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">
              Patient
            </h2>
            <p className="text-xs text-gray-600 mt-0.5">
              Select the patient whose historical context will be used by RAG.
            </p>
          </div>
        </div>

        <div className="relative">
          <select
            value={patientId}
            onChange={(event) => setPatientId(event.target.value)}
            className="w-full appearance-none bg-[#090e18] border border-white/[0.07] rounded-xl px-4 py-3 pr-10 text-sm text-gray-300 outline-none focus:border-cyan-400/30"
          >
            <option value="">Select a patient...</option>

            {mockPatients.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} — {item.id} — {item.condition}
              </option>
            ))}
          </select>

          <ChevronDown
            size={16}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
          />
        </div>

        {patient && (
          <div className="mt-4 rounded-xl bg-cyan-400/[0.04] border border-cyan-400/10 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-cyan-400/10 flex items-center justify-center shrink-0">
              <span className="text-sm font-semibold text-cyan-300">
                {patient.name
                  .split(' ')
                  .map((name) => name[0])
                  .join('')
                  .slice(0, 2)}
              </span>
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium text-gray-200">
                {patient.name}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {patient.age} years • {patient.gender} •{' '}
                {patient.bloodGroup} • {patient.condition}
              </p>
            </div>

            <span className="text-[10px] px-2.5 py-1.5 rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/10">
              {patient.status}
            </span>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <h2 className="text-sm font-semibold text-white">
              Multimodal Inputs
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Add real files or use simulated demo files for the hackathon.
            </p>
          </div>

          <span className="text-xs text-gray-600">
            {files.length} input{files.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
          {modalityCards.map((card) => {
            const Icon = getIcon(card.type)

            return (
              <button
                key={card.type}
                type="button"
                onClick={() => addMockFile(card.type)}
                className="text-left bg-[#0d1320] border border-white/[0.07] rounded-2xl p-4 hover:border-cyan-400/20 hover:bg-cyan-400/[0.025] transition group"
              >
                <div className="flex items-center justify-between">
                  <div className="h-9 w-9 rounded-lg bg-white/[0.04] flex items-center justify-center group-hover:bg-cyan-400/10 transition">
                    <Icon
                      size={17}
                      className="text-gray-500 group-hover:text-cyan-400"
                    />
                  </div>

                  <Upload
                    size={14}
                    className="text-gray-700 group-hover:text-cyan-400"
                  />
                </div>

                <p className="text-sm font-medium text-gray-200 mt-4">
                  {card.title}
                </p>

                <p className="text-[11px] text-gray-600 leading-relaxed mt-1">
                  {card.description}
                </p>

                <p className="text-[10px] text-gray-700 mt-3">
                  {card.accept}
                </p>
              </button>
            )
          })}
        </div>
      </section>

      <section
        className={`rounded-2xl border border-dashed p-7 sm:p-10 text-center transition ${
          isDragging
            ? 'border-cyan-400/50 bg-cyan-400/[0.05]'
            : 'border-white/10 bg-[#0d1320]'
        }`}
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragging(false)
          addRealFiles(event.dataTransfer.files)
        }}
      >
        <div className="mx-auto h-12 w-12 rounded-xl bg-cyan-400/10 flex items-center justify-center">
          <Upload size={21} className="text-cyan-400" />
        </div>

        <h3 className="text-sm font-semibold text-white mt-4">
          Drop clinical files here
        </h3>

        <p className="text-xs text-gray-600 mt-1">
          DICOM, images, ECG data and PDF reports are supported in the demo.
        </p>

        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(event) => {
            if (event.target.files) {
              addRealFiles(event.target.files)
            }

            event.target.value = ''
          }}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-5 px-4 py-2.5 rounded-xl border border-white/10 text-xs text-gray-300 hover:bg-white/5 transition"
        >
          Browse Files
        </button>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="bg-[#0d1320] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Intake Queue
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                Files awaiting multimodal processing
              </p>
            </div>

            {files.length > 0 && (
              <button
                type="button"
                onClick={() => setFiles([])}
                className="text-[10px] text-gray-600 hover:text-red-300 transition"
              >
                Clear all
              </button>
            )}
          </div>

          {files.length === 0 ? (
            <div className="p-10 text-center">
              <FileText
                size={25}
                className="mx-auto text-gray-700"
              />
              <p className="text-xs text-gray-600 mt-3">
                No files added yet.
              </p>
              <p className="text-[10px] text-gray-700 mt-1">
                Click a modality above to add a simulated clinical file.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {files.map((file) => {
                const Icon = getIcon(file.modality)

                return (
                  <div
                    key={file.id}
                    className="p-4 flex items-center gap-3"
                  >
                    <div className="h-10 w-10 rounded-xl bg-white/[0.035] flex items-center justify-center shrink-0">
                      <Icon size={17} className="text-cyan-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs font-medium text-gray-300 truncate">
                          {file.name}
                        </p>

                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-400/10 text-cyan-300">
                          {file.modality}
                        </span>

                        {file.detected && (
                          <span className="text-[9px] text-emerald-400">
                            detected
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-gray-700">
                          {file.size}
                        </span>

                        <span className="text-[10px] text-gray-700">
                          •
                        </span>

                        <span className="text-[10px] text-gray-600">
                          {file.status === 'complete'
                            ? 'Ready'
                            : file.status === 'processing'
                              ? `Processing ${file.progress}%`
                              : 'Ready for processing'}
                        </span>
                      </div>

                      {file.status === 'processing' && (
                        <div className="h-1 bg-white/[0.04] rounded-full mt-2 overflow-hidden">
                          <div
                            className="h-full bg-cyan-400 rounded-full transition-all"
                            style={{
                              width: `${file.progress}%`,
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      disabled={processing}
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-700 hover:text-red-300 hover:bg-red-400/5 transition disabled:opacity-30"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <section className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-violet-400/10 flex items-center justify-center">
                <ScanLine size={17} className="text-violet-400" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-white">
                  Document Scanner
                </h2>

                <p className="text-xs text-gray-600 mt-0.5">
                  OCR + modality detection simulation
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-white/[0.025] border border-white/[0.05] p-4 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-gray-600">
                  Scanner Status
                </span>

                <span
                  className={`text-[10px] ${
                    scannerRunning
                      ? 'text-amber-400'
                      : scannerComplete
                        ? 'text-emerald-400'
                        : 'text-gray-600'
                  }`}
                >
                  {scannerRunning
                    ? 'Scanning'
                    : scannerComplete
                      ? 'Complete'
                      : 'Ready'}
                </span>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed mt-3">
                Simulates extracting text, identifying document type and
                attaching the result to the patient record.
              </p>

              <button
                type="button"
                onClick={() => {
                  setScannerOpen(true)
                  setScannerComplete(false)
                }}
                disabled={scannerRunning}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-violet-400/10 text-violet-300 border border-violet-400/10 rounded-xl py-2.5 text-xs hover:bg-violet-400/15 transition disabled:opacity-40"
              >
                <ScanLine size={14} />
                Open Scanner
              </button>
            </div>
          </section>

          <section className="bg-[#0d1320] border border-white/[0.07] rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-amber-400/10 flex items-center justify-center">
                <Zap size={17} className="text-amber-400" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-white">
                  Clinical Context
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  Optional screening note
                </p>
              </div>
            </div>

            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Example: Compare current imaging with previous chest X-ray..."
              rows={4}
              className="w-full mt-4 resize-none bg-[#090e18] border border-white/[0.07] rounded-xl px-3 py-3 text-xs text-gray-300 placeholder:text-gray-700 outline-none focus:border-cyan-400/30"
            />
          </section>
        </div>
      </section>

      <section className="bg-cyan-400/[0.035] border border-cyan-400/10 rounded-2xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-cyan-400" />
              <p className="text-sm font-medium text-cyan-200">
                Multimodal AI pipeline
              </p>
            </div>

            <p className="text-xs text-gray-600 mt-1.5">
              The demo will simulate modality detection, model routing,
              inference and evidence retrieval after intake.
            </p>
          </div>

          <button
            type="button"
            onClick={processCase}
            disabled={!patient || files.length === 0 || processing}
            className="inline-flex items-center justify-center gap-2 bg-cyan-400 text-black font-semibold text-sm px-5 py-3 rounded-xl hover:bg-cyan-300 transition disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
          >
            {processing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing Intake...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Create Screening Case
              </>
            )}
          </button>
        </div>
      </section>

      {scannerOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0d1320] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-violet-400">
                  Document Intelligence
                </p>
                <h2 className="text-lg font-semibold text-white mt-1">
                  Clinical Document Scanner
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setScannerOpen(false)}
                disabled={scannerRunning}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-300 hover:bg-white/5 disabled:opacity-30"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6">
              {!scannerRunning && !scannerComplete && (
                <>
                  <div className="rounded-2xl border border-dashed border-violet-400/20 bg-violet-400/[0.035] p-8 text-center">
                    <ScanLine
                      size={30}
                      className="mx-auto text-violet-400"
                    />

                    <p className="text-sm text-gray-300 mt-4">
                      Scanner is ready
                    </p>

                    <p className="text-xs text-gray-600 mt-1">
                      Simulated OCR, document classification and clinical
                      entity extraction.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={runScanner}
                    className="w-full mt-5 bg-violet-400 text-black font-semibold text-sm py-3 rounded-xl hover:bg-violet-300 transition"
                  >
                    Start Scan
                  </button>
                </>
              )}

              {scannerRunning && (
                <div className="py-8 text-center">
                  <div className="mx-auto h-16 w-16 rounded-2xl bg-violet-400/10 flex items-center justify-center">
                    <Loader2
                      size={27}
                      className="text-violet-400 animate-spin"
                    />
                  </div>

                  <p className="text-sm text-gray-200 mt-5">
                    Scanning clinical document...
                  </p>

                  <div className="max-w-xs mx-auto h-1.5 bg-white/[0.05] rounded-full mt-4 overflow-hidden">
                    <div className="h-full w-2/3 bg-violet-400 rounded-full animate-pulse" />
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-6 text-left">
                    {[
                      ['OCR', '98.7%'],
                      ['Entities', '14'],
                      ['Type', 'Clinical PDF'],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-xl bg-white/[0.025] border border-white/[0.05] p-3"
                      >
                        <p className="text-[9px] uppercase tracking-wider text-gray-700">
                          {label}
                        </p>
                        <p className="text-xs text-gray-300 mt-1">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {scannerComplete && (
                <div>
                  <div className="flex items-center gap-3 rounded-xl bg-emerald-400/[0.04] border border-emerald-400/10 p-4">
                    <div className="h-9 w-9 rounded-lg bg-emerald-400/10 flex items-center justify-center">
                      <Check size={17} className="text-emerald-400" />
                    </div>

                    <div>
                      <p className="text-sm text-emerald-300">
                        Scan completed
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Document classified and added to the intake queue.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    {[
                      ['Document Type', 'Clinical Report'],
                      ['OCR Confidence', '98.7%'],
                      ['Entities Extracted', '14'],
                      ['Detected Modality', 'PDF / Clinical Text'],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between rounded-lg bg-white/[0.025] px-3 py-2.5"
                      >
                        <span className="text-xs text-gray-600">
                          {label}
                        </span>
                        <span className="text-xs text-gray-300">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setScannerOpen(false)}
                    className="w-full mt-5 bg-cyan-400 text-black font-semibold text-sm py-3 rounded-xl hover:bg-cyan-300 transition"
                  >
                    Add to Case
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
