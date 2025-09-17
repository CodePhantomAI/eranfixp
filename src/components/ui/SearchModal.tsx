import React, { useEffect, useRef } from 'react'
import { Search, X, FileText, Briefcase, BookOpen, FlaskConical, Clock, ArrowLeft } from 'lucide-react'
import { useSearch } from '../../contexts/SearchContext'
import { LoadingSpinner } from './LoadingSpinner'
import { formatDate } from '../../lib/utils'

const typeIcons = {
  page: FileText,
  blog: BookOpen,
  portfolio: Briefcase,
  research: FlaskConical
}

const typeLabels = {
  page: 'עמוד',
  blog: 'בלוג',
  portfolio: 'פרויקט',
  research: 'מחקר'
}

const typeColors = {
  page: 'bg-blue-100 text-blue-800',
  blog: 'bg-green-100 text-green-800',
  portfolio: 'bg-purple-100 text-purple-800',
  research: 'bg-orange-100 text-orange-800'
}

export const SearchModal: React.FC = () => {
  const { 
    searchTerm, 
    setSearchTerm, 
    results, 
    isSearching, 
    isSearchOpen, 
    setIsSearchOpen 
  } = useSearch()
  
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isSearchOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open search with Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
      
      // Close search with Escape
      if (e.key === 'Escape') {
        setIsSearchOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [setIsSearchOpen, setSearchTerm])

  if (!isSearchOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden animate-in slide-in-from-top-5">
        {/* Search Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="חיפוש בכל התוכן... (Ctrl+K)"
              className="w-full pl-12 pr-12 py-4 text-lg border-0 focus:outline-none bg-transparent dark:text-white placeholder-gray-500"
            />
            <button
              onClick={() => {
                setIsSearchOpen(false)
                setSearchTerm('')
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
              <span className="mr-3 text-gray-600 dark:text-gray-300">מחפש...</span>
            </div>
          ) : searchTerm && results.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                לא נמצאו תוצאות
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                נסו מילות חיפוש אחרות
              </p>
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              {results.map((result, index) => {
                const Icon = typeIcons[result.type]
                return (
                  <a
                    key={result.id}
                    href={result.url}
                    onClick={() => {
                      setIsSearchOpen(false)
                      setSearchTerm('')
                    }}
                    className="block p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <div className="flex items-start gap-4">
                      {result.image ? (
                        <img
                          src={result.image}
                          alt={result.title}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[result.type]}`}>
                            {typeLabels[result.type]}
                          </span>
                          {result.date && (
                            <div className="flex items-center text-gray-500 text-xs">
                              <Clock className="w-3 h-3 ml-1" />
                              {formatDate(result.date)}
                            </div>
                          )}
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                          {result.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 line-clamp-2">
                          {result.excerpt}
                        </p>
                      </div>
                      
                      <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1" />
                    </div>
                  </a>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                חיפוש חכם
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                חפשו בכל התוכן: עמודים, בלוג, פרויקטים ומחקרים
              </p>
             <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 hidden lg:block">
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl</kbd> + 
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs mx-1">K</kbd>
                לפתיחה מהירה
              </div>
            </div>
          )}
        </div>

        {/* Search Tips */}
        {searchTerm && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>
                {results.length} תוצאות עבור "{searchTerm}"
              </span>
              <span>
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Enter</kbd> לכניסה
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}