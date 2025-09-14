import React from 'react'
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react'
import { cn } from '../../lib/utils'

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  onClose: () => void
  autoClose?: boolean
  duration?: number
}

export const Toast: React.FC<ToastProps> = ({
  type,
  title,
  message,
  onClose,
  autoClose = true,
  duration = 4000
}) => {
  React.useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [autoClose, duration, onClose])

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info
  }

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }

  const iconStyles = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500'
  }

  const Icon = icons[type]

  return (
    <div className={cn(
      'fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border animate-in slide-in-from-top-2',
      styles[type]
    )}>
      <div className="p-4">
        <div className="flex items-start">
          <Icon className={cn('w-5 h-5 mt-0.5 ml-3', iconStyles[type])} />
          <div className="flex-1">
            <h4 className="font-semibold">{title}</h4>
            {message && (
              <p className="text-sm mt-1 opacity-90">{message}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}