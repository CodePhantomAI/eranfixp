import React from 'react'
import { ArrowLeft, CheckCircle, Globe, Zap, Shield, TrendingUp, Users, Award, Phone, Mail, MapPin, Star } from 'lucide-react'

const coreServices = [
  {
    icon: Globe,
    title: 'מערכות אתרים חכמות ומתקדמות',
    description: 'אתרים מקצועיים עם טכנולוגיות מתקדמות - React 18, TypeScript, Supabase. מערכות CMS מותאמות אישית עם ביצועים מעולים ואבטחה ברמה ארגונית.',
    features: ['עיצוב רספונסיבי מתקדם', 'אופטימיזציה למנועי חיפוש מובנית', 'ממשק ניהול אינטואיטיבי', 'אבטחה ברמה ארגונית', 'מהירות טעינה מעולה (90+ PageSpeed)', 'תמיכה מלאה בעברית ו-RTL']
  },
  {
    icon: Users,
    title: 'מערכות CRM וניהול לקוחות מתקדמות',
    description: 'פתרונות מקיפים לניהול לקוחות עם אוטומציה חכמה, מעקב מכירות מתקדם ואינטגרציה מלאה עם כלי העבודה הקיימים שלכם.',
    features: ['ניהול לידים אוטומטי', 'מעקב מכירות מתקדם', 'אוטומציה של תהליכי שיווק', 'דוחות ואנליטיקה בזמן אמת', 'אינטגרציה עם WhatsApp ומייל', 'ניהול משימות ותזכורות']
  },
  {
    icon: Zap,
    title: 'בוטים חכמים ואוטומציה עסקית',
    description: 'מערכות אוטומציה מתקדמות עם בינה מלאכותית שמנהלות תהליכים עסקיים, חוסכות זמן יקר ומשפרות משמעותית את חווית הלקוח.',
    features: ['צ\'אטבוטים חכמים עם NLP', 'אוטומציה מלאה של תהליכי מכירות', 'תמיכת לקוחות 24/7', 'למידת מכונה מתמשכת', 'אינטגרציה עם מערכות קיימות', 'דוחות ביצועים מפורטים']
  },
  {
    icon: Shield,
    title: 'פלטפורמות ניהול עסקי מתקדמות',
    description: 'מערכות מקיפות לניהול כל היבטי העסק הדיגיטלי - מניהול מלאי ועד אנליטיקה מתקדמת. פתרון all-in-one שמרכז את כל הפעילות העסקית.',
    features: ['ניהול מלאי חכם ואוטומטי', 'עיבוד הזמנות מתקדם', 'ניהול תוכן דינמי', 'אנליטיקה ו-BI מתקדמים', 'ניהול ספקים ולקוחות', 'דוחות כספיים אוטומטיים']
  }
]

const specializations = [
  {
    title: 'יחסי ציבור דיגיטליים ממוקדי תוצאות',
    description: 'אסטרטגיות תקשורת מתקדמות המשלבות ניתוח נתונים, בינה מלאכותית וחשיבה יצירתית. אנחנו בונים קמפיינים שמגיעות לקהל הנכון עם המסר הנכון בזמן הנכון.',
    process: ['מחקר קהל יעד מעמיק עם AI', 'פיתוח מסרים מותאמים אישית', 'בחירת ערוצים אופטימלית', 'מדידת תוצאות בזמן אמת', 'אופטימיזציה מתמשכת']
  },
  {
    title: 'כתיבה שיווקית מקצועית וקופירייטינג מתקדם',
    description: 'תוכן שיווקי מקצועי שמשלב פסיכולוגיה צרכנית, SEO מתקדם וטכניקות כתיבה מוכחות. כל מילה נכתבת במטרה להביא תוצאות מדידות ולהגדיל המרות.',
    process: ['ניתוח מותג ותחרות מעמיק', 'פיתוח טון קול ייחודי', 'יצירת תוכן ממוקד המרות', 'A/B testing מתמשך', 'אופטימיזציה מבוססת נתונים']
  },
  {
    title: 'קידום SEO מתקדם ומדעי',
    description: 'אופטימיזציה מקצועית מבוססת מחקר ונתונים, ללא טריקים או שיטות מפוקפקות. אנחנו משתמשים בכלים מתקדמים ובמתודולוגיה מוכחת שמביאה תוצאות יציבות לטווח ארוך.',
    process: ['מחקר מילות מפתח מעמיק עם כלים מתקדמים', 'אופטימיזציה טכנית מקצועית', 'בניית תוכן איכותי וממוקד', 'בניית קישורים איכותיים', 'מעקב וניתוח מתמשך', 'דיווחים שקופים ומפורטים']
  },
  {
    title: 'שיתופי פעולה אסטרטגיים ופיתוח עסקי',
    description: 'יצירת קשרים עסקיים משמעותיים ושותפויות אסטרטגיות בארץ ובעולם. אנחנו עוזרים לעסקים להרחיב את הפעילות, למצוא שותפים איכותיים ולפתח הזדמנויות עסקיות חדשות.',
    process: ['זיהוי הזדמנויות עסקיות מתקדם', 'בניית קשרים אסטרטגיים', 'ניהול שותפויות מקצועי', 'פיתוח עסקי מתמשך', 'מעקב ביצועים ו-ROI', 'הרחבה לשווקים חדשים']
  }
]

const cities = [
  'תל אביב', 'ירושלים', 'חיפה', 'באר שבע', 'נתניה', 'אשדוד',
  'פתח תקווה', 'ראשון לציון', 'אשקלון', 'חולון', 'בת ים', 'רמת גן',
  'הרצליה', 'כפר סבא', 'רעננה', 'מודיעין', 'זכרון יעקב', 'חדרה',
  'נצרת', 'עכו', 'טבריה', 'צפת', 'אילת', 'דימונה'
]

const workProcess = [
  {
    step: '01',
    title: 'ייעוץ ראשוני',
    description: 'פגישה לבירור צרכים ויעדים'
  },
  {
    step: '02',
    title: 'תכנון אסטרטגי',
    description: 'פיתוח תוכנית עבודה מפורטת'
  },
  {
    step: '03',
    title: 'פיתוח ויישום',
    description: 'בניית הפתרון בשלבים'
  },
  {
    step: '04',
    title: 'השקה ותמיכה',
    description: 'השקה מוצלחת וליווי מתמשך'
  }
]

export const ServicesPage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              השירותים שלנו
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              פתרונות דיגיטליים מתקדמים שמתאימים בדיוק לצרכים שלכם
            </p>
          </div>
        </div>
      </section>

      {/* Fixer Core Systems */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Fixer Core Systems
            </h2>
            <p className="text-xl text-gray-600">
              הלב הפועם של עסקים חכמים
            </p>
            <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
              המערכות שלנו לא רק נראות טוב – הן חושבות בשבילך ומתאימות עצמן לצרכים המשתנים של העסק שלך.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coreServices.map((service, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-blue-100 rounded-lg ml-4">
                    <service.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {service.title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 ml-3" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Tools */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              כלים אינטגרטיביים
            </h2>
            <p className="text-xl text-gray-600">
              חיבור בין מערכות שונות ליצירת פתרון אחד מקיף
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['AI ולמידת מכונה', 'מערכות דיוור', 'WhatsApp API', 'חיבורי Supabase ו-Netlify'].map((tool, index) => (
              <div key={index} className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{tool}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              תחומי התמחות
            </h2>
            <p className="text-xl text-gray-600">
              שירותים מקצועיים לקידום העסק שלכם
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {specializations.map((spec, index) => (
              <div key={index} className="border rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {spec.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {spec.description}
                </p>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">התהליך שלנו:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {spec.process.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-center">
                        <span className="w-6 h-6 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center ml-2">
                          {stepIndex + 1}
                        </span>
                        <span className="text-sm text-gray-700">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              🏙️ שירותים מקומיים בכל הארץ
            </h2>
            <p className="text-xl text-gray-600">
              קידום מקצועי בכל רחבי ישראל
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a
              href="https://netanya.eranfixer.co.il"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow group"
            >
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600">קידום אתרים בנתניה</h3>
              <p className="text-gray-600 text-sm">שירותי SEO מקצועיים לעסקים בנתניה והסביבה</p>
            </a>
            
            <a
              href="https://telaviv.eranfixer.co.il"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow group"
            >
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600">בניית אתרים בתל אביב</h3>
              <p className="text-gray-600 text-sm">פיתוח אתרים מקצועיים במרכז הטכנולוגי של ישראל</p>
            </a>
            
            <a
              href="https://rehovot.eranfixer.co.il"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow group"
            >
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600">בניית אתרים ברחובות</h3>
              <p className="text-gray-600 text-sm">קידום חכם לעסקים מקומיים ברחובות</p>
            </a>
            
            <a
              href="https://givatada.eranfixer.co.il"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow group"
            >
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600">יחסי ציבור גבעת עדה</h3>
              <p className="text-gray-600 text-sm">שירותי יחסי ציבור ושיווק דיגיטלי</p>
            </a>
            
            <a
              href="https://eilat-pr.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow group"
            >
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600">קידום עסקים באילת</h3>
              <p className="text-gray-600 text-sm">פתרונות שיווק דיגיטלי לעסקי תיירות ונופש</p>
            </a>
            
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">ועוד ערים רבות</h3>
              <p className="text-gray-600 text-sm">שירותים מקצועיים בכל רחבי הארץ</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <a
              href="/seo-israel"
              className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
            >
              צפה בכל השירותים המקומיים
              <ArrowLeft className="w-4 h-4 mr-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Work Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              איך אנחנו עובדים
            </h2>
            <p className="text-xl text-gray-600">
              תהליך עבודה שקוף ומקצועי
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workProcess.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            מוכנים להתחיל?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            בואו נפגש ונראה איך אנחנו יכולים לקחת את העסק שלכם לשלב הבא
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/972522126366?text=היי, אני מעוניין לשמוע על השירותים שלכם"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-colors inline-flex items-center"
            >
              בואו נתחיל לעבוד בווטסאפ
              <ArrowLeft className="mr-2 w-5 h-5" />
            </a>
            <a
              href="tel:052-212-6366"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center"
            >
              <Phone className="ml-2 w-5 h-5" />
              התקשרו עכשיו
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}