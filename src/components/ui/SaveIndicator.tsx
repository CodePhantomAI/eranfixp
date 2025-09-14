import React, { useState, useEffect } from 'react'
import { Check, Save, AlertTriangle } from 'lucide-react'
import { cn } from '../../lib/utils'

interface SaveIndicatorProps {
  status: 'idle' | 'saving' | 'saved' | 'error'
  lastSaved?: Date
  className?: string
}

export const SaveIndicator: React.FC<SaveIndicatorProps> = ({
  status,
  lastSaved,
  className
}) => {
  const [showSaved, setShowSaved] = useState(false)

  useEffect(() => {
    if (status === 'saved') {
      setShowSaved(true)
      const timer = setTimeout(() => setShowSaved(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [status])

  const getStatusInfo = () => {
    switch (status) {
      case 'saving':
        return {
          icon: Save,
          text: 'שומר...',
          color: 'text-blue-600 bg-blue-50'
        }
      case 'saved':
        return {
          icon: Check,
          text: 'נשמר',
          color: 'text-green-600 bg-green-50'
        }
      case 'error':
        return {
          icon: AlertTriangle,
          text: 'שגיאה',
          color: 'text-red-600 bg-red-50'
        }
      default:
        return null
    }
  }

  const statusInfo = getStatusInfo()

  if (!statusInfo && !lastSaved) return null

  return (
    <div className={cn('flex items-center gap-2 text-sm', className)}>
      {statusInfo && (
        <div className={cn(
          'flex items-center gap-1 px-3 py-1 rounded-full transition-all duration-300',
          statusInfo.color,
          showSaved ? 'scale-110' : 'scale-100'
        )}>
          <statusInfo.icon className="w-4 h-4" />
          <span className="font-medium">{statusInfo.text}</span>
        </div>
      )}
      
      {lastSaved && status === 'idle' && (
        <span className="text-gray-500">
          נשמר לאחרונה: {lastSaved.toLocaleTimeString('he-IL')}
        </span>
      )}
    </div>
  )
}