import React, { useRef, useEffect, useState } from 'react'

interface ParallaxSectionProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  speed = 0.5,
  className = ''
}) => {
  const [offset, setOffset] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const scrolled = window.pageYOffset
        const rate = scrolled * -speed
        setOffset(rate)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return (
    <div ref={ref} className={className}>
      <div style={{ transform: `translateY(${offset}px)` }}>
        {children}
      </div>
    </div>
  )
}