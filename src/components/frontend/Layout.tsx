import React from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

interface FrontendLayoutProps {
  children: React.ReactNode
}

export const FrontendLayout: React.FC<FrontendLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}