import React, { useState, useEffect } from 'react'

interface ReadingProgressProps {
  target?: string // CSS selector for content area
}

export const ReadingProgress: React.FC<ReadingProgressProps> = ({ 
  target = 'article, .prose, main' 
}) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const contentElement = document.querySelector(target)
      if (!contentElement) return

      const rect = contentElement.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const contentHeight = rect.height
      const contentTop = rect.top

      // Calculate how much of the content has been read
      const scrolled = Math.max(0, -contentTop)
      const totalScrollable = Math.max(0, contentHeight - windowHeight)
      const progressPercent = totalScrollable > 0 ? (scrolled / totalScrollable) * 100 : 0

      setProgress(Math.min(100, Math.max(0, progressPercent)))
    }

    window.addEventListener('scroll', updateProgress)
    window.addEventListener('resize', updateProgress)
    updateProgress()

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [target])

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-40">
      <div 
        className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}