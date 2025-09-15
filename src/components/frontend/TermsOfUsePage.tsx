import React from 'react'
import { useEffect } from 'react'
import { updateSEOTags } from '../../lib/seo'

export const TermsOfUsePage: React.FC = () => {
  useEffect(() => {
    updateSEOTags({
      title: 'תנאי שימוש - EranFixer',
      description: 'תנאי השימוש והחוקים החלים על שירותי EranFixer',
      canonical: 'https://eran-fixer.com/terms-of-use'
    })
  }, [])

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-2xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              תנאי שימוש
            </h1>
            
            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  1. כללי
                </h2>
                <p>
                  תנאי שימוש אלה מסדירים את השימוש באתר ובשירותי EranFixer.
                  השימוש באתר מהווה הסכמה לתנאים אלה.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  2. שירותים
                </h2>
                <p>
                  EranFixer מספקת שירותי פיתוח אתרים, קידום אתרים (SEO), 
                  אוטומציה בבינה מלאכותית וניהול מוניטין דיגיטלי.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  3. אחריות
                </h2>
                <p>
                  השירותים ניתנים "כמו שהם". אנו עושים מאמץ להבטיח איכות גבוהה
                  אך לא נושאים באחריות לנזקים עקיפים.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  4. זכויות יוצרים
                </h2>
                <p>
                  כל התוכן באתר מוגן בזכויות יוצרים. אין להעתיק או להפיץ
                  ללא אישור מראש ובכתב.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  5. שינויים
                </h2>
                <p>
                  אנו שומרים על הזכות לשנות תנאי שימוש אלה בכל עת.
                  השינויים ייכנסו לתוקף מיד עם פרסומם.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  6. צור קשר
                </h2>
                <p>
                  לשאלות או הבהרות בנוגע לתנאי השימוש, ניתן ליצור קשר:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>אימייל: info@eran-fixer.com</li>
                  <li>טלפון: 050-1234567</li>
                </ul>
              </section>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                עדכון אחרון: {new Date().toLocaleDateString('he-IL')}
              </p>
              <div className="mt-6">
                <a
                  href="/contact"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block"
                >
                  צור קשר לשאלות
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}