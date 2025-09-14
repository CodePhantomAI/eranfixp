import React from 'react'
import { cn } from '../../lib/utils'

interface GradientTextProps {
  children: React.ReactNode
  gradient?: 'blue' | 'purple' | 'green' | 'orange' | 'pink'
  className?: string
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  gradient = 'blue',
  className
}) => {
  const gradients = {
    blue: 'bg-gradient-to-r from-blue-600 to-blue-800',
    purple: 'bg-gradient-to-r from-purple-600 to-blue-600',
    green: 'bg-gradient-to-r from-green-600 to-blue-600',
    orange: 'bg-gradient-to-r from-orange-600 to-red-600',
    pink: 'bg-gradient-to-r from-pink-600 to-purple-600'
  }

  return (
    <span className={cn(
      gradients[gradient],
      'bg-clip-text text-transparent',
      className
    )}>
      {children}
    </span>
  )
}