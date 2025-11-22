import React, { useState, useEffect } from 'react'
import { Menu, X, Phone, Mail, Search as SearchIcon } from 'lucide-react'
import { useScrollDirection } from '../../hooks/useScrollDirection'
import { useSearch } from '../../contexts/SearchContext'
import { useTheme } from '../../contexts/ThemeContext'
import { SearchButton } from '../ui/SearchButton'
import { SearchModal } from '../ui/SearchModal'
import { ThemeToggle } from '../ui/ThemeToggle'
import { cn } from '../../lib/utils'

const navigation = [
  { name: 'בית', href: '/' },
  { name: 'שירותים', href: '/services' },
  { name: 'תיק עבודות', href: '/portfolio' },
  { name: 'בלוג', href: '/blog' },
  { name: 'לקוחות', href: '/clients' },
  { name: 'מחקרים', href: '/research' },
  { name: 'צור קשר', href: '/contact' }
]

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const scrollDirection = useScrollDirection()
  const { setIsSearchOpen } = useSearch()
  const { isDark } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const shouldHideHeader = scrollDirection === 'down' && isScrolled && window.scrollY > 200

  return (
    <>
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        shouldHideHeader ? '-translate-y-full' : 'translate-y-0',
        'bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="flex items-center group">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center ml-3 group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-lg">EF</span>
                </div>
                <div>
                  <div className={cn(
                    'font-bold text-lg transition-colors',
                    'text-gray-900 dark:text-white'
                  )}>
                    ערן פיקסר
                  </div>
                  <div className={cn(
                    'text-xs transition-colors',
                    'text-gray-600 dark:text-gray-300'
                  )}>
                    פתרונות דיגיטליים
                  </div>
                </div>
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-4 space-x-reverse">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'font-medium transition-all duration-200 hover:scale-105 relative group',
                    'text-gray-900 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400'
                  )}
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4 space-x-reverse">
              <SearchButton />
              
              <a
                href="tel:052-212-6366"
                className={cn(
                  'flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105',
                  'bg-blue-600 text-white hover:bg-blue-700'
                )}
              >
                <Phone className="w-4 h-4 ml-2" />
                052-212-6366
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-2 space-x-reverse">
              <button
                onClick={() => setIsSearchOpen(true)}
                className={cn(
                  'p-3 rounded-lg transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center',
                  'text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                )}
                aria-label="פתח חיפוש"
                title="חיפוש באתר"
                type="button"
              >
                <SearchIcon className="w-6 h-6" aria-hidden="true" />
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={cn(
                  'p-3 rounded-lg transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center',
                  'text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                )}
                aria-label={isMenuOpen ? 'סגור תפריט' : 'פתח תפריט'}
                aria-expanded={isMenuOpen}
                title={isMenuOpen ? 'סגור תפריט' : 'פתח תפריט'}
                type="button"
              >
                {isMenuOpen ? <X className="w-7 h-7" aria-hidden="true" /> : <Menu className="w-7 h-7" aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav
            className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg"
            role="navigation"
            aria-label="תפריט ראשי"
          >
            <div className="px-4 py-6 space-y-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-5 py-4 text-base text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors font-medium min-h-[52px] flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                  role="menuitem"
                >
                  {item.name}
                </a>
              ))}

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <a
                  href="tel:052-212-6366"
                  className="flex items-center justify-center w-full bg-blue-600 text-white px-5 py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-lg min-h-[56px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="התקשר טלפוני 052-212-6366"
                >
                  <Phone className="w-5 h-5 ml-2" aria-hidden="true" />
                  <span className="font-semibold tracking-wide">052-212-6366</span>
                </a>
              </div>
            </div>
          </nav>
        )}
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16 lg:h-20" />
    </>
  )
}