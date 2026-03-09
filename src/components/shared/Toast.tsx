import { useEffect, useRef } from 'react'
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'
import { useToastStore } from '../../stores/toast-store'
import type { ToastType } from '../../stores/toast-store'
import './Toast.css'

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={18} />,
  error: <AlertCircle size={18} />,
  info: <Info size={18} />,
  warning: <AlertTriangle size={18} />,
}

function ToastItem({ id, type, message, duration }: {
  id: string
  type: ToastType
  message: string
  duration: number
}) {
  const { removeToast } = useToastStore()
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    timerRef.current = setTimeout(() => removeToast(id), duration)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [id, duration, removeToast])

  return (
    <div className={`toast toast-${type}`}>
      <span className={`toast-icon toast-icon-${type}`}>{ICONS[type]}</span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={() => removeToast(id)}>
        <X size={14} />
      </button>
      <div
        className={`toast-progress toast-progress-${type}`}
        style={{ animationDuration: `${duration}ms` }}
      />
    </div>
  )
}

function ToastContainer() {
  const { toasts } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} />
      ))}
    </div>
  )
}

export default ToastContainer
