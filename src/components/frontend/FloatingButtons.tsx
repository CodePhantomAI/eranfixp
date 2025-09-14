import React, { useState, useEffect } from 'react'
import { MessageCircle, Eye, EyeOff, Type, Palette, Volume2 } from 'lucide-react'

export const FloatingButtons: React.FC = () => {
  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false)
  const [fontSize, setFontSize] = useState(100)
  const [highContrast, setHighContrast] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show buttons after a short delay
    const timer = setTimeout(() => setIsVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Apply font size changes
    document.documentElement.style.fontSize = `${fontSize}%`
  }, [fontSize])

  useEffect(() => {
    // Apply high contrast
    if (highContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [highContrast])

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 10, 150))
  }

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 10, 80))
  }

  const resetFontSize = () => {
    setFontSize(100)
  }

  const toggleHighContrast = () => {
    setHighContrast(prev => !prev)
  }

  const readPage = () => {
    if ('speechSynthesis' in window) {
      const text = document.body.innerText
      const utterance = new SpeechSynthesisUtterance(text.slice(0, 500))
      utterance.lang = 'he-IL'
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <>
      {/* High Contrast Styles */}
      <style>{`
        .high-contrast {
          filter: contrast(200%) brightness(150%);
        }
        .high-contrast * {
          background-color: #000 !important;
          color: #fff !important;
          border-color: #fff !important;
        }
        .high-contrast a {
          color: #60a5fa !important;
          text-decoration: underline !important;
        }
        .high-contrast button {
          background-color: #1f2937 !important;
          color: white !important;
          border: 2px solid #374151 !important;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        
        .pulse-ring {
          animation: pulse-ring 2s infinite;
        }
      `}</style>

      <div className={`fixed bottom-6 left-6 z-50 transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        {/* WhatsApp Button */}
        <div className="mb-4 relative">
          {/* Pulse ring effect */}
          <div className="absolute inset-0 bg-green-500 rounded-full pulse-ring"></div>
          
          <a
            href="https://wa.me/972522126366?text=היי, אני מעוניין לשמוע על השירותים שלכם"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110 float-animation"
            title="שלח הודעה בווטסאפ"
          >
            <MessageCircle className="w-6 h-6 group-hover:animate-bounce" />
            
            {/* Tooltip */}
            <div className="absolute right-full mr-3 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform group-hover:scale-105">
              שלח הודעה בווטסאפ
              <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
          </a>
        </div>

        {/* Accessibility Button */}
        <div className="relative">
          <button
            onClick={() => setShowAccessibilityMenu(!showAccessibilityMenu)}
            className="group relative flex items-center bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110 float-animation"
            title="כלי נגישות"
            style={{ animationDelay: '1s' }}
          >
            <Eye className="w-6 h-6 group-hover:animate-pulse" />
            
            {/* Tooltip */}
            <div className="absolute right-full mr-3 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform group-hover:scale-105">
              כלי נגישות
              <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
          </button>

          {/* Accessibility Menu */}
          {showAccessibilityMenu && (
            <div className="absolute bottom-full mb-4 right-0 bg-white rounded-2xl shadow-xl border p-6 w-80 animate-in slide-in-from-bottom-5 backdrop-blur-sm bg-white/95">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">כלי נגישות</h3>
              
              <div className="space-y-4">
                {/* Font Size Controls */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Type className="w-4 h-4 ml-2" />
                    גודל טקסט
                  </h4>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={decreaseFontSize}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-105"
                      disabled={fontSize <= 80}
                    >
                      A-
                    </button>
                    <span className="text-sm text-gray-600">{fontSize}%</span>
                    <button
                      onClick={increaseFontSize}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-105"
                      disabled={fontSize >= 150}
                    >
                      A+
                    </button>
                  </div>
                  <button
                    onClick={resetFontSize}
                    className="w-full mt-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-all duration-200 hover:scale-105"
                  >
                    איפוס
                  </button>
                </div>

                {/* High Contrast */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Palette className="w-4 h-4 ml-2" />
                    ניגודיות גבוהה
                  </h4>
                  <button
                    onClick={toggleHighContrast}
                    className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                      highContrast 
                        ? 'bg-gray-800 text-white' 
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {highContrast ? 'בטל ניגודיות גבוהה' : 'הפעל ניגודיות גבוהה'}
                  </button>
                </div>

                {/* Screen Reader */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Volume2 className="w-4 h-4 ml-2" />
                    קריאת דף
                  </h4>
                  <button
                    onClick={readPage}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-all duration-200 hover:scale-105"
                  >
                    קרא את הדף
                  </button>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setShowAccessibilityMenu(false)}
                  className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition-all duration-200 hover:scale-105"
                >
                  סגור תפריט
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}