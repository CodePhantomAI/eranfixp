import React, { useState } from 'react'
import { cn } from '../../lib/utils'

interface TooltipProps {
  children: React.ReactNode
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  className
}) => {
  const [isVisible, setIsVisible] = useState(false)

  const positions = {
    top: 'bottom-full mb-2 left-1/2 transform -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 transform -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 transform -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 transform -translate-y-1/2'
  }

  const arrows = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-900',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-900',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-900',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-900'
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={cn(
          'absolute z-50 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap pointer-events-none',
          positions[position],
          className
        )}>
          {content}
          <div className={cn('absolute w-0 h-0 border-4 border-transparent', arrows[position])} />
        </div>
      )}
    </div>
  )
}