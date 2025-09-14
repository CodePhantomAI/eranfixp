import React, { useState } from 'react'
import { Menu, X, Home, FileText, Redo as Redirect, Image, Settings, LogOut, Search, Bell, Users, TrendingUp, Globe } from 'lucide-react'
import { signOut } from '../lib/auth'
import toast from 'react-hot-toast'
import { Button } from './ui/Button'
import { SearchButton } from './ui/SearchButton'

interface LayoutProps {
  children: React.ReactNode
  currentPage?: string
}

const navigation = [
  { name: 'דשבורד', href: '/admin', icon: Home },
  { name: 'עמודים', href: '/admin/pages', icon: FileText },
  { name: 'בלוג', href: '/admin/blog', icon: FileText },
  { name: 'תיק עבודות', href: '/admin/portfolio', icon: Image },
  { name: 'לקוחות', href: '/admin/clients', icon: Users },
  { name: 'מחקרים', href: '/admin/research', icon: FileText },
  { name: 'הפניות', href: '/admin/redirects', icon: Redirect },
  { name: 'מדיה', href: '/admin/media', icon: Image },
  { name: 'SEO', href: '/admin/seo', icon: TrendingUp },
  { name: 'הגדרות', href: '/admin/settings', icon: Settings },
]

export const Layout: React.FC<LayoutProps> = ({ children, currentPage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('התנתקות בוצעה בהצלחה')
    } catch (error: any) {
      toast.error('שגיאה בהתנתקות')
    }
  }

  const handleNavigation = (href: string) => {
    window.location.href = href
    setSidebarOpen(false)
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <nav className="fixed top-0 right-0 bottom-0 flex flex-col w-5/6 max-w-sm bg-white shadow-xl">
          <div className="flex items-center justify-between px-4 py-3 bg-blue-600">
            <h2 className="text-lg font-semibold text-white">EranFixer CMS</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="flex-1 py-6 overflow-y-auto">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className="w-full text-right flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <item.icon className="w-5 h-5 ml-3" />
                {item.name}
              </button>
            ))}
          </div>

          <div className="px-4 py-4 border-t">
            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="w-full justify-start"
            >
              <LogOut className="w-5 h-5 ml-2" />
              התנתקות
            </Button>
          </div>
        </nav>
      </div>

      {/* Desktop sidebar */}
      <nav className="hidden lg:fixed lg:inset-y-0 lg:right-0 lg:z-40 lg:w-72 lg:flex lg:flex-col">
        <div className="flex flex-col flex-grow bg-white shadow-xl overflow-y-auto">
          <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-blue-700">
            <h1 className="text-xl font-bold text-white">EranFixer CMS</h1>
            <p className="text-blue-100 text-sm mt-1">מערכת ניהול תוכן</p>
          </div>

          <div className="flex-1 py-6">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={`w-full text-right flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border-r-3 ${
                  currentPage === item.href.replace('/admin/', '') || (item.href === '/admin' && currentPage === 'dashboard')
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-transparent'
                }`}
              >
                <item.icon className="w-5 h-5 ml-3" />
                {item.name}
              </button>
            ))}
          </div>

          <div className="px-6 py-4 border-t">
            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="w-full justify-start"
            >
              <LogOut className="w-5 h-5 ml-2" />
              התנתקות
            </Button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="lg:mr-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-500 hover:text-gray-600 lg:hidden"
              >
                <Menu size={24} />
              </button>
              <h2 className="text-lg font-semibold text-gray-900 mr-4">
                {currentPage === 'pages' && 'ניהול עמודים'}
                {currentPage === 'blog' && 'ניהול בלוג'}
                {currentPage === 'portfolio' && 'ניהול תיק עבודות'}
                {currentPage === 'clients' && 'ניהול לקוחות'}
                {currentPage === 'research' && 'ניהול מחקרים'}
                {currentPage === 'redirects' && 'ניהול הפניות'}
                {currentPage === 'media' && 'ניהול מדיה'}
                {currentPage === 'seo' && 'SEO Dashboard'}
                {currentPage === 'settings' && 'הגדרות'}
                {(!currentPage || currentPage === 'dashboard') && 'דשבורד'}
              </h2>
            </div>

            <div className="flex items-center space-x-4 space-x-reverse">
              <SearchButton />
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
                title="חזור לאתר"
              >
                <Globe size={20} />
              </a>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}