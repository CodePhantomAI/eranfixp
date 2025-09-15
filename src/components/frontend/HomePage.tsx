import React from 'react'
import { useEffect } from 'react'
import { ArrowLeft, CheckCircle, Star, Globe, Zap, Shield, TrendingUp, Users, Award } from 'lucide-react'
import { AnimatedCounter } from '../ui/AnimatedCounter'
import { AnimatedSection } from '../ui/AnimatedSection'
import { GradientText } from '../ui/GradientText'
import { TypewriterText } from '../ui/TypewriterText'
import { Card } from '../ui/Card'
import { LazyImage } from '../ui/LazyImage'

const services = [
  {
    icon: Globe,
    title: 'פיתוח אתרים מתקדמים',
    description: 'אתרים מקצועיים עם טכנולוגיות חדישות - React, TypeScript, Supabase. מערכות CMS מותאמות אישית שגדלות עם העסק שלכם.',
    features: ['עיצוב רספונסיבי מתקדם', 'מהירות טעינה מעולה (90+ בPageSpeed)', 'SEO מובנה ומותאם', 'אבטחה ברמה ארגונית', 'ממשק ניהול פשוט ואינטואיטיבי']
  },
  {
    icon: TrendingUp,
    title: 'קידום SEO מקצועי',
    description: 'קידום אורגני מתקדם עם מתודולוגיה מוכחת. מחקר עמוק, אופטימיזציה טכנית ובניית תוכן איכותי שמביא תוצאות מדידות.',
    features: ['מחקר מילות מפתח מעמיק', 'אופטימיזציה טכנית מתקדמת', 'בניית קישורים איכותיים', 'ניתוח תחרות מקצועי', 'דיווחים שקופים ומפורטים']
  },
  {
    icon: Zap,
    title: 'אוטומציה חכמה מבוססת AI',
    description: 'פתרונות בינה מלאכותית מתקדמים לאוטומציה עסקית. צ\'אטבוטים חכמים, ניהול לידים אוטומטי ומערכות תמיכה 24/7.',
    features: ['צ\'אטבוטים מתקדמים עם NLP', 'אוטומציה של תהליכי מכירות', 'ניתוח נתונים חכם', 'אינטגרציה עם מערכות קיימות', 'למידת מכונה מתמשכת']
  },
  {
    icon: Shield,
    title: 'ניהול מוניטין דיגיטלי (ORM)',
    description: 'שמירה וחיזוק המוניטין הדיגיטלי עם ניטור 24/7, דחיקת תוצאות שליליות ובניית נוכחות חיובית ברשת.',
    features: ['ניטור מוניטין בזמן אמת', 'דחיקת תוצאות שליליות', 'ניהול ביקורות מקצועי', 'יחסי ציבור דיגיטליים', 'בניית תוכן חיובי ואותנטי']
  }
]

const stats = [
  { number: 250, suffix: '+', label: 'פרויקטים הושלמו בהצלחה' },
  { number: 98, suffix: '%', label: 'שביעות רצון לקוחות' },
  { number: 7, suffix: '+', label: 'שנות ניסיון מוכח' },
  { number: 24, suffix: '/7', label: 'תמיכה טכנית מקצועית' }
]

const testimonials = [
  {
    name: 'עו"ד דוד כהן',
    company: 'כהן ושות״ עורכי דין - תל אביב',
    content: 'EranFixer בנו לנו אתר מדהים עם מערכת CRM מתקדמת שהגדילה את מספר הפניות ב-300%. הקידום SEO הביא אותנו למקום הראשון בגוגל עבור "עורך דין תל אביב". השירות מקצועי, אמין ותוצאות מדידות!',
    rating: 5
  },
  {
    name: 'ד"ר שרה לוי',
    company: 'מרפאת לוי לרפואה אסתטית - הרצליה',
    content: 'הקידום SEO המקצועי של EranFixer הביא אותנו למקומות הראשונים בגוגל עבור "רפואה אסתטית הרצליה" ו"בוטוקס". המכירות עלו ב-250% תוך 8 חודשים! הצ\'אטבוט החכם שלהם מנהל 70% מהפניות הראשוניות.',
    rating: 5
  },
  {
    name: 'מיכאל רוזן',
    company: 'רוזן טכנולוגיות - פתח תקווה',
    content: 'פתרונות ה-AI המתקדמים של EranFixer חסכו לנו 15 שעות עבודה בשבוע! המערכת האוטומטית לניהול לידים הגדילה את ההמרות ב-180%. השקעה שמחזירה את עצמה תוך 3 חודשים.',
    rating: 5
  },
  {
    name: 'רונית אברהם',
    company: 'אברהם נדל"ן - נתניה',
    content: 'האתר החדש עם מערכת ניהול הנכסים המתקדמת שינה לנו את העסק! הקידום המקומי הביא אותנו למקום הראשון ב"נדל"ן נתניה". מספר הפניות גדל פי 5!',
    rating: 5
  },
  {
    name: 'אלון דהן',
    company: 'דהן השקעות - ראשון לציון',
    content: 'המערכת החכמה לניהול לקוחות וה-CRM המותאם אישית חסכו לנו זמן רב ושיפרו את השירות. הניהול האוטומטי של הפורטפוליו מדהים!',
    rating: 5
  }
]

const typewriterTexts = [
  'פתרונות דיגיטליים חכמים',
  'קידום אתרים מקצועי',
  'אוטומציה עסקית מתקדמת',
  'ניהול מוניטין דיגיטלי'
]

export const HomePage: React.FC = () => {
  useEffect(() => {
    // Set proper SEO for homepage
    document.title = 'ערן פיקסר – מומחה קידום אתרים ופתרונות AI דיגיטליים | EranFixer.com'
    
    // Add proper structured data for homepage
    const structuredData = {
      "@context": "https://schema.org",
      "@type": ["Organization", "LocalBusiness"],
      "name": "Eran Fixer",
      "alternateName": "ערן פיקסר",
      "url": "https://eran-fixer.com",
      "logo": "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      "description": "ערן פיקסר - מומחה מוכח בקידום אתרים אורגני, בניית אתרים מקצועיים, פתרונות בינה מלאכותית ואוטומציה עסקית לעסקים בישראל ובעולם",
      "founder": {
        "@type": "Person",
        "name": "ערן פיקסר"
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IL",
        "addressRegion": "מרכז",
        "addressLocality": "תל אביב"
      },
      "telephone": "+972-52-212-6366",
      "email": "eranfixer@gmail.com",
      "priceRange": "$$",
      "openingHours": ["Mo-Th 09:00-18:00", "Fr 09:00-14:00"],
      "serviceArea": {
        "@type": "Country",
        "name": "Israel"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "שירותים דיגיטליים",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "קידום אתרים אורגני",
              "description": "קידום SEO מקצועי לעסקים ישראליים",
              "provider": {
                "@type": "Organization",
                "name": "Eran Fixer"
              }
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "בניית אתרים מקצועיים",
              "description": "פיתוח אתרים עם טכנולוגיות מתקדמות"
            }
          }
        ]
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "150",
        "bestRating": "5"
      }
    }

    // Add structured data to page
    const existingScript = document.querySelector('script[type="application/ld+json"]:not([data-page])')
    if (existingScript) {
      existingScript.remove()
    }
    
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-page', 'homepage')
    script.textContent = JSON.stringify(structuredData)
    document.head.appendChild(script)

    // Ensure page is visible and loaded
    document.body.style.visibility = 'visible'
    document.body.style.opacity = '1'
    
    return () => {
      // Cleanup
      const scriptToRemove = document.querySelector('script[data-page="homepage"]')
      if (scriptToRemove) {
        scriptToRemove.remove()
      }
    }
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden" role="banner">
        <div className="absolute inset-0 bg-black/20">
          {/* Animated background elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-blue-400/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-400/10 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white/5 rounded-full animate-ping"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection animation="slideRight" className="overflow-hidden">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                <GradientText gradient="blue">ערן פיקסר</GradientText> – 
                <span className="block mt-2">
                  <TypewriterText 
                    texts={typewriterTexts}
                    className="text-blue-300"
                  />
                </span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                <span className="text-white font-bold">מומחה מוכח</span> בקידום אתרים אורגני (SEO), בניית אתרים מקצועיים עם React ו-TypeScript, 
                ניהול מוניטין דיגיטלי ואוטומציה מבוססת בינה מלאכותית. 
                <span className="text-white font-bold">7+ שנות ניסיון</span> עם <span className="text-white font-bold">250+ לקוחות מרוצים</span> בישראל ובעולם.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://wa.me/972522126366?text=היי, אני מעוניין לשמוע על השירותים שלכם"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-blue-900 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-colors inline-flex items-center justify-center"
                  aria-label="שלח הודעה בוואטסאפ לערן פיקסר"
                >
                  שלח הודעה בווטסאפ
                  <ArrowLeft className="mr-2 w-5 h-5" />
                </a>
                <a
                  href="https://eranfixer.co.il"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-900 transition-colors inline-flex items-center"
                  aria-label="בקר באתר האינטרנט לאתרים במחיר מיוחד"
                >
                  אתר ב-29.90₪ לחודש
                </a>
                <a
                  href="/portfolio"
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-900 transition-colors inline-flex items-center justify-center"
                  aria-label="צפה בתיק העבודות של ערן פיקסר"
                >
                  צפו בעבודות שלנו
                </a>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="slideLeft" delay={300} className="hidden lg:block">
              <div className="relative">
                <LazyImage
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="צוות עובד על פתרונות דיגיטליים מתקדמים"
                  className="rounded-2xl shadow-2xl"
                  priority={true}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent rounded-2xl"></div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {stats.map((stat, index) => (
              <AnimatedSection 
                key={index} 
                animation="slideUp" 
                delay={index * 100}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2 relative">
                  <AnimatedCounter 
                    end={stat.number} 
                    suffix={stat.suffix}
                    duration={2000 + index * 200}
                  />
                  {/* Decorative element */}
                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
                </div>
                <div className="text-gray-600 font-medium relative">
                  {stat.label}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeIn" className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              <GradientText>השירותים שלנו</GradientText>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              פתרונות דיגיטליים מקצועיים שמביאים תוצאות מדידות
            </p>
            <div className="mt-6">
              <a
                href="https://eranfixer.co.il"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
              >
                אתרים במחיר מיוחד - 29.90₪ לחודש
                <ArrowLeft className="w-4 h-4 mr-2" />
              </a>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <AnimatedSection 
                key={index} 
                animation="slideUp" 
                delay={index * 150}
              >
                <Card variant="default" className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                {index === 0 && <h3 className="sr-only">בניית אתרים מקצועיים מותאמים אישית</h3>}
                {index === 1 && <h3 className="sr-only">קידום אתרים אורגני לעסקים</h3>}
                {index === 2 && <h3 className="sr-only">אוטומציה חכמה מבוססת בינה מלאכותית</h3>}
                {index === 3 && <h3 className="sr-only">ניהול מוניטין דיגיטלי ושיווק חכם</h3>}
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-blue-100 rounded-lg ml-4 group-hover:bg-blue-200 transition-colors">
                    <service.icon className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
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
                
                {/* Service-specific links */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  {index === 0 && (
                    <div className="space-y-1">
                      <a href="https://telaviv.eranfixer.co.il" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 hover:text-blue-700">
                      בניית אתרים בתל אביב →
                      </a>
                      <a href="https://eranfixer.co.il" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 hover:text-blue-700">
                        אתרים במחיר מיוחד →
                      </a>
                    </div>
                  )}
                  {index === 1 && (
                    <div className="space-y-1">
                      <a href="https://seo.eranfixer.co.il" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 hover:text-blue-700">
                      מחקרי SEO מתקדמים →
                      </a>
                      <a href="https://netanya.eranfixer.co.il" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 hover:text-blue-700">
                        קידום אתרים בנתניה →
                      </a>
                    </div>
                  )}
                  {index === 2 && (
                    <div className="space-y-1">
                      <a href="https://ai.eranfixer.co.il" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 hover:text-blue-700">
                      תובנות AI לעסקים →
                      </a>
                      <a href="https://codephantomai.com" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 hover:text-blue-700">
                        שיתוף מיסטר פיקס ו-AI →
                      </a>
                    </div>
                  )}
                  {index === 3 && (
                    <div className="space-y-1">
                      <a href="https://givatada.eranfixer.co.il" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 hover:text-blue-700">
                      יחסי ציבור מקצועיים →
                      </a>
                      <a href="https://eilat-pr.com" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 hover:text-blue-700">
                        קידום עסקים באילת →
                      </a>
                    </div>
                  )}
                </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection animation="slideRight">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                למה לבחור ב-<GradientText>EranFixer</GradientText>?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="p-2 bg-blue-100 rounded-lg ml-4 mt-1 animate-pulse">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      מומחיות מוכחת
                    </h3>
                    <p className="text-gray-600">
                      צוות של מומחים עם ניסיון רב בתחום הדיגיטל והטכנולוגיה
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-2 bg-blue-100 rounded-lg ml-4 mt-1">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      תוצאות מדידות
                    </h3>
                    <p className="text-gray-600">
                      אנחנו מתמקדים בתוצאות מדידות שמשפיעות על השורה התחתונה
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-2 bg-blue-100 rounded-lg ml-4 mt-1">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      חדשנות טכנולוגית
                    </h3>
                    <p className="text-gray-600">
                      שימוש בטכנולוגיות המתקדמות ביותר כולל פתרונות AI
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-2 bg-blue-100 rounded-lg ml-4 mt-1">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      ערך לטווח ארוך
                    </h3>
                    <p className="text-gray-600">
                      בניית פתרונות שגדלים עם העסק ומספקים ערך לטווח ארוך
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection animation="slideLeft" delay={200}>
              <LazyImage
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
                alt="Team collaboration"
                className="rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeIn" className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              מה <GradientText gradient="green">הלקוחות שלנו</GradientText> אומרים
            </h2>
            <p className="text-xl text-gray-600">
              הצלחות שמדברות בעד עצמן
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <AnimatedSection 
                key={index} 
                animation="slideUp" 
                delay={index * 200}
              >
                <Card className="hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current group-hover:animate-pulse" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed relative">
                  "{testimonial.content}"
                  <span className="absolute -top-2 -right-2 text-4xl text-blue-200 opacity-50">"</span>
                </p>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {testimonial.company}
                  </div>
                </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="scale">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            מוכנים להתחיל?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            בואו נדבר על איך אנחנו יכולים לעזור לכם להגיע ליעדים הדיגיטליים שלכם
            </p>
            <a
            href="https://wa.me/972522126366?text=היי, אני מעוניין לשמוע על השירותים של Eran Fixer"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 hover:scale-105 transition-all duration-300 inline-flex items-center shadow-lg hover:shadow-xl"
            >
            שלח הודעה בווטסאפ
            <ArrowLeft className="mr-2 w-5 h-5" />
            </a>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}