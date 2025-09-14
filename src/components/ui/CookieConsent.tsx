import React, { useState, useEffect } from 'react'
import { Cookie, X, Settings, Shield } from 'lucide-react'
import { Button } from './Button'

export const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, // Always true
    analytics: false,
    marketing: false,
    functionality: false
  })

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => setShowBanner(true), 2000)
    } else {
      // Load saved preferences
      try {
        const preferences = JSON.parse(consent)
        setCookiePreferences(preferences)
        applyConsent(preferences)
      } catch (error) {
        console.error('Error loading cookie preferences:', error)
      }
    }
  }, [])

  const applyConsent = (preferences: typeof cookiePreferences) => {
    // Apply analytics consent
    if (preferences.analytics) {
      // Enable Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
          'analytics_storage': 'granted'
        })
      }
    } else {
      // Disable Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
          'analytics_storage': 'denied'
        })
      }
    }

    // Apply other preferences as needed
    console.log('Cookie preferences applied:', preferences)
  }

  const acceptAll = () => {
    const newPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functionality: true
    }
    
    setCookiePreferences(newPreferences)
    localStorage.setItem('cookie-consent', JSON.stringify(newPreferences))
    applyConsent(newPreferences)
    setShowBanner(false)
  }

  const acceptNecessary = () => {
    const newPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functionality: false
    }
    
    setCookiePreferences(newPreferences)
    localStorage.setItem('cookie-consent', JSON.stringify(newPreferences))
    applyConsent(newPreferences)
    setShowBanner(false)
  }

  const savePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(cookiePreferences))
    applyConsent(cookiePreferences)
    setShowBanner(false)
    setShowSettings(false)
  }

  const updatePreference = (key: keyof typeof cookiePreferences, value: boolean) => {
    setCookiePreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }

  if (!showBanner) return null

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-2xl animate-in slide-in-from-bottom-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Cookie className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  🍪 שימוש בעוגיות (Cookies)
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  אנחנו משתמשים בעוגיות כדי לשפר את חוויית הגלישה שלכם, לנתח תנועה באתר ולספק תוכן מותאם אישית. 
                  עוגיות הכרחיות נדרשות לתפקוד בסיסי של האתר. עוגיות אחרות דורשות את הסכמתכם.
                  <br />
                  <a href="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline mr-1">
                    קראו עוד במדיניות הפרטיות שלנו
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <Settings className="w-4 h-4 ml-1" />
                הגדרות
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={acceptNecessary}
                className="whitespace-nowrap"
              >
                רק הכרחיות
              </Button>
              
              <Button
                size="sm"
                onClick={acceptAll}
                className="whitespace-nowrap bg-blue-600 hover:bg-blue-700"
              >
                אישור הכל
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  הגדרות עוגיות
                </h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Necessary Cookies */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      עוגיות הכרחיות
                    </h3>
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    תמיד פעיל
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  עוגיות אלה הכרחיות לתפקוד בסיסי של האתר ולא ניתן לבטלן. 
                  הן כוללות הגדרות אבטחה, העדפות שפה ומידע טכני בסיסי.
                </p>
              </div>

              {/* Analytics Cookies */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-blue-600 rounded-sm"></div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      עוגיות אנליטיקה
                    </h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cookiePreferences.analytics}
                      onChange={(e) => updatePreference('analytics', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  עוגיות אלה עוזרות לנו להבין איך משתמשים משתמשים באתר, 
                  כדי שנוכל לשפר אותו. כולל Google Analytics ומעקב ביצועים.
                </p>
              </div>

              {/* Marketing Cookies */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-purple-600 rounded-sm"></div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      עוגיות שיווק
                    </h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cookiePreferences.marketing}
                      onChange={(e) => updatePreference('marketing', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  עוגיות אלה מאפשרות לנו להציג תוכן ופרסומות מותאמים אישית 
                  ולמדוד את יעילות הקמפיינים השיווקיים שלנו.
                </p>
              </div>

              {/* Functionality Cookies */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-orange-600 rounded-sm"></div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      עוגיות פונקציונליות
                    </h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cookiePreferences.functionality}
                      onChange={(e) => updatePreference('functionality', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  עוגיות אלה משפרות את פונקציונליות האתר ומאפשרות תכונות מתקדמות 
                  כמו שמירת העדפות, צ'אט מקוון ותוכן מותאם אישית.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-end gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowSettings(false)}
                >
                  ביטול
                </Button>
                <Button onClick={savePreferences}>
                  שמור העדפות
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}