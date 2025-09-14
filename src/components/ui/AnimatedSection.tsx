import React, { useRef, useEffect, useState } from 'react'
import { cn } from '../../lib/utils'

interface AnimatedSectionProps {
  children: React.ReactNode
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale'
  delay?: number
  className?: string
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  animation = 'fadeIn',
  delay = 0,
  className
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  const animations = {
    fadeIn: isVisible ? 'opacity-100' : 'opacity-0',
    slideUp: isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
    slideLeft: isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8',
    slideRight: isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8',
    scale: isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
  }

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        animations[animation],
        className
      )}
    >
      {children}
    </div>
  )
}