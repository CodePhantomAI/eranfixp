import React from 'react'
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Twitter, Globe, ArrowLeft } from 'lucide-react'
import { GradientText } from '../ui/GradientText'

const footerLinks = {
  services: [
    { name: 'פיתוח אתרים', href: '/services' },
    { name: 'קידום SEO', href: '/seo-israel' },
    { name: 'פתרונות AI', href: 'https://ai.eranfixer.co.il' },
    { name: 'ניהול מוניטין', href: '/services' }
  ],
  company: [
    { name: 'אודות', href: '/about' },
    { name: 'תיק עבודות', href: '/portfolio' },
    { name: 'לקוחות', href: '/clients' },
    { name: 'בלוג', href: '/blog' }
  ],
  resources: [
    { name: 'מחקרים', href: '/research' },
    { name: 'שאלות נפוצות', href: '/faq' },
    { name: 'מערכת Fixer', href: '/system' },
    { name: 'צור קשר', href: '/contact' }
  ],
  legal: [
    { name: 'תנאי שימוש', href: '/terms-of-use' },
    { name: 'מדיניות פרטיות', href: '/privacy-policy' },
    { name: 'הצהרת נגישות', href: '/accessibility' }
  ]
}

const localServices = [
  { name: 'קידום אתרים בנתניה', href: 'https://netanya.eranfixer.co.il' },
  { name: 'בניית אתרים בתל אביב', href: 'https://telaviv.eranfixer.co.il' },
  { name: 'בניית אתרים ברחובות', href: 'https://rehovot.eranfixer.co.il' },
  { name: 'יחסי ציבור גבעת עדה', href: 'https://givatada.eranfixer.co.il' },
  { name: 'קידום עסקים באילת', href: 'https://eilat-pr.com' }
]

const partnerSites = [
  { name: 'מחקרי SEO מתקדמים', href: 'https://seo.eranfixer.co.il' },
  { name: 'תובנות AI לעסקים', href: 'https://ai.eranfixer.co.il' },
  { name: 'קוד פתוח ופרויקטים', href: 'https://seop.eranfixer.co.il' },
  { name: 'שיתוף מיסטר פיקס ו-AI', href: 'https://codephantomai.com' },
  { name: 'אתרים במחיר מיוחד', href: 'https://eranfixer.co.il' }
]

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center ml-3">
                <span className="text-white font-bold text-xl">EF</span>
              </div>
              <div>
                <div className="font-bold text-xl">
                  <GradientText gradient="blue">ערן פיקסר</GradientText>
                </div>
                <div className="text-gray-400 text-sm">פתרונות דיגיטליים</div>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              מומחים בקידום אתרים אורגני, בניית אתרים מקצועיים, 
              ניהול מוניטין דיגיטלי ואוטומציה מבוססת AI.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a 
                href="tel:052-212-6366" 
                className="flex items-center text-gray-300 hover:text-white transition-colors group"
              >
                <Phone className="w-4 h-4 ml-3 group-hover:animate-pulse" />
                052-212-6366
              </a>
              <a 
                href="mailto:eranfixer@gmail.com" 
                className="flex items-center text-gray-300 hover:text-white transition-colors group"
              >
                <Mail className="w-4 h-4 ml-3 group-hover:animate-pulse" />
                eranfixer@gmail.com
              </a>
              <div className="flex items-center text-gray-300">
                <MapPin className="w-4 h-4 ml-3" />
                תל אביב, ישראל
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-lg mb-6">שירותים</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-lg mb-6">החברה</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-lg mb-6">משאבים</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Local Services Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <h3 className="font-bold text-lg mb-6 text-center">
            <GradientText gradient="blue">שירותים מקומיים</GradientText>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {localServices.map((service) => (
              <a
                key={service.name}
                href={service.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-200 hover:scale-105 group"
              >
                <div className="text-sm text-gray-300 group-hover:text-white transition-colors">
                  {service.name}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Partner Sites Section */}
        <div className="mt-8 pt-8 border-t border-gray-800 overflow-hidden">
          <h3 className="font-bold text-lg mb-6 text-center">
            <GradientText gradient="purple">אתרים שותפים</GradientText>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {partnerSites.map((site) => (
              <a
                key={site.name}
                href={site.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center p-3 bg-gradient-to-r from-blue-800/50 to-purple-800/50 rounded-lg hover:from-blue-700/50 hover:to-purple-700/50 transition-all duration-200 hover:scale-105 group min-w-0"
              >
                <div className="text-sm text-gray-300 group-hover:text-white transition-colors break-words">
                  {site.name}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 space-x-reverse mb-6 md:mb-0">
              <span className="text-gray-400">עקבו אחרינו:</span>
              <div className="flex space-x-4 space-x-reverse">
                <a 
                  href="https://www.facebook.com/mrfixermusic/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform duration-200"
                  title="עקבו אחרינו בפייסבוק"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a 
                  href="https://www.instagram.com/mrfixermusic/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform duration-200"
                  title="עקבו אחרינו באינסטגרם"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/eranfixer/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform duration-200"
                  title="התחברו אלינו בלינקדאין"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="https://x.com/eranfixer" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform duration-200"
                  title="עקבו אחרינו ב-X (טוויטר)"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a 
                  href="https://www.tiktok.com/@mrfixermusics" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform duration-200"
                  title="עקבו אחרינו בטיקטוק"
                >
                  <div className="w-5 h-5 rounded bg-gradient-to-r from-pink-500 to-blue-500 flex items-center justify-center text-xs font-bold">
                    T
                  </div>
                </a>
                <a 
                  href="https://share.google/nfODajB37QMcuQsJW" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform duration-200"
                  title="המיקום שלנו בגוגל"
                >
                  <Globe className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* CTA */}
            <a
              href="https://wa.me/972522126366?text=היי, אני מעוניין לשמוע על השירותים שלכם"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-full font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 hover:scale-105 inline-flex items-center"
            >
              בואו נתחיל לעבוד
              <ArrowLeft className="w-4 h-4 mr-2" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 Eran Fixer. כל הזכויות שמורות.
            </div>
            
            <div className="flex items-center space-x-6 space-x-reverse text-sm">
              {footerLinks.legal.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}