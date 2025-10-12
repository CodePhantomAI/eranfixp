import React from 'react'
import { Globe, TrendingUp, Zap, Shield, CheckCircle, Target, Users, Award, Lightbulb } from 'lucide-react'

const specializations = [
  {
    icon: TrendingUp,
    title: 'SEO וקידום אורגני',
    description: 'הופעה יציבה במנועי חיפוש, עם תוכן איכותי וקישורים נכונים.',
    features: ['מחקר מילות מפתח מעמיק', 'אופטימיזציה טכנית מתקדמת', 'בניית קישורים איכותיים', 'ניטור ודיווח שוטף']
  },
  {
    icon: Globe,
    title: 'בניית אתרים מקצועיים',
    description: 'אתרים מותאמים אישית, רספונסיביים ומהירים.',
    features: ['עיצוב מותאם אישית', 'טכנולוגיות מתקדמות', 'מהירות טעינה מעולה', 'ממשק ניהול פשוט']
  },
  {
    icon: Shield,
    title: 'ניהול מוניטין דיגיטלי (ORM)',
    description: 'ניטור, דחיקת תוצאות שליליות ובניית תדמית חיובית.',
    features: ['ניטור מוניטין 24/7', 'דחיקת תוצאות שליליות', 'בניית תוכן חיובי', 'ניהול ביקורות ברשת']
  },
  {
    icon: Zap,
    title: 'אוטומציה מבוססת AI',
    description: 'מערכות חכמות לניהול לידים, אוטומציה בשיווק ותהליכי שירות.',
    features: ['צ\'אטבוטים חכמים', 'אוטומציה שיווקית', 'ניהול לידים אוטומטי', 'ניתוח נתונים מתקדם']
  }
]

const values = [
  {
    icon: Target,
    title: 'מיקוד בתוצאות',
    description: 'כל פרויקט מתחיל במטרות ברורות ונמדד בתוצאות מדידות'
  },
  {
    icon: Users,
    title: 'שירות אישי',
    description: 'כל לקוח מקבל יחס אישי ופתרון מותאם לצרכים הייחודיים שלו'
  },
  {
    icon: Award,
    title: 'מקצועיות ללא פשרות',
    description: 'אנחנו מתעדכנים בטכנולוגיות החדשות ומיישמים שיטות עבודה מתקדמות'
  },
  {
    icon: Lightbulb,
    title: 'חדשנות מתמדת',
    description: 'תמיד מחפשים דרכים חדשות ויצירתיות לפתור אתגרים דיגיטליים'
  }
]

export const AboutPage: React.FC = () => {
  React.useEffect(() => {
    document.title = 'אודות EranFixer - מומחה פתרונות דיגיטליים ו-SEO בישראל'

    const updateMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = name
        document.head.appendChild(meta)
      }
      meta.content = content
    }

    updateMeta('description', 'למדו על EranFixer - מיזם דיגיטלי חדשני המתמחה בקידום אתרים, פיתוח מתקדם ופתרונות AI. 7+ שנות ניסיון עם 250+ פרויקטים מצליחים בישראל.')
    updateMeta('keywords', 'אודות EranFixer, על EranFixer, ערן פיקסר, חברת קידום אתרים, מומחה SEO, פיתוח אתרים בישראל')

    // Add Person structured data
    const personData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "ערן פיקסר",
      "alternateName": "Eran Fixer",
      "description": "מומחה בקידום אתרים, פיתוח אתרים ופתרונות בינה מלאכותית לעסקים",
      "jobTitle": "מומחה פתרונות דיגיטליים",
      "telephone": "+972-52-212-6366",
      "email": "eranfixer@gmail.com",
      "url": "https://eran-fixer.com",
      "sameAs": [
        "https://www.linkedin.com/in/eranfixer",
        "https://www.facebook.com/eranfixer"
      ]
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-page', 'about')
    script.textContent = JSON.stringify(personData)
    document.head.appendChild(script)

    return () => {
      const scriptToRemove = document.querySelector('script[data-page="about"]')
      if (scriptToRemove) scriptToRemove.remove()
    }
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              אודות ערן פיקסר - מומחה פתרונות דיגיטליים
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              מיזם דיגיטלי חדשני המתמחה בקידום SEO, פיתוח אתרים ופתרונות AI לעסקים בישראל
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">הסיפור שלנו</h2>
          </div>
          
          <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
            <p className="text-xl mb-8">
              ערן פיקסר (Eran Fixer) הוא מיזם דיגיטלי חדשני שהוקם ב-2018 ומתמחה בבניית תשתיות טכנולוגיות חכמות לעסקים בישראל ובעולם.
              החברה נוסדה מתוך חזון ברור: להעניק לעסקים מכל הגדלים יתרון תחרותי אמיתי באמצעות טכנולוגיות מתקדמות, 
              קידום אתרים אורגני מקצועי, בניית אתרים עם סטנדרטים גבוהים, ניהול מוניטין דיגיטלי מתקדם, 
              ופתרונות אוטומציה מבוססי בינה מלאכותית שמשנים את אופן הפעילות העסקית.
            </p>
            
            <p className="text-lg mb-8">
              בבסיס הפעילות עומדת ההבנה העמוקה שעסקים מודרניים צריכים היום לא רק אתר יפה או נוכחות דיגיטלית בסיסית, 
              אלא מערכת דיגיטלית שלמה ומתקדמת – מהירה, חכמה, נגישה, מאובטחת וידידותית למנועי חיפוש. 
              אנחנו מאמינים שטכנולוגיה צריכה לשרת את העסק ולא להסבך אותו, ולכן אנחנו בונים פתרונות שהם 
              גם מתקדמים טכנולוגית וגם פשוטים לשימוש יומיומי.
            </p>
            
            <p className="text-lg mb-8">
              הצוות שלנו מורכב ממומחים בתחומי פיתוח תוכנה, עיצוב UX/UI, קידום אתרים, שיווק דיגיטלי ובינה מלאכותית. 
              כל חבר צוות מביא ניסיון של שנים בתחומו, ויחד אנחנו יוצרים פתרונות שמשלבים את הטוב ביותר מכל העולמות.
              אנחנו לא רק בונים אתרים - אנחנו בונים מערכות עסקיות שמניבות תוצאות מדידות ומשפרות את השורה התחתונה.
            </p>
          </div>
        </div>
      </section>

      {/* Specializations Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              🎯 תחומי התמחות
            </h2>
            <p className="text-xl text-gray-600">
              פתרונות מקצועיים לכל צורך דיגיטלי
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {specializations.map((spec, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-blue-100 rounded-lg ml-4">
                    <spec.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {spec.title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {spec.description}
                </p>
                <ul className="space-y-2">
                  {spec.features.map((feature, featureIndex) => (
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

      {/* Vision Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">
            💡 החזון שלנו
          </h2>
          <div className="text-xl text-blue-100 leading-relaxed space-y-6">
            <p>
              אנחנו מאמינים ביכולת של כל עסק – קטן או גדול – לפרוץ קדימה בעולם הדיגיטלי.
            </p>
            <p>
              המטרה שלנו היא לאפשר ללקוחות ליהנות מתשתיות אונליין מהירות, חכמות ויעילות, 
              עם שירות אישי ותוצאה שנמדדת במספרים אמיתיים.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              הערכים שלנו
            </h2>
            <p className="text-xl text-gray-600">
              העקרונות שמנחים אותנו בכל פרויקט
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="p-4 bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            מוכנים להתחיל את המסע הדיגיטלי שלכם?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            בואו נדבר על איך אנחנו יכולים לעזור לכם להגיע ליעדים שלכם
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/972522126366?text=היי, אני מעוניין לשמוע על השירותים שלכם"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-colors inline-block"
            >
              בואו נתחיל לעבוד יחד
            </a>
            <a
              href="https://ai.eranfixer.co.il"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition-colors inline-block"
            >
              תובנות AI לעסקים
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}