import React from 'react'

export const AccessibilityPage: React.FC = () => {
  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">הצהרת נגישות</h1>
        
        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">מחויבות לנגישות</h2>
            <p className="text-gray-600 leading-relaxed">
              Eran Fixer מחויבת להנגיש את האתר שלה לכלל הציבור, כולל אנשים עם מוגבלויות. 
              אנו פועלים להבטיח שהאתר יהיה נגיש ושמיש לכל המשתמשים.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">תקני נגישות</h2>
            <p className="text-gray-600 leading-relaxed">
              האתר נבנה בהתאם לתקן הישראלי ת"י 5568 ולהנחיות WCAG 2.1 ברמת AA, 
              המבטיחים נגישות מיטבית לאנשים עם מוגבלויות שונות.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">תכונות נגישות באתר</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>ניווט באמצעות מקלדת</li>
              <li>תמיכה בקוראי מסך</li>
              <li>ניגודיות צבעים מתאימה</li>
              <li>טקסט חלופי לתמונות</li>
              <li>כותרות מובנות היטב</li>
              <li>קישורים ברורים ומתארים</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">פניות ובקשות</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              אם נתקלתם בבעיית נגישות באתר או שיש לכם הצעות לשיפור, אנא צרו קשר:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>טלפון:</strong> 052-212-6366<br />
                <strong>אימייל:</strong> eranfixer@gmail.com
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">עדכון אחרון</h2>
            <p className="text-gray-600">
              הצהרת נגישות זו עודכנה לאחרונה בתאריך: ינואר 2025
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}