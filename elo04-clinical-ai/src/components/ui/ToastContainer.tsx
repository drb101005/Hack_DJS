import {
  AlertCircle,
  CheckCircle2,
  Info,
  X,
  AlertTriangle,
} from 'lucide-react'
import { useToast, type ToastType } from '../../context/ToastContext'

const iconMap: Record<ToastType, React.ElementType> = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
}

const colorMap: Record<ToastType, string> = {
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  info: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  error: 'border-red-500/30 bg-red-500/10 text-red-300',
}

export default function ToastContainer() {
  const { toasts, dismissToast } = useToast()

  return (
    <div className="fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type]

        return (
          <div
            key={toast.id}
            className={`rounded-2xl border p-4 shadow-2xl backdrop-blur-xl ${colorMap[toast.type]}`}
          >
            <div className="flex items-start gap-3">
              <Icon className="mt-0.5 h-5 w-5 shrink-0" />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">
                  {toast.title}
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-400">
                  {toast.message}
                </p>
              </div>

              <button
                onClick={() => dismissToast(toast.id)}
                className="rounded-lg p-1 text-gray-500 transition hover:bg-white/5 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}