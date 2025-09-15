import React, { useEffect } from 'react'
import { updateSEOTags } from '../../lib/seo'
import { Shield, Eye, Lock, Phone, Mail, CheckCircle } from 'lucide-react'

export const PrivacyPolicyPage: React.FC = () => {
  useEffect(() => {
    updateSEOTags({
      title: 'מדיניות פרטיות - EranFixer | הגנה על פרטיות הלקוחות שלנו',
      description: 'מדיניות הפרטיות של EranFixer - איך אנו מטפלים במידע האישי שלכם בהתאם לחוק הגנת הפרטיות הישראלי ותקנות GDPR',
      keywords: ['מדיניות פרטיות', 'הגנת פרטיות', 'מידע אישי', 'EranFixer', 'GDPR', 'חוק הגנת הפרטיות'],
      url: 'https://eran-fixer.com/privacy-policy',
      type: 'article'
    })
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-16 h-16 text-blue-300" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            מדיניות פרטיות
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            ב-EranFixer אנו מחויבים להגנה על הפרטיות שלכם ולטיפול אחראי במידע האישי
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 lg:p-12">
            <div className="text-sm text-gray-500 mb-8 text-center">
              <strong>עודכן לאחרונה:</strong> {new Date().toLocaleDateString('he-IL', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>

            <div className="space-y-12">
              {/* Section 1 */}
              <section>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center ml-4">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                      1. מחויבות לפרטיות
                    </span>
                  </h2>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg mb-6">
                  <p className="text-gray-800 leading-relaxed">
                    <strong>EranFixer מחויבת להגנה על הפרטיות שלכם.</strong> אנו מבינים כמה חשוב המידע האישי שלכם 
                    ופועלים על פי עקרונות שקיפות, אבטחה ואחריות בכל הקשור לטיפול בנתונים אישיים.
                  </p>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  מדיניות פרטיות זו מסבירה איך אנו אוספים, משתמשים, מגנים ומשתפים את המידע האישי שלכם 
                  כאשר אתם משתמשים באתר שלנו או בשירותים שלנו. המדיניות בנויה בהתאם לחוק הגנת הפרטיות 
                  הישראלי, תקנות ה-GDPR האירופיות ולמיטב השיטות הבינלאומיות בתחום הגנת הפרטיות.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center ml-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    <span className="bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                      2. מידע שאנו אוספים
                    </span>
                  </h2>
                </div>
                <p className="text-gray-700 mb-6">
                  אנו אוספים מידע בדרכים הבאות:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="font-bold text-gray-900 mb-4">מידע שאתם מספקים</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                        שם מלא ופרטי יצירת קשר
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                        כתובת דוא"ל ומספר טלפון
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                        שם החברה ותחום פעילות
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                        פרטי הפרויקט והשירות המבוקש
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="font-bold text-gray-900 mb-4">מידע טכני</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                        כתובת IP ומיקום גיאוגרפי כללי
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                        נתוני דפדפן ומערכת הפעלה
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                        דפים שביקרתם וזמן השהייה
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                        מקור ההגעה לאתר (referrer)
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center ml-4">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                      3. איך אנו משתמשים במידע
                    </span>
                  </h2>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
                  <h3 className="font-bold text-gray-900 mb-4">המטרות העיקריות:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">שירות לקוחות:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• מתן שירותים והצעות מחיר מותאמות</li>
                        <li>• תקשורת שוטפת על פרויקטים</li>
                        <li>• תמיכה טכנית ויעוץ מקצועי</li>
                        <li>• עדכונים על שירותים חדשים</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">שיפור השירות:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• ניתוח ביצועי האתר ושיפור חוויית המשתמש</li>
                        <li>• פיתוח שירותים וטכנולוגיות חדשות</li>
                        <li>• התאמת התוכן לקהל היעד</li>
                        <li>• מחקר שוק ומגמות בתחום</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 4 */}
              <section>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center ml-4">
                    <Lock className="w-6 h-6 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                      4. אבטחה והגנה על המידע
                    </span>
                  </h2>
                </div>
                <div className="bg-red-50 border border-red-200 p-6 rounded-lg mb-6">
                  <h3 className="font-bold text-red-900 mb-4">אמצעי אבטחה מתקדמים:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-red-800 mb-3">אבטחה טכנית:</h4>
                      <ul className="space-y-2 text-red-700 text-sm">
                        <li>• הצפנת SSL/TLS לכל התקשורת</li>
                        <li>• הצפנת מסדי נתונים (encryption at rest)</li>
                        <li>• אימות דו-שלבי לגישה למערכות</li>
                        <li>• חומות אש ומערכות זיהוי חדירות</li>
                        <li>• עדכוני אבטחה שוטפים</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-800 mb-3">אבטחה ארגונית:</h4>
                      <ul className="space-y-2 text-red-700 text-sm">
                        <li>• הגבלת גישה למידע לעובדים מוסמכים בלבד</li>
                        <li>• הסכמי סודיות עם כל הגורמים המעורבים</li>
                        <li>• הדרכות אבטחה תקופתיות לצוות</li>
                        <li>• גיבוי נתונים בטוח ומוצפן</li>
                        <li>• תוכניות התאוששות אחרי אסון</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 5 */}
              <section>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center ml-4">
                    <Shield className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                      5. שיתוף מידע עם צדדים שלישיים
                    </span>
                  </h2>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg mb-6">
                  <h3 className="font-bold text-yellow-900 mb-3">🚫 אנו לעולם לא:</h3>
                  <ul className="space-y-2 text-yellow-800">
                    <li>• מוכרים את המידע האישי שלכם</li>
                    <li>• משתפים מידע למטרות שיווקיות ללא הסכמה</li>
                    <li>• מעבירים נתונים לחברות פרסום</li>
                    <li>• חושפים פרטים אישיים ברשתות חברתיות</li>
                  </ul>
                </div>
                
                <p className="text-gray-700 mb-4">
                  <strong>אנו עשויים לשתף מידע רק במקרים הבאים:</strong>
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-500 mt-1 ml-3" />
                    <div>
                      <strong>ספקי שירות טכניים:</strong> חברות הוסטינג, אנליטיקה ואבטחה שעובדות איתנו 
                      ומחויבות לאותם סטנדרטים של הגנת פרטיות
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-500 mt-1 ml-3" />
                    <div>
                      <strong>דרישות חוק:</strong> כאשר נדרש על פי חוק או צו בית משפט
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-500 mt-1 ml-3" />
                    <div>
                      <strong>הסכמה מפורשת:</strong> רק עם הסכמתכם המפורשת והמודעת
                    </div>
                  </li>
                </ul>
              </section>

              {/* Section 6 */}
              <section>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center ml-4">
                    <CheckCircle className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                      6. הזכויות שלכם
                    </span>
                  </h2>
                </div>
                <p className="text-gray-700 mb-6">
                  על פי חוק הגנת הפרטיות הישראלי ותקנות GDPR, יש לכם הזכויות הבאות:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="font-bold text-gray-900 mb-4">זכויות עיקריות:</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>✅ זכות עיון במידע השמור עליכם</li>
                      <li>✅ זכות תיקון וערכון מידע לא מדויק</li>
                      <li>✅ זכות מחיקת מידע ("זכות הנשייה")</li>
                      <li>✅ זכות הגבלת עיבוד המידע</li>
                      <li>✅ זכות ניידות נתונים (קבלת העתק)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="font-bold text-gray-900 mb-4">איך להפעיל את הזכויות:</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>📧 שלחו מייל לכתובת: eranfixer@gmail.com</li>
                      <li>📞 התקשרו: 052-212-6366</li>
                      <li>💬 שלחו הודעה בוואטסאפ</li>
                      <li>📝 מלאו טופס יצירת קשר באתר</li>
                      <li>⏰ נענה תוך 30 יום כפי שנדרש בחוק</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 7 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    7. Cookies ומעקב
                  </span>
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="font-bold text-gray-900 mb-4">סוגי Cookies שאנו משתמשים:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold text-gray-800 mb-2">חיוניים</h4>
                      <p className="text-sm text-gray-600">נדרשים לתפקוד בסיסי של האתר</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold text-gray-800 mb-2">אנליטיים</h4>
                      <p className="text-sm text-gray-600">עוזרים לנו להבין איך משתמשים באתר</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold text-gray-800 mb-2">פונקציונליים</h4>
                      <p className="text-sm text-gray-600">זוכרים העדפות והגדרות</p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  אתם יכולים לנהל cookies בהגדרות הדפדפן שלכם. חסימת cookies עשויה להשפיע על הפונקציונליות של האתר.
                </p>
              </section>

              {/* Section 8 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    8. אחסון ושמירת מידע
                  </span>
                </h2>
                <div className="bg-purple-50 p-6 rounded-lg mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold text-purple-900 mb-3">תקופות שמירה:</h3>
                      <ul className="space-y-1 text-purple-800 text-sm">
                        <li>• מידע לקוחות פעילים: כל עוד הקשר עסקי קיים</li>
                        <li>• הצעות מחיר: 3 שנים מיום הגשה</li>
                        <li>• חוזים ופרויקטים: 7 שנים (חובת חוק)</li>
                        <li>• נתוני אנליטיקה: 2 שנים</li>
                        <li>• מידע שיווקי: עד ביטול ההסכמה</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-purple-900 mb-3">מיקום השרתים:</h3>
                      <ul className="space-y-1 text-purple-800 text-sm">
                        <li>• שרתים ראשיים: אירופה (GDPR compliant)</li>
                        <li>• גיבוי: ישראל (מרכזי נתונים מוסדרים)</li>
                        <li>• CDN: רשת גלובלית מאובטחת</li>
                        <li>• כל השרתים עומדים בתקני אבטחה בינלאומיים</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 9 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    9. קטינים והגנת ילדים
                  </span>
                </h2>
                <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg">
                  <p className="text-orange-800">
                    <strong>השירותים שלנו מיועדים לקהל בוגר.</strong> איננו אוספים מידע מקטינים מתחת לגיל 16 
                    ללא הסכמת הורים. אם גילינו שאספנו מידע מקטין ללא הסכמה, נמחק אותו מיידית. 
                    הורים יכולים לפנות אלינו לכל בירור או בקשה.
                  </p>
                </div>
              </section>

              {/* Section 10 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    10. שינויים במדיניות
                  </span>
                </h2>
                <p className="text-gray-700 mb-4">
                  אנו עשויים לעדכן מדיניות זו מעת לעת כדי לשקף שינויים בשירותים או בחוקים. 
                  כל עדכון יכלול:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• פרסום העדכון באתר עם תאריך עדכון</li>
                  <li>• הודעה ללקוחות רשומים על שינויים משמעותיים</li>
                  <li>• תקופת מעבר של 30 יום להתאמה</li>
                  <li>• אפשרות לבטל שירותים אם לא מסכימים לשינויים</li>
                </ul>
              </section>

              {/* Section 11 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    11. צור קשר - פרטיות ומידע
                  </span>
                </h2>
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg">
                  <h3 className="text-xl font-bold mb-6 text-center">יש לכם שאלות על הפרטיות שלכם?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <a
                      href="mailto:eranfixer@gmail.com?subject=שאלה בנושא פרטיות"
                      className="flex items-center justify-center bg-white/10 backdrop-blur rounded-lg p-4 hover:bg-white/20 transition-colors"
                    >
                      <Mail className="w-6 h-6 ml-3" />
                      <div>
                        <div className="font-semibold">אימייל</div>
                        <div className="text-sm text-blue-100">eranfixer@gmail.com</div>
                      </div>
                    </a>
                    
                    <a
                      href="tel:052-212-6366"
                      className="flex items-center justify-center bg-white/10 backdrop-blur rounded-lg p-4 hover:bg-white/20 transition-colors"
                    >
                      <Phone className="w-6 h-6 ml-3" />
                      <div>
                        <div className="font-semibold">טלפון</div>
                        <div className="text-sm text-blue-100">052-212-6366</div>
                      </div>
                    </a>
                    
                    <a
                      href="https://wa.me/972522126366?text=יש לי שאלה על מדיניות הפרטיות"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center bg-white/10 backdrop-blur rounded-lg p-4 hover:bg-white/20 transition-colors"
                    >
                      <div className="w-6 h-6 ml-3 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold">W</span>
                      </div>
                      <div>
                        <div className="font-semibold">וואטסאפ</div>
                        <div className="text-sm text-blue-100">מענה מיידי</div>
                      </div>
                    </a>
                  </div>
                  
                  <div className="text-center mt-6">
                    <p className="text-blue-100 text-sm">
                      <strong>נענה לכל פנייה תוך 24 שעות בימי עבודה</strong><br />
                      מחויבים לשקיפות מלאה ושירות מקצועי
                    </p>
                  </div>
                </div>
              </section>

              {/* Legal Section */}
              <section className="border-t border-gray-200 pt-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    <span className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                      📋 מידע משפטי ותקנים
                    </span>
                  </h2>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-3">תקנים והסמכות:</h3>
                      <ul className="space-y-1 text-gray-600 text-sm">
                        <li>• חוק הגנת הפרטיות התשמ"א-1981 (ישראל)</li>
                        <li>• תקנות GDPR האירופיות</li>
                        <li>• תקן ISO 27001 לאבטחת מידע</li>
                        <li>• תקנות הגנת צרכנים</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-3">פרטי החברה:</h3>
                      <ul className="space-y-1 text-gray-600 text-sm">
                        <li>• שם: EranFixer (ערן פיקסר)</li>
                        <li>• מיקום: תל אביב, ישראל</li>
                        <li>• רישוי עסק: פעיל ומעודכן</li>
                        <li>• ביטוח אחריות מקצועית: פעיל</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Call to Action */}
            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                רוצים לדעת עוד?
              </h3>
              <p className="text-gray-600 mb-6">
                אנו מחויבים לשקיפות מלאה. יש לכם שאלות? אנחנו כאן בשבילכם.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-colors inline-block"
                >
                  צור קשר בנושא פרטיות
                </a>
                <a
                  href="/terms-of-use"
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition-colors inline-block"
                >
                  תנאי השימוש
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}