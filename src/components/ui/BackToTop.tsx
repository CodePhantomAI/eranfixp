import React, { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'
import { cn } from '../../lib/utils'

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-24 right-6 z-40 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-all duration-300',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      )}
      title="חזור למעלה"
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  )
}