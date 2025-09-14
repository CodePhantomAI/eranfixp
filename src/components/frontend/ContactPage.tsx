import React, { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import { Button } from '../ui/Button'
import { AnimatedSection } from '../ui/AnimatedSection'
import { GradientText } from '../ui/GradientText'
import { Card } from '../ui/Card'
import toast from 'react-hot-toast'

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const services = [
    'פיתוח אתרים מתקדמים',
    'קידום SEO מקצועי',
    'פתרונות AI ואוטומציה',
    'ניהול מוניטין דיגיטלי (ORM)',
    'מערכות CRM מותאמות אישית',
    'יחסי ציבור דיגיטליים',
    'ייעוץ אסטרטגי דיגיטלי',
    'אינטגרציות מערכות',
    'אבטחת מידע ופרטיות',
    'אחר'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('אנא מלא את כל השדות הנדרשים')
      return
    }
    
    // Create WhatsApp message
    const message = `היי, אני ${formData.name}
${formData.company ? `מחברת: ${formData.company}` : ''}
${formData.email ? `אימייל: ${formData.email}` : ''}
${formData.phone ? `טלפון: ${formData.phone}` : ''}
${formData.service ? `מעוניין ב: ${formData.service}` : ''}

הודעה: ${formData.message}`

    const whatsappUrl = `https://wa.me/972522126366?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    
    toast.success('מעביר אותך לווטסאפ...')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="scale">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              בואו נדבר על הפרויקט שלכם
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              ערן פיקסר כאן כדי לעזור לכם להגשים את החזון הדיגיטלי שלכם. 
              צרו קשר ונתחיל לתכנן את הפתרון המושלם עבורכם.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <AnimatedSection animation="slideRight" className="lg:col-span-2">
              <Card variant="elevated" padding="lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  <GradientText>שלחו לנו הודעה</GradientText>
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        שם מלא *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-blue-400"
                        placeholder="השם שלכם"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        אימייל *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-blue-400"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        טלפון
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-blue-400"
                        placeholder="050-123-4567"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        שם החברה
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-blue-400"
                        placeholder="שם החברה שלכם"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      איזה שירות מעניין אתכם?
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-blue-400"
                    >
                      <option value="">בחרו שירות</option>
                      {services.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ספרו לנו על הפרויקט *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-blue-400"
                      placeholder="תארו את הפרויקט שלכם, המטרות והציפיות..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 text-lg hover:scale-105 transition-all duration-300"
                  >
                    {isSubmitting ? (
                      'שולח...'
                    ) : (
                      <>
                        <Send className="w-5 h-5 ml-2" />
                        שלח הודעה
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </AnimatedSection>

            {/* Contact Info */}
            <AnimatedSection animation="slideLeft" delay={300} className="space-y-8">
              {/* Contact Details */}
              <Card variant="elevated">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  <GradientText>פרטי התקשרות</GradientText>
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg ml-4 animate-pulse">
                      <Phone className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">טלפון</div>
                      <a href="tel:052-212-6366" className="text-gray-600 hover:text-blue-600 transition-colors hover:underline">052-212-6366</a>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg ml-4 animate-pulse" style={{ animationDelay: '0.5s' }}>
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">אימייל</div>
                      <a href="mailto:eranfixer@gmail.com" className="text-gray-600 hover:text-blue-600 transition-colors hover:underline">eranfixer@gmail.com</a>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg ml-4 animate-pulse" style={{ animationDelay: '1s' }}>
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">כתובת</div>
                      <div className="text-gray-600">תל אביב, ישראל</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg ml-4 animate-pulse" style={{ animationDelay: '1.5s' }}>
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">שעות פעילות</div>
                      <div className="text-gray-600">
                        א׳-ה׳: 9:00-18:00<br />
                        ו׳: 9:00-14:00
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Why Contact Us */}
              <Card variant="default" className="bg-gradient-to-br from-blue-50 to-purple-50">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  <GradientText gradient="purple">למה לפנות אלינו?</GradientText>
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-1 ml-3 animate-pulse" />
                    <div className="text-gray-700">
                      <strong>ייעוץ חינם</strong> - קבלו ייעוץ ראשוני ללא עלות
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-1 ml-3 animate-pulse" style={{ animationDelay: '0.5s' }} />
                    <div className="text-gray-700">
                      <strong>מענה מהיר</strong> - נחזור אליכם תוך 24 שעות
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-1 ml-3 animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="text-gray-700">
                      <strong>פתרון מותאם</strong> - כל פרויקט מותאם אישית
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-1 ml-3 animate-pulse" style={{ animationDelay: '1.5s' }} />
                    <div className="text-gray-700">
                      <strong>ליווי מלא</strong> - מהרעיון ועד ההשקה
                    </div>
                  </div>
                </div>
                
                {/* Related Services */}
                <div className="mt-6 pt-6 border-t border-blue-200">
                  <h4 className="font-medium text-gray-900 mb-3">שירותים מקומיים</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm space-y-1">
                    <a href="https://netanya.eranfixer.co.il" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline transition-all">
                      קידום בנתניה
                    </a>
                    <a href="https://telaviv.eranfixer.co.il" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline transition-all">
                      אתרים בתל אביב
                    </a>
                    <a href="https://rehovot.eranfixer.co.il" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline transition-all">
                      אתרים ברחובות
                    </a>
                    <a href="https://givatada.eranfixer.co.il" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline transition-all">
                      יח״צ גבעת עדה
                    </a>
                  </div>
                </div>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  )
}