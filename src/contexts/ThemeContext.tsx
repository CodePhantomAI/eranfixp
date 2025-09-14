import React, { createContext, useContext, useState, useEffect } from 'react'

interface ThemeContextType {
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(true) // Always dark mode

  useEffect(() => {
    // Always apply dark theme
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  }, [isDark])

  const toggleTheme = () => {
    // Dark mode only - no toggle
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}