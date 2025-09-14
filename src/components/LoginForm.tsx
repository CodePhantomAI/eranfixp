import React, { useState } from 'react'
import { LogIn, Lock, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import { signIn } from '../lib/auth'
import { Button } from './ui/Button'
import { LoadingSpinner } from './ui/LoadingSpinner'

export const LoginForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('eranfixer@gmail.com')
  const [password, setPassword] = useState('7198258eranfixer')
  const [errors, setErrors] = useState<{email?: string, password?: string}>({})

  const validateForm = () => {
    const newErrors: {email?: string, password?: string} = {}
    
    if (!email || email.trim() === '') {
      newErrors.email = 'נדרש אימייל'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'כתובת אימייל לא תקינה'
    }
    
    if (!password || password.trim() === '') {
      newErrors.password = 'נדרשת סיסמה'
    } else if (password.length < 6) {
      newErrors.password = 'סיסמה חייבת להכיל לפחות 6 תווים'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      await signIn(email, password)
      toast.success('התחברות בוצעה בהצלחה!')
    } catch (error: any) {
      toast.error(error.message || 'שגיאה בהתחברות')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              EranFixer CMS
            </h1>
            <p className="text-gray-600">
              מערכת ניהול תוכן מתקדמת
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="כתובת אימייל"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="סיסמה"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  disabled={isLoading}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full py-3 text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <LogIn className="w-5 h-5 mr-2" />
              )}
              כניסה למערכת
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}