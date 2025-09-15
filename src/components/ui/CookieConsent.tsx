import React, { useState, useEffect } from 'react'
import { Cookie, X, Settings, CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from './Button'
import { Modal } from './Modal'

interface CookieSettings {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  functional: boolean
}

export const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState<CookieSettings>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    functional: false
  })

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookie-consent')
    if (!cookieConsent) {
      setShowBanner(true)
    } else {
      // Load saved settings
      try {
        const savedSettings = JSON.parse(cookieConsent)
        setSettings(savedSettings)
        applyGoogleAnalytics(savedSettings.analytics)
      } catch (error) {
        console.error('Error loading cookie settings:', error)
        setShowBanner(true)
      }
    }
  }, [])

  const applyGoogleAnalytics = (enabled: boolean) => {
    if (enabled) {
      // Enable Google Analytics
      window.gtag?.('consent', 'update', {
        analytics_storage: 'granted'
      })
    } else {
      // Disable Google Analytics
      window.gtag?.('consent', 'update', {
        analytics_storage: 'denied'
      })
    }
  }

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    }
    setSettings(allAccepted)
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted))
    applyGoogleAnalytics(true)
    setShowBanner(false)
  }

  const acceptNecessaryOnly = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    }
    setSettings(necessaryOnly)
    localStorage.setItem('cookie-consent', JSON.stringify(necessaryOnly))
    applyGoogleAnalytics(false)
    setShowBanner(false)
  }

  const saveCustomSettings = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(settings))
    applyGoogleAnalytics(settings.analytics)
    setShowBanner(false)
    setShowSettings(false)
  }

  const updateSetting = (key: keyof CookieSettings, value: boolean) => {
    if (key === 'necessary') return // Can't disable necessary cookies
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  if (!showBanner) return null

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-2xl animate-in slide-in-from-bottom-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-start">
              <Cookie className="w-6 h-6 text-blue-600 mt-1 ml-3 animate-pulse" />
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  🍪 השימוש באתר הזה כולל עוגיות
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-w-2xl">
                  אנחנו משתמשים בעוגיות כדי לשפר את חוויית השימוש שלכם, לנתח תנועה באתר ולהתאים תוכן. 
                  אתם יכולים לבחור איזה סוגי עוגיות לאשר. 
                  <a href="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline mr-1">
                    קראו עוד במדיניות הפרטיות
                  </a>
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 min-w-0 lg:min-w-max">
              <Button
                onClick={() => setShowSettings(true)}
                variant="secondary"
                size="sm"
                className="whitespace-nowrap"
              >
                <Settings className="w-4 h-4 ml-2" />
                הגדרות מתקדמות
              </Button>
              <Button
                onClick={acceptNecessaryOnly}
                variant="secondary"
                size="sm"
                className="whitespace-nowrap"
              >
                חיוניות בלבד
              </Button>
              <Button
                onClick={acceptAll}
                size="sm"
                className="whitespace-nowrap"
              >
                <CheckCircle className="w-4 h-4 ml-2" />
                אישור כל העוגיות
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="🍪 הגדרות עוגיות מתקדמות"
        size="lg"
      >
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold text-blue-900 mb-2">מה זה עוגיות?</h3>
            <p className="text-blue-800 text-sm">
              עוגיות הן קבצים קטנים שנשמרים במכשיר שלכם כדי לשפר את חוויית השימוש באתר. 
              אתם יכולים לבחור איזה סוגי עוגיות לאשר.
            </p>
          </div>

          <div className="space-y-4">
            {/* Necessary Cookies */}
            <div className="border rounded-lg p-4 bg-green-50 border-green-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 ml-3" />
                  <h4 className="font-bold text-green-900">עוגיות חיוניות</h4>
                </div>
                <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  חובה
                </div>
              </div>
              <p className="text-green-800 text-sm mb-2">
                עוגיות הדרושות לתפקוד בסיסי של האתר (אבטחה, זמן הפעלה וכו׳)
              </p>
              <p className="text-green-700 text-xs">
                לא ניתן לביטול - נדרשות לתפקוד האתר
              </p>
            </div>

            {/* Analytics Cookies */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-blue-600 ml-3" />
                  <h4 className="font-bold text-gray-900">עוגיות אנליטיקה</h4>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.analytics}
                    onChange={(e) => updateSetting('analytics', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <p className="text-gray-600 text-sm mb-2">
                עוזרות לנו להבין איך משתמשים באתר ולשפר אותו (Google Analytics)
              </p>
              <p className="text-gray-500 text-xs">
                כוללות: עמודים שביקרתם, זמן שהייה, מקור הגעה לאתר
              </p>
            </div>

            {/* Marketing Cookies */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-purple-600 ml-3" />
                  <h4 className="font-bold text-gray-900">עוגיות שיווק</h4>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.marketing}
                    onChange={(e) => updateSetting('marketing', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <p className="text-gray-600 text-sm mb-2">
                מאפשרות לנו להציג תוכן ופרסומות מותאמות אישית
              </p>
              <p className="text-gray-500 text-xs">
                כוללות: מעקב התנהגות, יצירת פרופיל עניינים, פרסום ממוקד
              </p>
            </div>

            {/* Functional Cookies */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-orange-600 ml-3" />
                  <h4 className="font-bold text-gray-900">עוגיות פונקציונליות</h4>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.functional}
                    onChange={(e) => updateSetting('functional', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <p className="text-gray-600 text-sm mb-2">
                שומרות העדפות והגדרות (ערכת צבעים, שפה, גודל טקסט)
              </p>
              <p className="text-gray-500 text-xs">
                כוללות: הגדרות נגישות, העדפות תצוגה, שירותי צ'אט
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">💡 מידע נוסף:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• תמיד אפשר לשנות הגדרות דרך הפוטר של האתר</li>
              <li>• עוגיות חיוניות נדרשות לתפקוד בסיסי ולא ניתן לביטול</li>
              <li>• ביטול עוגיות עשוי להשפיע על חוויית השימוש</li>
              <li>• כל הנתונים מוצפנים ומוגנים על פי תקני אבטחה מתקדמים</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={acceptNecessaryOnly}
            >
              חיוניות בלבד
            </Button>
            <Button
              onClick={saveCustomSettings}
            >
              שמור הגדרות
            </Button>
            <Button
              onClick={acceptAll}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 ml-2" />
              אשר הכל
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}