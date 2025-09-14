import React from 'react'

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">מדיניות פרטיות</h1>
        
        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">מבוא</h2>
            <p className="text-gray-600 leading-relaxed">
              Eran Fixer מכבדת את פרטיותכם ומחויבת להגן על המידע האישי שלכם. 
              מדיניות פרטיות זו מסבירה כיצד אנו אוספים, משתמשים ומגנים על המידע שלכם.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">איסוף מידע</h2>
            <p className="text-gray-600 leading-relaxed mb-4">אנו עשויים לאסוף את סוגי המידע הבאים:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>מידע אישי שאתם מספקים בטפסי יצירת קשר</li>
              <li>מידע טכני על השימוש באתר (cookies, IP)</li>
              <li>מידע על העדפות ופעילות באתר</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">שימוש במידע</h2>
            <p className="text-gray-600 leading-relaxed mb-4">אנו משתמשים במידע לצרכים הבאים:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>מתן שירותים ותמיכה</li>
              <li>שיפור חוויית המשתמש באתר</li>
              <li>יצירת קשר ומתן מידע רלוונטי</li>
              <li>ניתוח וסטטיסטיקות לשיפור השירות</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">הגנה על המידע</h2>
            <p className="text-gray-600 leading-relaxed">
              אנו נוקטים באמצעי אבטחה מתקדמים להגנה על המידע האישי שלכם, 
              כולל הצפנה, גיבויים מאובטחים ובקרת גישה מוגבלת.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">זכויותיכם</h2>
            <p className="text-gray-600 leading-relaxed mb-4">יש לכם הזכויות הבאות:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>לדעת איזה מידע אנו שומרים עליכם</li>
              <li>לבקש עדכון או מחיקת המידע</li>
              <li>להתנגד לעיבוד המידע</li>
              <li>לקבל העתק של המידע שלכם</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">יצירת קשר</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              לשאלות או בקשות בנוגע למדיניות הפרטיות:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>טלפון:</strong> 052-212-6366<br />
                <strong>אימייל:</strong> eranfixer@gmail.com
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">עדכונים</h2>
            <p className="text-gray-600">
              מדיניות פרטיות זו עודכנה לאחרונה בתאריך: ינואר 2025
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}