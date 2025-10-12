import React from 'react'
import { TrendingUp, Search, Target, BarChart, CheckCircle, Star, ArrowLeft, Phone, Mail } from 'lucide-react'

const seoServices = [
  {
    icon: Search,
    title: 'מחקר מילות מפתח',
    description: 'זיהוי מילות המפתח הרלוונטיות ביותר לעסק שלכם בשוק הישראלי',
    features: ['ניתוח תחרות מקומית', 'מילות מפתח בעברית', 'כוונת חיפוש מקומית']
  },
  {
    icon: Target,
    title: 'SEO מקומי',
    description: 'אופטימיזציה למנועי חיפוש עבור עסקים מקומיים בישראל',
    features: ['Google My Business', 'ציטוטים מקומיים', 'ביקורות ודירוגים']
  },
  {
    icon: TrendingUp,
    title: 'קידום אורגני',
    description: 'שיפור דירוג האתר במנועי החיפוש לתנועה אורגנית איכותית',
    features: ['אופטימיזציה טכנית', 'תוכן איכותי', 'בניית קישורים']
  },
  {
    icon: BarChart,
    title: 'ניתוח ודיווח',
    description: 'מעקב שוטף אחר ביצועי האתר ודיווחים מפורטים',
    features: ['Google Analytics', 'Search Console', 'דיווחים חודשיים']
  }
]

const results = [
  { metric: '300%', description: 'עלייה ממוצעת בתנועה אורגנית' },
  { metric: '85%', description: 'מהלקוחות רואים תוצאות תוך 3 חודשים' },
  { metric: '150+', description: 'אתרים קודמו בהצלחה בישראל' },
  { metric: '#1', description: 'דירוג ממוצע במילות מפתח יעד' }
]

const testimonials = [
  {
    name: 'עו"ד רונית כהן',
    company: 'כהן ושות״ עורכי דין - תל אביב',
    content: 'תוך 6 חודשים עלינו למקום הראשון בגוגל עבור "עורך דין תל אביב", "עורך דין משפחה" ו"עורך דין נזיקין". מספר הפניות גדל פי 4 והאיכות שלהן משמעותית יותר גבוהה. הקידום המקומי הביא לנו לקוחות איכותיים מכל המרכז.',
    rating: 5
  },
  {
    name: 'ד"ר דני לוי',
    company: 'מרכז לוי לרפואה אסתטית - הרצליה',
    content: 'הקידום SEO המקצועי של EranFixer הביא אותנו למקומות הראשונים בגוגל עבור "בוטוקס הרצליה", "רפואה אסתטית" ו"מילוי שפתיים". המרכז מלא בלקוחות חדשים כל יום! התוצאות עלו על כל הציפיות - גידול של 280% בפניות תוך שנה.',
    rating: 5
  },
  {
    name: 'מיכל רוזן',
    company: 'רוזן נדל״ן - נתניה',
    content: 'אחרי שנים של השקעה כבדה בפרסום ממומן בגוגל ופייסבוק, סוף סוף יש לנו תנועה אורגנית איכותית שמביאה לידים חמים! הקידום המקומי הביא אותנו למקום הראשון ב"נדל"ן נתניה" ו"דירות למכירה נתניה". חסכנו אלפי שקלים בחודש על פרסום.',
    rating: 5
  }
]

const faqItems = [
  {
    question: 'כמה זמן לוקח לראות תוצאות בקידום SEO?',
    answer: 'בדרך כלל תוצאות ראשוניות נראות תוך 2-3 חודשים, אבל תוצאות משמעותיות מגיעות תוך 6-12 חודשים. זה תלוי ברמת התחרות בתחום ובמצב הנוכחי של האתר.'
  },
  {
    question: 'האם אתם מתמחים בשוק הישראלי?',
    answer: 'כן, אנחנו מתמחים בקידום אתרים בישראל ומכירים היטב את השוק המקומי, התרבות והשפה. אנחנו עובדים עם עסקים ישראליים מכל הגדלים.'
  },
  {
    question: 'מה ההבדל בין SEO מקומי לקידום רגיל?',
    answer: 'SEO מקומי מתמקד בהופעה בחיפושים גיאוגרפיים כמו "רופא שיניים תל אביב". זה כולל אופטימיזציה של Google My Business, ציטוטים מקומיים וביקורות.'
  },
  {
    question: 'איך אתם מודדים הצלחה בקידום?',
    answer: 'אנחנו מודדים הצלחה לפי מספר מדדים: עלייה בדירוג למילות מפתח יעד, גידול בתנועה אורגנית, שיפור בהמרות ובסופו של דבר - גידול בהכנסות.'
  }
]

export const SEOIsraelPage: React.FC = () => {
  React.useEffect(() => {
    // Set proper SEO for SEO Israel page
    document.title = 'קידום אתרים בישראל - SEO מקצועי לעסקים | EranFixer'

    const updateMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = name
        document.head.appendChild(meta)
      }
      meta.content = content
    }

    updateMeta('description', 'שירותי קידום אתרים SEO מקצועיים לעסקים בישראל. אופטימיזציה מקומית, מחקר מילות מפתח בעברית, ותוצאות מוכחות. הגיעו למקום הראשון בגוגל.')
    updateMeta('keywords', 'קידום אתרים, SEO ישראל, קידום אתרים בישראל, קידום בגוגל, SEO מקומי, מחקר מילות מפתח, אופטימיזציה למנועי חיפוש')

    // Add FAQ structured data
    const faqStructuredData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "כמה זמן לוקח לראות תוצאות בקידום SEO?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "בדרך כלל תוצאות ראשוניות נראות תוך 2-3 חודשים, אבל תוצאות משמעותיות מגיעות תוך 6-12 חודשים. זה תלוי ברמת התחרות בתחום ובמצב הנוכחי של האתר."
          }
        }
      ]
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-page', 'seo-israel')
    script.textContent = JSON.stringify(faqStructuredData)
    document.head.appendChild(script)

    return () => {
      const scriptToRemove = document.querySelector('script[data-page="seo-israel"]')
      if (scriptToRemove) scriptToRemove.remove()
    }
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                קידום אתרים מקצועי
                <span className="block text-blue-300">בישראל</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                SEO מותאם לשוק הישראלי - הגיעו למקום הראשון בגוגל והגדילו את מספר הלקוחות
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://wa.me/972522126366?text=היי, אני מעוניין לקבל הצעת מחיר לקידום אתרים"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-blue-900 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-colors inline-flex items-center justify-center"
                >
                  הצעת מחיר בווטסאפ
                  <ArrowLeft className="mr-2 w-5 h-5" />
                </a>
                <a
                  href="https://wa.me/972522126366"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-900 transition-colors inline-flex items-center justify-center"
                >
                  שלח הודעה בווטסאפ
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="SEO Israel"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">התוצאות מדברות בעד עצמן</h2>
            <p className="text-xl text-gray-600">נתונים אמיתיים מלקוחות שלנו בישראל</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {results.map((result, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">
                  {result.metric}
                </div>
                <div className="text-gray-600 font-medium">
                  {result.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              שירותי קידום אתרים מקצועיים
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              פתרונות SEO מותאמים אישית לעסקים ישראליים מכל הגדלים
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {seoServices.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
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

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              התהליך שלנו
            </h2>
            <p className="text-xl text-gray-600">
              4 שלבים פשוטים להצלחה בקידום אתרים
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'ניתוח ואבחון',
                description: 'בדיקה מקיפה של האתר הנוכחי וזיהוי הזדמנויות לשיפור'
              },
              {
                step: '02',
                title: 'אסטרטגיה',
                description: 'בניית תוכנית קידום מותאמת אישית לעסק ולשוק הישראלי'
              },
              {
                step: '03',
                title: 'יישום',
                description: 'ביצוע אופטימיזציות טכניות ויצירת תוכן איכותי'
              },
              {
                step: '04',
                title: 'מעקב ושיפור',
                description: 'ניטור שוטף של התוצאות ושיפורים מתמידים'
              }
            ].map((item, index) => (
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

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              מה הלקוחות שלנו אומרים
            </h2>
            <p className="text-xl text-gray-600">
              סיפורי הצלחה אמיתיים מעסקים ישראליים
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              שאלות נפוצות
            </h2>
            <p className="text-xl text-gray-600">
              תשובות לשאלות הנפוצות ביותר על קידום אתרים
            </p>
          </div>

          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.answer}
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
            מוכנים להתחיל לקדם את האתר שלכם?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            קבלו ייעוץ חינם ותוכנית קידום מותאמת אישית לעסק שלכם
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/972522126366?text=היי, אני מעוניין לקבל הצעת מחיר חינם לקידום אתרים"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-colors inline-flex items-center"
            >
              הצעת מחיר חינם בווטסאפ
              <ArrowLeft className="mr-2 w-5 h-5" />
            </a>
            <a
              href="https://seo.eranfixer.co.il"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center"
            >
              מחקרי קידום מתקדמים
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}