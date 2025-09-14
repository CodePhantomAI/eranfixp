import React, { useState, useEffect } from 'react'
import { List, ChevronRight } from 'lucide-react'

interface TOCItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const [tocItems, setTocItems] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Extract headings from content
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')
    
    const items: TOCItem[] = Array.from(headings).map((heading, index) => {
      const id = `heading-${index}`
      const level = parseInt(heading.tagName.charAt(1))
      const text = heading.textContent || ''
      
      // Add ID to actual DOM element if it exists
      const actualHeading = document.querySelector(`h${level}:nth-of-type(${index + 1})`)
      if (actualHeading) {
        actualHeading.id = id
      }
      
      return { id, text, level }
    })
    
    setTocItems(items)
  }, [content])

  useEffect(() => {
    const handleScroll = () => {
      const headings = tocItems.map(item => document.getElementById(item.id)).filter(Boolean)
      
      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i]
        if (heading && heading.getBoundingClientRect().top <= 100) {
          setActiveId(heading.id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [tocItems])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (tocItems.length === 0) return null

  return (
    <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-30 hidden xl:block">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center">
            <List className="w-5 h-5 text-gray-600 dark:text-gray-300 ml-2" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              תוכן עניינים
            </span>
          </div>
          <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? 'rotate-90' : ''
          }`} />
        </button>
        
        {isOpen && (
          <div className="max-h-80 overflow-y-auto p-2">
            {tocItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToHeading(item.id)}
                className={`block w-full text-right p-2 rounded-lg text-sm transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 ${
                  activeId === item.id 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
                style={{ paddingRight: `${(item.level - 1) * 12 + 8}px` }}
              >
                {item.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}