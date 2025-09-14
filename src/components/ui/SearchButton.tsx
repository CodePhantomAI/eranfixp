import React from 'react'
import { Search, Command } from 'lucide-react'
import { useSearch } from '../../contexts/SearchContext'

export const SearchButton: React.FC = () => {
  const { setIsSearchOpen } = useSearch()

  return (
    <button
      onClick={() => setIsSearchOpen(true)}
      className="flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group min-w-[200px]"
      title="חיפוש (Ctrl+K)"
    >
      <Search className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
      <span className="text-gray-500 dark:text-gray-400 text-sm flex-1 text-right">
        חיפוש...
      </span>
      <div className="flex items-center gap-1">
        <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
          Ctrl
        </kbd>
        <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
          K
        </kbd>
      </div>
    </button>
  )
}