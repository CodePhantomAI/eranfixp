import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '../../contexts/ThemeContext'
import { SearchProvider } from '../../contexts/SearchContext'
import { FrontendLayout } from './Layout'
import { HomePage } from './HomePage'
import { ContactPage } from './ContactPage'
import { ServicesPage } from './ServicesPage'
import { BlogPage } from './BlogPage'
import { PortfolioPage } from './PortfolioPage'
import { ClientsPage } from './ClientsPage'
import { ResearchPage } from './ResearchPage'
import { SEOIsraelPage } from './SEOIsraelPage'
import { FAQPage } from './FAQPage'
import { AboutPage } from './AboutPage'
import { AccessibilityPage } from './AccessibilityPage'
import { PrivacyPolicyPage } from './PrivacyPolicyPage'
import { TermsOfUsePage } from './TermsOfUsePage'
import { DynamicPage } from './DynamicPage'
import { SystemAboutPage } from './SystemAboutPage'
import { FloatingButtons } from './FloatingButtons'
import { BackToTop } from '../ui/BackToTop'
import { PerformanceMonitor } from '../ui/PerformanceMonitor'
import { SearchModal } from '../ui/SearchModal'
import { ReadingProgress } from '../ui/ReadingProgress'
import { CookieConsent } from '../ui/CookieConsent'

export const FrontendApp: React.FC = () => {
  return (
    <ThemeProvider>
      <SearchProvider>
        <FrontendLayout>
          <FloatingButtons />
          <BackToTop />
          <SearchModal />
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/research" element={<ResearchPage />} />
            <Route path="/seo-israel" element={<SEOIsraelPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/accessibility" element={<AccessibilityPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-use" element={<TermsOfUsePage />} />
            <Route path="/system" element={<SystemAboutPage />} />
            
            {/* Dynamic content pages - order matters! */}
            <Route path="/blog/:slug" element={<DynamicPage />} />
            <Route path="/portfolio/:slug" element={<DynamicPage />} />
            <Route path="/research/:slug" element={<DynamicPage />} />
            
            {/* 404 fallback - catches everything else */}
            <Route path="/:slug" element={<DynamicPage />} />
            <Route path="*" element={
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    הדף לא נמצא
                  </h1>
                  <p className="text-xl text-gray-600 mb-8">
                    הדף שחיפשתם לא קיים או הועבר למיקום אחר
                  </p>
                  <a
                    href="/"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block"
                  >
                    חזור לדף הבית
                  </a>
                  <div className="mt-4">
                    <a
                      href="/blog"
                      className="text-blue-600 hover:text-blue-700 transition-colors mx-2"
                    >
                      בלוג
                    </a>
                    <span className="text-gray-400">|</span>
                    <a
                      href="/portfolio"
                      className="text-blue-600 hover:text-blue-700 transition-colors mx-2"
                    >
                      תיק עבודות
                    </a>
                    <span className="text-gray-400">|</span>
                    <a
                      href="/contact"
                      className="text-blue-600 hover:text-blue-700 transition-colors mx-2"
                    >
                      צור קשר
                    </a>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </FrontendLayout>
      </SearchProvider>
    </ThemeProvider>
  )
}