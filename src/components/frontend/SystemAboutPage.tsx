import React from 'react'
import { Shield, Zap, Globe, TrendingUp, Code, Database, Smartphone, Search, Award, CheckCircle, ArrowLeft } from 'lucide-react'

const advantages = [
  {
    icon: Shield,
    title: 'אבטחה',
    comparison: 'מול WordPress / Wix',
    description: 'Supabase Auth + RLS → רמת אבטחה ארגונית, ללא פרצות נפוצות של וורדפרס.'
  },
  {
    icon: Zap,
    title: 'ביצועים',
    comparison: 'React 18 + Vite',
    description: 'טעינה מיידית, מותאם לקידום אורגני.'
  },
  {
    icon: Search,
    title: 'SEO מתקדם',
    comparison: 'ללא תוספים',
    description: 'ניהול 301, Structured Data, Sitemap אוטומטי. לא תוספים חיצוניים – הכל בליבה.'
  },
  {
    icon: Smartphone,
    title: 'ממשק משתמש',
    comparison: 'Tailwind + RTL',
    description: 'חווית משתמש מודרנית, מותאמת 100% למובייל ולעברית.'
  },
  {
    icon: Globe,
    title: 'גמישות עסקית',
    comparison: 'All-in-One',
    description: 'ניהול בלוג, מחקרים, תיק עבודות, לקוחות והמלצות – תחת מערכת אחת.'
  },
  {
    icon: Code,
    title: 'שליטה מלאה',
    comparison: 'קוד פתוח',
    description: 'קוד פתוח, ללא נעילה לספק.'
  }
]

const coreFeatures = [
  {
    category: 'Frontend ציבורי',
    features: ['דפי שירותים', 'בלוג', 'תיק עבודות', 'לקוחות', 'מחקרים', 'SEO לוקאלי', 'שאלות נפוצות', 'אודות', 'צור קשר']
  },
  {
    category: 'Backend ניהולי',
    features: ['דשבורד', 'ניהול עמודים', 'בלוג', 'פרויקטים', 'לקוחות', 'מחקרים', 'הפניות 301', 'ניהול מדיה']
  },
  {
    category: 'Database Architecture',
    features: ['8 טבלאות מרכזיות', 'pages', 'blog_posts', 'blog_categories', 'portfolio_items', 'clients', 'research_papers', 'redirects', 'media']
  },
  {
    category: 'עיצוב ו־UX',
    features: ['Dark/Light Mode', 'RTL מלא', 'עיצוב רספונסיבי', 'אינטגרציה עם Lucide Icons']
  },
  {
    category: 'אינטגרציות',
    features: ['Cloudinary למדיה', 'WhatsApp ליצירת קשר', 'Google Analytics', 'Social Media']
  }
]

const competitiveAdvantages = [
  { metric: 'Performance', value: 'טעינת דפים מהירה פי 3 לעומת וורדפרס' },
  { metric: 'SEO Built-in', value: 'אין צורך בתוספים חיצוניים → מערכת מוכנה ל־Google מהיום הראשון' },
  { metric: 'Scalability', value: 'מתאימה לסטארטאפ קטן כמו גם למותג בינלאומי' },
  { metric: 'Security by Design', value: 'אבטחה בברירת מחדל, לא כאופציה' },
  { metric: 'Future Proof', value: 'מבוסס טכנולוגיות מודרניות (React, Supabase, Vite) – לא מערכות ישנות שמגבילות צמיחה' }
]

const businessPurpose = [
  'אתר תדמית עם ניהול עצמאי',
  'תשתית SEO מתקדמת לקידום אורגני',
  'פורטפוליו, בלוג ומחקרים מקצועיים תחת מערכת אחת',
  'פלטפורמה גמישה לצמיחה עתידית (Multi-Language, Multi-Site)'
]

export const SystemAboutPage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Fixer CMS Engine
            </h1>
            <p className="text-2xl text-blue-100 mb-4">
              Next-Generation Content & Business Platform
            </p>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-blue-100 leading-relaxed">
                דור חדש של מערכות ניהול תוכן – פלטפורמה מודולרית, מאובטחת ומותאמת לעסקים שרוצים יותר מאתר. 
                המערכת נבנתה מתוך ניסיון מצטבר של שנים בשיווק דיגיטלי, פיתוח מתקדם וניהול SEO מורכב.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
            💡 החזון
          </h2>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl">
            <p className="text-2xl text-gray-800 font-medium leading-relaxed">
              לא עוד אתר – אלא תשתית חכמה שמנהלת נכסים דיגיטליים, 
              מייצרת ערך עסקי, ומביאה תוצאות מדידות.
            </p>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              🚀 יתרונות מרכזיים
            </h2>
            <p className="text-xl text-gray-600">
              מול WordPress / Wix
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-blue-100 rounded-lg ml-4">
                    <advantage.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {advantage.title}
                    </h3>
                    <p className="text-sm text-blue-600 font-medium">
                      {advantage.comparison}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {advantage.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              🛠️ תכונות ליבה
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {feature.category}
                </h3>
                <ul className="space-y-2">
                  {feature.features.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competitive Advantages */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              📊 יתרון תחרותי
            </h2>
          </div>

          <div className="space-y-6">
            {competitiveAdvantages.map((advantage, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    {advantage.metric}
                  </h3>
                  <Award className="w-6 h-6 text-yellow-400" />
                </div>
                <p className="text-blue-100 mt-2 leading-relaxed">
                  {advantage.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Purpose */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              🎯 ייעוד עסקי
            </h2>
            <p className="text-xl text-gray-600">
              Fixer CMS Engine נועדה לעסקים, מותגים וחברות שרוצות:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {businessPurpose.map((purpose, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold ml-4">
                    {index + 1}
                  </div>
                  <p className="text-gray-800 font-medium">
                    {purpose}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Positioning */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
            🏆 המיצוב
          </h2>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl">
            <h3 className="text-3xl font-bold mb-4">
              Fixer CMS Engine = Professional Business CMS
            </h3>
            <p className="text-xl text-blue-100">
              מערכת שמביאה את היתרונות של Enterprise CMS, 
              בפשטות ובעלות הגיונית.
            </p>
          </div>
        </div>
      </section>

      {/* Technical Stack */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              ⚡ הטכנולוגיות
            </h2>
            <p className="text-xl text-gray-600">
              מבוסס על הטכנולוגיות המתקדמות ביותר
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: 'React 18', color: 'bg-blue-100 text-blue-800' },
              { name: 'TypeScript', color: 'bg-blue-100 text-blue-800' },
              { name: 'Vite', color: 'bg-purple-100 text-purple-800' },
              { name: 'Supabase', color: 'bg-green-100 text-green-800' },
              { name: 'Tailwind CSS', color: 'bg-cyan-100 text-cyan-800' },
              { name: 'Lucide Icons', color: 'bg-orange-100 text-orange-800' }
            ].map((tech, index) => (
              <div key={index} className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${tech.color}`}>
                  {tech.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              📊 הסטטיסטיקות
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">קבצים נוצרו</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">8</div>
              <div className="text-gray-600">טבלאות בבסיס הנתונים</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">15+</div>
              <div className="text-gray-600">דפים באתר הציבורי</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">100%</div>
              <div className="text-gray-600">responsive - עובד על כל המכשירים</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            מעוניינים במערכת דומה?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Fixer CMS Engine זמינה לעסקים שרוצים פלטפורמה מתקדמת ומקצועית
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/972522126366?text=היי, אני מעוניין במערכת Fixer CMS Engine"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-colors inline-flex items-center"
            >
              בואו נדבר על המערכת
              <ArrowLeft className="mr-2 w-5 h-5" />
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-block"
            >
              צור קשר לפרטים
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}