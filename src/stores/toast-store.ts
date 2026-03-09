import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration: number
}

interface ToastState {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

const MAX_TOASTS = 5

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  addToast: (toast) =>
    set((state) => {
      const id = crypto.randomUUID()
      const newToasts = [...state.toasts, { ...toast, id }]
      if (newToasts.length > MAX_TOASTS) {
        return { toasts: newToasts.slice(newToasts.length - MAX_TOASTS) }
      }
      return { toasts: newToasts }
    }),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}))

export function showSuccess(message: string) {
  useToastStore.getState().addToast({ type: 'success', message, duration: 3000 })
}

export function showError(message: string) {
  useToastStore.getState().addToast({ type: 'error', message, duration: 5000 })
}

export function showInfo(message: string) {
  useToastStore.getState().addToast({ type: 'info', message, duration: 3000 })
}

export function showWarning(message: string) {
  useToastStore.getState().addToast({ type: 'warning', message, duration: 5000 })
}
