import React from 'react'
import { cn } from '../../lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'bordered'
  padding?: 'sm' | 'md' | 'lg'
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className,
  ...props
}) => {
  const variants = {
    default: 'bg-white shadow-sm border',
    elevated: 'bg-white shadow-lg border-0',
    bordered: 'bg-white border-2 border-gray-200'
  }

  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-300',
        variants[variant],
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}