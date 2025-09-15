import React, { useEffect } from 'react'
import { updateSEOTags } from '../../lib/seo'

export const PrivacyPolicyPage: React.FC = () => {
  useEffect(() => {
    updateSEOTags({
      title: 'מדיניות פרטיות - EranFixer',
      description: 'מדיניות הפרטיות של EranFixer - איך אנו מטפלים במידע האישי שלכם',
      keywords: 'מדיניות פרטיות, הגנת פרטיות, מידע אישי, EranFixer',
      url: '/privacy-policy'
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            מדיניות פרטיות
          </h1>

          <div className="prose prose-lg max-w-none text-right">
            <p className="text-gray-600 mb-6">
              עודכן לאחרונה: {new Date().toLocaleDateString('he-IL')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. מידע שאנו אוספים
              </h2>
              <p className="text-gray-700 mb-4">
                אנו אוספים מידע שאתם מספקים לנו באופן וולונטרי, כגון:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>שם מלא ופרטי יצירת קשר</li>
                <li>כתובת דוא"ל ומספר טלפון</li>
                <li>מידע על הפרויקט או השירות המבוקש</li>
                <li>מידע טכני על השימוש באתר (cookies)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. איך אנו משתמשים במידע
              </h2>
              <p className="text-gray-700 mb-4">
                המידע שאנו אוספים משמש אותנו למטרות הבאות:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>מתן שירותים והצעות מחיר</li>
                <li>תקשורת עם לקוחות ועדכונים על פרויקטים</li>
                <li>שיפור השירות והאתר</li>
                <li>ציות לחובות חוקיים</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. הגנה על המידע
              </h2>
              <p className="text-gray-700 mb-4">
                אנו נוקטים באמצעי אבטחה מתקדמים להגנה על המידע האישי שלכם, כולל:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>הצפנת נתונים בזמן העברה ובמנוחה</li>
                <li>הגבלת גישה למידע לעובדים מוסמכים בלבד</li>
                <li>עדכונים שוטפים של מערכות האבטחה</li>
                <li>גיבוי נתונים ותוכניות התאוששות</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. שיתוף מידע עם צדדים שלישיים
              </h2>
              <p className="text-gray-700 mb-4">
                איננו מוכרים או משתפים את המידע האישי שלכם עם צדדים שלישיים, למעט:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>ספקי שירות טכניים (הוסטינג, אנליטיקה)</li>
                <li>כאשר נדרש על פי חוק</li>
                <li>עם הסכמתכם המפורשת</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. זכויותיכם
              </h2>
              <p className="text-gray-700 mb-4">
                על פי חוק הגנת הפרטיות, יש לכם הזכות:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>לעיין במידע השמור עליכם</li>
                <li>לתקן או לעדכן מידע לא מדויק</li>
                <li>למחוק את המידע (במקרים מסויימים)</li>
                <li>להגביל את העיבוד של המידע</li>
                <li>לקבל העתק של המידע</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Cookies
              </h2>
              <p className="text-gray-700 mb-4">
                האתר שלנו משתמש ב-cookies לשיפור החוויה ולמטרות אנליטיות. 
                אתם יכולים לחסום cookies בהגדרות הדפדפן, אך זה עשוי להשפיע על הפונקציונליות.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. עדכונים למדיניות
              </h2>
              <p className="text-gray-700 mb-4">
                אנו עשויים לעדכן מדיניות זו מעת לעת. העדכונים יפורסמו באתר 
                ויכנסו לתוקף מיד עם הפרסום.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. יצירת קשר
              </h2>
              <p className="text-gray-700 mb-4">
                לשאלות או בקשות בנוגע למדיניות הפרטיות, צרו קשר:
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>אימייל:</strong> privacy@eranfixer.com
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>טלפון:</strong> 052-1234567
                </p>
                <p className="text-gray-700">
                  <strong>כתובת:</strong> רמת גן, ישראל
                </p>
              </div>
            </section>
          </div>

          <div className="mt-12 text-center">
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              יש לכם שאלות? צרו קשר
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}