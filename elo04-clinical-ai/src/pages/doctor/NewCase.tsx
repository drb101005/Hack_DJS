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
  onCaseCreated: (caseId: string, modalities: string[]) => void
}

type Modality = 'MRI' | 'CT' | 'X-Ray' | 'ECG' | 'PDF'

interface UploadedFile {
  id: string
  name: string
  size: string
  type: string
  modality: Modality
  status: 'inspecting' | 'ready' | 'processing' | 'complete'
  progress: number
  detected: boolean
  details: string[]
  preview?: string
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
  MRI: { name: 'brain_mri_2026_03_18.dcm', size: '18.4 MB' },
  CT: { name: 'chest_ct_axial_series.zip', size: '42.8 MB' },
  'X-Ray': { name: 'chest_xray_pa_view.png', size: '4.2 MB' },
  ECG: { name: 'ecg_resting_2026_03_18.pdf', size: '1.8 MB' },
  PDF: { name: 'clinical_history_and_labs.pdf', size: '3.6 MB' },
}

function detectModality(fileName: string, mimeType = ''): Modality {
  const name = fileName.toLowerCase()
  const type = mimeType.toLowerCase()

  if (name.includes('mri') || name.includes('brain')) return 'MRI'
  if (name.includes('ct') || name.includes('tomograph')) return 'CT'
  if (
    name.includes('xray') ||
    name.includes('x-ray') ||
    name.includes('chest') ||
    type.includes('image/')
  ) {
    return 'X-Ray'
  }
  if (name.includes('ecg') || name.includes('ekg') || name.includes('electrocard')) {
    return 'ECG'
  }

  if (
    type.includes('text/') ||
    type.includes('pdf') ||
    name.endsWith('.pdf') ||
    name.endsWith('.txt') ||
    name.endsWith('.csv') ||
    name.endsWith('.json')
  ) {
    return 'PDF'
  }

  return 'PDF'
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getIcon(modality: Modality) {
  if (modality === 'ECG') return Activity
  if (modality === 'PDF') return FileText
  return Image
}

async function inspectFile(file: File): Promise<UploadedFile> {
  const modality = detectModality(file.name, file.type)
  const details = [
    `File type: ${file.type || 'Unknown / browser-detected'}`,
    `Size: ${formatFileSize(file.size)}`,
    `Modified: ${new Date(file.lastModified).toLocaleString()}`,
    `Detected modality: ${modality}`,
  ]

  let preview: string | undefined

  if (file.type.startsWith('image/')) {
    preview = URL.createObjectURL(file)

    try {
      const dimensions = await new Promise<{ width: number; height: number }>(
        (resolve, reject) => {
          const image = new window.Image()
          image.onload = () =>
            resolve({
              width: image.naturalWidth,
              height: image.naturalHeight,
            })
          image.onerror = reject
          image.src = preview!
        },
      )

      details.push(`Image dimensions: ${dimensions.width} × ${dimensions.height}px`)
      details.push('Visual preview: available')
    } catch {
      details.push('Visual preview: available')
    }
  } else if (
    file.type.startsWith('text/') ||
    /\.(txt|csv|json)$/i.test(file.name)
  ) {
    try {
      const text = await file.text()
      const lines = text.split(/\r?\n/).filter(Boolean)
      details.push(`Extracted characters: ${text.length.toLocaleString()}`)
      details.push(`Extracted lines: ${lines.length.toLocaleString()}`)

      if (/\.csv$/i.test(file.name)) {
        const columns = lines[0]?.split(',').length ?? 0
        details.push(`CSV columns detected: ${columns}`)

        const numericValues = text
          .split(/[,;\s]+/)
          .map(Number)
          .filter((value) => Number.isFinite(value))

        if (numericValues.length > 10) {
          const min = Math.min(...numericValues)
          const max = Math.max(...numericValues)
          const avg =
            numericValues.reduce((sum, value) => sum + value, 0) /
            numericValues.length

          details.push(`Numeric samples: ${numericValues.length}`)
          details.push(`Sample range: ${min.toFixed(2)} – ${max.toFixed(2)}`)
          details.push(`Sample mean: ${avg.toFixed(2)}`)
        }
      }

      const previewText = text.replace(/\s+/g, ' ').trim().slice(0, 140)
      if (previewText) {
        details.push(`Content preview: ${previewText}`)
      }
    } catch {
      details.push('Text extraction unavailable')
    }
  } else if (/\.pdf$/i.test(file.name) || file.type.includes('pdf')) {
    details.push('PDF detected')
    details.push('Clinical document metadata extracted')
    details.push('OCR / NLP interpretation will be simulated in this prototype')
  } else if (/\.dcm$/i.test(file.name)) {
    details.push('DICOM file detected')
    details.push('DICOM modality metadata inspection queued')
    details.push('Clinical interpretation will be simulated in this prototype')
  } else {
    details.push('File accepted')
    details.push('Format requires clinical review before interpretation')
  }

  return {
    id: `${file.name}-${file.lastModified}-${Math.random()}`,
    name: file.name,
    size: formatFileSize(file.size),
    type: file.type || 'Unknown',
    modality,
    status: 'ready',
    progress: 100,
    detected: true,
    details,
    preview,
  }
}

export default function NewCase({
  selectedPatient,
  onBack,
  onCaseCreated,
}: NewCaseProps) {
  const [patientId, setPatientId] = useState(selectedPatient?.id ?? '')
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [scannerOpen, setScannerOpen] = useState(false)
  const [scannerRunning, setScannerRunning] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [caseCreated, setCaseCreated] = useState(false)
  const [caseId, setCaseId] = useState('')
  const [notes, setNotes] = useState('')
  const [activeFileId, setActiveFileId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const patient = useMemo(
    () => mockPatients.find((item) => item.id === patientId),
    [patientId],
  )

  const activeFile = files.find((file) => file.id === activeFileId) ?? files[0]

  const addMockFile = (modality: Modality) => {
    const mock = mockFiles[modality]

    const file: UploadedFile = {
      id: `${modality}-${Date.now()}-${Math.random()}`,
      name: mock.name,
      size: mock.size,
      type: 'Simulated demo input',
      modality,
      status: 'ready',
      progress: 100,
      detected: true,
      details: [
        `File type: Simulated demo input`,
        `Size: ${mock.size}`,
        `Detected modality: ${modality}`,
        'Demo metadata generated locally',
      ],
    }

    setFiles((current) => [...current, file])
    setActiveFileId(file.id)
  }

  const addRealFiles = async (incoming: FileList | File[]) => {
    const selected = Array.from(incoming)

    for (const file of selected) {
      const id = `${file.name}-${file.lastModified}-${Math.random()}`

      setFiles((current) => [
        ...current,
        {
          id,
          name: file.name,
          size: formatFileSize(file.size),
          type: file.type || 'Unknown',
          modality: detectModality(file.name, file.type),
          status: 'inspecting',
          progress: 35,
          detected: false,
          details: ['File received', 'Inspecting browser file metadata...'],
        },
      ])

      setActiveFileId(id)

      const inspected = await inspectFile(file)

      setFiles((current) =>
        current.map((item) =>
          item.id === id ? { ...inspected, id } : item,
        ),
      )
    }
  }

  const removeFile = (id: string) => {
    const file = files.find((item) => item.id === id)
    if (file?.preview) URL.revokeObjectURL(file.preview)

    setFiles((current) => current.filter((item) => item.id !== id))

    if (activeFileId === id) {
      setActiveFileId(null)
    }
  }

  const runScanner = () => {
    setScannerOpen(true)
    setScannerRunning(true)

    window.setTimeout(() => {
      const scannedFile: UploadedFile = {
        id: `scan-${Date.now()}`,
        name: 'scanned_clinical_document.pdf',
        size: '2.4 MB',
        type: 'application/pdf',
        modality: 'PDF',
        status: 'complete',
        progress: 100,
        detected: true,
        details: [
          'Document scanner input',
          'OCR confidence: 98.7%',
          'Clinical entities detected: 14',
          'Document type: Clinical PDF',
          'NLP extraction simulated locally',
        ],
      }

      setFiles((current) => [...current, scannedFile])
      setActiveFileId(scannedFile.id)
      setScannerRunning(false)
    }, 1800)
  }

  const processCase = () => {
    if (!patient || files.length === 0 || processing) return

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
          3000 + Math.random() * 6999,
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
    files.forEach((file) => {
      if (file.preview) URL.revokeObjectURL(file.preview)
    })

    setFiles([])
    setNotes('')
    setCaseCreated(false)
    setCaseId('')
    setScannerOpen(false)
    setActiveFileId(null)
  }

  if (caseCreated) {
    return (
      <div className="max-w-4xl mx-auto">
        <section className="bg-white border border-[#E2E8F0] rounded-2xl p-8 sm:p-10 text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-[#16A34A]/10 border border-[#16A34A]/20 flex items-center justify-center">
            <Check size={30} className="text-[#16A34A]" />
          </div>

          <p className="text-[10px] uppercase tracking-[0.2em] text-[#16A34A] mt-6">
            Case Created
          </p>

          <h1 className="text-2xl sm:text-3xl font-semibold text-[#172033] mt-2">
            Screening case is ready
          </h1>

          <p className="text-sm text-[#526174] mt-3 max-w-lg mx-auto leading-relaxed">
            The uploaded files were inspected in the browser and attached to
            this simulated multimodal screening workflow.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 text-left">
            <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4">
              <p className="text-[10px] uppercase tracking-wider text-[#7B8794]">
                Case
              </p>
              <p className="text-sm text-[#2563EB] mt-2 font-mono">
                {caseId}
              </p>
            </div>

            <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4">
              <p className="text-[10px] uppercase tracking-wider text-[#7B8794]">
                Patient
              </p>
              <p className="text-sm text-[#334155] mt-2">
                {patient?.name}
              </p>
            </div>

            <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4">
              <p className="text-[10px] uppercase tracking-wider text-[#7B8794]">
                Inputs
              </p>
              <p className="text-sm text-[#334155] mt-2">
                {files.length} files
              </p>
            </div>
          </div>

          <div className="mt-6 text-left rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] p-4">
            <p className="text-xs font-semibold text-[#1E3A5F] mb-3">
              Uploaded clinical data
            </p>

            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between gap-3 bg-white border border-[#E2E8F0] rounded-lg px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#334155] truncate">
                      {file.name}
                    </p>
                    <p className="text-[10px] text-[#7B8794]">
                      {file.modality} · {file.size}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold text-[#16A34A]">
                    INSPECTED
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
            <button
              type="button"
              onClick={() =>
                onCaseCreated(
                  caseId,
                  [...new Set(files.map((file) => file.modality))],
                )
              }
              className="inline-flex items-center justify-center gap-2 bg-[#2563EB] text-white font-semibold text-sm px-5 py-3 rounded-xl hover:bg-[#1D4ED8] transition"
            >
              <Sparkles size={16} />
              Continue to AI Analysis
            </button>

            <button
              type="button"
              onClick={resetCase}
              className="inline-flex items-center justify-center gap-2 border border-[#E2E8F0] text-[#334155] text-sm px-5 py-3 rounded-xl hover:bg-[#F8FAFC] transition"
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
            className="inline-flex items-center gap-2 text-xs text-[#526174] hover:text-[#2563EB] transition mb-4"
          >
            <ArrowLeft size={14} />
            Back
          </button>

          <p className="text-[10px] uppercase tracking-[0.2em] text-[#2563EB]">
            Clinical Intake
          </p>

          <h1 className="text-2xl font-semibold text-[#172033] mt-1">
            New Case Screening
          </h1>

          <p className="text-sm text-[#526174] mt-1">
            Upload real clinical files and inspect their data before simulated
            AI screening.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#16A34A]/5 border border-[#16A34A]/10">
          <span className="h-2 w-2 rounded-full bg-[#16A34A] animate-pulse" />
          <span className="text-xs text-[#16A34A]">
            AI intake pipeline ready
          </span>
        </div>
      </div>

      <section className="bg-white border border-[#E2E8F0] rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-9 w-9 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
            <Activity size={17} className="text-[#2563EB]" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[#172033]">Patient</h2>
            <p className="text-xs text-[#7B8794] mt-0.5">
              Select the patient whose historical context will be used by RAG.
            </p>
          </div>
        </div>

        <div className="relative">
          <select
            value={patientId}
            onChange={(event) => setPatientId(event.target.value)}
            className="w-full appearance-none bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 pr-10 text-sm text-[#334155] outline-none focus:border-[#2563EB]"
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
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7B8794] pointer-events-none"
          />
        </div>

        {patient && (
          <div className="mt-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] p-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-white flex items-center justify-center shrink-0">
              <span className="text-sm font-semibold text-[#2563EB]">
                {patient.name
                  .split(' ')
                  .map((name) => name[0])
                  .join('')
                  .slice(0, 2)}
              </span>
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium text-[#334155]">
                {patient.name}
              </p>
              <p className="text-xs text-[#7B8794] mt-1">
                {patient.age} years • {patient.gender} • {patient.bloodGroup} •{' '}
                {patient.condition}
              </p>
            </div>

            <span className="text-[10px] px-2.5 py-1.5 rounded-lg bg-white text-[#526174] border border-[#E2E8F0]">
              {patient.status}
            </span>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <h2 className="text-sm font-semibold text-[#172033]">
              Multimodal Inputs
            </h2>
            <p className="text-xs text-[#7B8794] mt-1">
              Upload an actual local file or use a simulated demo input.
            </p>
          </div>

          <span className="text-xs text-[#7B8794]">
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
                className="text-left bg-white border border-[#E2E8F0] rounded-2xl p-4 hover:border-[#93C5FD] hover:bg-[#F8FAFC] transition group"
              >
                <div className="flex items-center justify-between">
                  <div className="h-9 w-9 rounded-lg bg-[#F8FAFC] flex items-center justify-center">
                    <Icon
                      size={17}
                      className="text-[#526174] group-hover:text-[#2563EB]"
                    />
                  </div>

                  <Upload
                    size={14}
                    className="text-[#7B8794] group-hover:text-[#2563EB]"
                  />
                </div>

                <p className="text-sm font-medium text-[#334155] mt-4">
                  {card.title}
                </p>

                <p className="text-[11px] text-[#7B8794] leading-relaxed mt-1">
                  {card.description}
                </p>

                <p className="text-[10px] text-[#7B8794] mt-3">
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
            ? 'border-[#2563EB] bg-[#EFF6FF]'
            : 'border-[#CBD5E1] bg-white'
        }`}
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragging(false)
          void addRealFiles(event.dataTransfer.files)
        }}
      >
        <div className="mx-auto h-12 w-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
          <Upload size={21} className="text-[#2563EB]" />
        </div>

        <h3 className="text-sm font-semibold text-[#172033] mt-4">
          Drop clinical files here
        </h3>

        <p className="text-xs text-[#7B8794] mt-1">
          Real browser file upload — images, DICOM, ECG data, PDFs, TXT, CSV,
          JSON and other files are accepted.
        </p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-5 inline-flex items-center gap-2 bg-[#2563EB] text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-[#1D4ED8] transition"
        >
          <Upload size={14} />
          Choose Local Files
        </button>

        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(event) => {
            if (event.target.files) {
              void addRealFiles(event.target.files)
              event.target.value = ''
            }
          }}
        />
      </section>

      {files.length > 0 && (
        <section className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-[#172033]">
                  Live File Inspection
                </h2>
                <p className="text-xs text-[#7B8794] mt-1">
                  Browser-side metadata and content inspection.
                </p>
              </div>

              <span className="text-[10px] uppercase tracking-wider text-[#2563EB]">
                Live
              </span>
            </div>

            <div className="space-y-3">
              {files.map((file) => {
                const Icon = getIcon(file.modality)

                return (
                  <button
                    key={file.id}
                    type="button"
                    onClick={() => setActiveFileId(file.id)}
                    className={`w-full text-left rounded-xl border p-4 transition ${
                      activeFile?.id === file.id
                        ? 'border-[#93C5FD] bg-[#EFF6FF]'
                        : 'border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-lg bg-[#F8FAFC] flex items-center justify-center shrink-0">
                        <Icon size={16} className="text-[#2563EB]" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-[#334155] truncate">
                              {file.name}
                            </p>
                            <p className="text-[10px] text-[#7B8794] mt-1">
                              {file.modality} · {file.size}
                            </p>
                          </div>

                          <span className="text-[9px] font-semibold text-[#16A34A] shrink-0">
                            {file.status === 'inspecting'
                              ? 'INSPECTING'
                              : 'READY'}
                          </span>
                        </div>

                        <div className="mt-3 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#2563EB] transition-all"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      </div>

                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(event) => {
                          event.stopPropagation()
                          removeFile(file.id)
                        }}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.stopPropagation()
                            removeFile(file.id)
                          }
                        }}
                        className="text-[#94A3B8] hover:text-[#DC2626]"
                      >
                        <X size={15} />
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5">
            <p className="text-[10px] uppercase tracking-wider text-[#2563EB]">
              Extracted Data
            </p>

            <h3 className="text-sm font-semibold text-[#172033] mt-2">
              {activeFile?.name ?? 'No file selected'}
            </h3>

            {activeFile && (
              <>
                {activeFile.preview && (
                  <img
                    src={activeFile.preview}
                    alt={activeFile.name}
                    className="w-full h-40 object-contain rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] mt-4"
                  />
                )}

                <div className="space-y-2 mt-4">
                  {activeFile.details.map((detail, index) => (
                    <div
                      key={`${activeFile.id}-${index}`}
                      className="rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-2"
                    >
                      <p className="text-[10px] text-[#526174]">
                        {detail}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      <section className="bg-white border border-[#E2E8F0] rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
            <FileText size={17} className="text-[#2563EB]" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[#172033]">
              Clinical Context
            </h2>
            <p className="text-xs text-[#7B8794] mt-0.5">
              Optional context passed into the simulated AI and RAG workflow.
            </p>
          </div>
        </div>

        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={4}
          placeholder="Example: patient reports intermittent shortness of breath..."
          className="w-full mt-4 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#334155] outline-none focus:border-[#2563EB] resize-none"
        />
      </section>

      <section className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#2563EB]">
              Intake Pipeline
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {[
                'FILE RECEIVED',
                'INSPECTING',
                'DETECTING MODALITY',
                'EXTRACTING DATA',
                'CLINICAL ANALYSIS READY',
              ].map((stage, index) => (
                <div key={stage} className="flex items-center gap-2">
                  <span className="text-[9px] font-semibold text-[#1E3A5F] bg-white border border-[#BFDBFE] px-2.5 py-1.5 rounded-md">
                    {stage}
                  </span>
                  {index < 4 && (
                    <span className="text-[#93C5FD]">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            disabled={!patient || files.length === 0 || processing}
            onClick={processCase}
            className="inline-flex items-center justify-center gap-2 bg-[#2563EB] text-white font-semibold text-sm px-5 py-3 rounded-xl hover:bg-[#1D4ED8] disabled:opacity-40 disabled:cursor-not-allowed transition shrink-0"
          >
            {processing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing Intake
              </>
            ) : (
              <>
                <Zap size={16} />
                Process Screening Case
              </>
            )}
          </button>
        </div>
      </section>

      <button
        type="button"
        onClick={runScanner}
        className="hidden"
      >
        <ScanLine size={16} />
        Document Scanner
      </button>

      {scannerOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#172033]">
                Document Scanner
              </h2>
              <button
                type="button"
                onClick={() => setScannerOpen(false)}
                className="text-[#7B8794] hover:text-[#172033]"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-6 text-center">
              <ScanLine
                size={42}
                className={`mx-auto text-[#2563EB] ${
                  scannerRunning ? 'animate-pulse' : ''
                }`}
              />

              <p className="text-sm font-medium text-[#334155] mt-4">
                {scannerRunning
                  ? 'Scanning clinical document...'
                  : 'Scan complete'}
              </p>

              <p className="text-xs text-[#7B8794] mt-2">
                OCR 98.7% · 14 entities · Clinical PDF
              </p>

              {!scannerRunning && (
                <button
                  type="button"
                  onClick={() => setScannerOpen(false)}
                  className="mt-5 bg-[#2563EB] text-white text-xs font-semibold px-4 py-2.5 rounded-lg"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
