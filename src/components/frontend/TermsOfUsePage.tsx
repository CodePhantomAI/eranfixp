import React from 'react'

export const TermsOfUsePage: React.FC = () => {
  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">תנאי שימוש</h1>
        
        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">כללי</h2>
            <p className="text-gray-600 leading-relaxed">
              השימוש באתר Eran Fixer כפוף לתנאים המפורטים להלן. 
              המשך השימוש באתר מהווה הסכמה מלאה לתנאים אלה.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">שימוש מותר</h2>
            <p className="text-gray-600 leading-relaxed mb-4">האתר מיועד לשימוש לגיטימי בלבד, כולל:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>קבלת מידע על השירותים שלנו</li>
              <li>יצירת קשר לצורך קבלת שירותים</li>
              <li>צפייה בתיק העבודות והמחקרים</li>
              <li>קריאת תוכן הבלוג והמאמרים</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">שימוש אסור</h2>
            <p className="text-gray-600 leading-relaxed mb-4">אסור לעשות שימוש באתר למטרות הבאות:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>פעילות בלתי חוקית או מזיקה</li>
              <li>הפצת וירוסים או תוכנות זדוניות</li>
              <li>ניסיון לפרוץ או לפגוע במערכות האתר</li>
              <li>העתקת תוכן ללא אישור מפורש</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">זכויות יוצרים</h2>
            <p className="text-gray-600 leading-relaxed">
              כל התוכן באתר, כולל טקסטים, תמונות, עיצובים ומחקרים, 
              מוגן בזכויות יוצרים השייכות ל-Eran Fixer. 
              אין להעתיק או להשתמש בתוכן ללא אישור בכתב.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">הגבלת אחריות</h2>
            <p className="text-gray-600 leading-relaxed">
              Eran Fixer לא תישא באחריות לנזקים הנובעים משימוש באתר, 
              כולל נזקים עקיפים, אובדן רווחים או נתונים. 
              השימוש באתר הוא על אחריות המשתמש בלבד.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">שינויים בתנאים</h2>
            <p className="text-gray-600 leading-relaxed">
              Eran Fixer שומרת לעצמה את הזכות לעדכן את תנאי השימוש מעת לעת. 
              המשך השימוש באתר לאחר עדכון התנאים מהווה הסכמה לתנאים החדשים.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">יצירת קשר</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              לשאלות או הבהרות בנוגע לתנאי השימוש:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>טלפון:</strong> 052-212-6366<br />
                <strong>אימייל:</strong> eranfixer@gmail.com
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">תאריך עדכון</h2>
            <p className="text-gray-600">
              תנאי שימוש אלה עודכנו לאחרונה בתאריך: ינואר 2025
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}