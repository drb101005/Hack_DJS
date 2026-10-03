import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type ToastType = 'success' | 'info' | 'warning' | 'error'

export interface ToastItem {
  id: number
  title: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  toasts: ToastItem[]
  showToast: (
    title: string,
    message: string,
    type?: ToastType,
  ) => void
  dismissToast: (id: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(
  null,
)

export function ToastProvider({
  children,
}: {
  children: ReactNode
}) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismissToast = useCallback((id: number) => {
    setToasts((current) =>
      current.filter((toast) => toast.id !== id),
    )
  }, [])

  const showToast = useCallback(
    (
      title: string,
      message: string,
      type: ToastType = 'info',
    ) => {
      const id = Date.now() + Math.floor(Math.random() * 1000)

      setToasts((current) => [
        ...current,
        {
          id,
          title,
          message,
          type,
        },
      ])

      window.setTimeout(() => {
        dismissToast(id)
      }, 4500)
    },
    [dismissToast],
  )

  const value = useMemo(
    () => ({
      toasts,
      showToast,
      dismissToast,
    }),
    [toasts, showToast, dismissToast],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error(
      'useToast must be used inside ToastProvider',
    )
  }

  return context
}