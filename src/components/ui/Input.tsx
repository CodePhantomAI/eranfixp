import React from 'react'
import { cn } from '../../lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
  const errorId = error ? `${inputId}-error` : undefined

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'block w-full px-4 py-3 sm:py-3.5 text-base border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          'transition-colors min-h-[48px] sm:min-h-[52px]',
          'dark:bg-gray-800 dark:text-white dark:placeholder-gray-400',
          error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
          className
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={errorId}
        {...props}
      />
      {error && (
        <p
          id={errorId}
          className="text-sm sm:text-base text-red-600 dark:text-red-400 flex items-start"
          role="alert"
        >
          <span className="font-medium">שגיאה:</span>
          <span className="mr-1">{error}</span>
        </p>
      )}
    </div>
  )
}