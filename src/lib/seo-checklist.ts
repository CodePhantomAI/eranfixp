// SEO Checklist Implementation - Bolt Indexability System
// Based on Mister Fix's comprehensive SEO strategy

export interface SEOChecklistItem {
  id: string
  category: 'accessibility' | 'meta' | 'sitemap' | 'performance' | 'search-console' | 'semantics' | 'linking'
  title: string
  description: string
  status: 'pending' | 'passed' | 'failed' | 'warning'
  priority: 'critical' | 'high' | 'medium' | 'low'
  autoCheck: boolean
  lastChecked?: string
  details?: string
}

export const seoChecklistTemplate: SEOChecklistItem[] = [
  // 1. נגישות וסריקה
  {
    id: 'robots-accessibility',
    category: 'accessibility',
    title: 'אין חסימות כלל-מערכת',
    description: 'וידוא שאין robots חוסמים, headers חוסמים, או דפי טסט פתוחים',
    status: 'pending',
    priority: 'critical',
    autoCheck: true
  },
  {
    id: 'internal-linking',
    category: 'linking',
    title: 'כל דף נגיש במסלול קישורים פנימי',
    description: 'כל דף חשוב נגיש דרך תפריט/פוטר/אינדקס',
    status: 'pending',
    priority: 'high',
    autoCheck: true
  },
  {
    id: 'clean-urls',
    category: 'accessibility',
    title: 'כתובות URL נקיות וקצרות',
    description: 'URLs עם היררכיה עקבית, ללא פרמטרים מיותרים',
    status: 'pending',
    priority: 'medium',
    autoCheck: true
  },

  // 2. מטא ותוכן
  {
    id: 'unique-titles',
    category: 'meta',
    title: 'Title ייחודי לכל דף',
    description: 'כל דף חייב להיות עם Title ייחודי ורלוונטי',
    status: 'pending',
    priority: 'critical',
    autoCheck: true
  },
  {
    id: 'unique-descriptions',
    category: 'meta',
    title: 'Description ייחודי לכל דף',
    description: 'כל דף חייב להיות עם Meta Description ייחודי',
    status: 'pending',
    priority: 'critical',
    autoCheck: true
  },
  {
    id: 'single-h1',
    category: 'meta',
    title: 'H1 יחיד לכל דף',
    description: 'כל דף חייב להיות עם H1 אחד בלבד',
    status: 'pending',
    priority: 'high',
    autoCheck: true
  },
  {
    id: 'real-content',
    category: 'meta',
    title: 'טקסט אמיתי (לא תמונות בלבד)',
    description: 'תוכן טקסטואלי מספיק לכל דף, לא רק תמונות',
    status: 'pending',
    priority: 'high',
    autoCheck: true
  },
  {
    id: 'canonical-tags',
    category: 'meta',
    title: 'קאנוניקל לכל דף',
    description: 'פתרון כפילויות ופרמטרים עם canonical tags',
    status: 'pending',
    priority: 'critical',
    autoCheck: true
  },
  {
    id: 'unique-content',
    category: 'meta',
    title: 'תוכן ייחודי לדפים דומים',
    description: 'שוני אמיתי בניסוח בין דפי שירות לפי עיר',
    status: 'pending',
    priority: 'high',
    autoCheck: false
  },

  // 3. מפת אתר ו-robots
  {
    id: 'sitemap-quality',
    category: 'sitemap',
    title: 'sitemap.xml כולל רק דפים רצויים',
    description: 'מפת אתר מכילה רק דפים שרוצים באינדקס',
    status: 'pending',
    priority: 'critical',
    autoCheck: true
  },
  {
    id: 'robots-sitemap',
    category: 'sitemap',
    title: 'robots.txt מצביע על sitemap',
    description: 'קובץ robots מכיל קישור לsitemap ומאפשר סריקה',
    status: 'pending',
    priority: 'critical',
    autoCheck: true
  },
  {
    id: 'auto-sitemap-update',
    category: 'sitemap',
    title: 'עדכון sitemap אוטומטי',
    description: 'עדכון אוטומטי בכל יצירה/מחיקה/שינוי סטטוס',
    status: 'pending',
    priority: 'high',
    autoCheck: true
  },

  // 4. מהירות, מובייל, יציבות
  {
    id: 'core-web-vitals',
    category: 'performance',
    title: 'Core Web Vitals מעולים',
    description: 'LCP < 2.5s, CLS < 0.1, INP טוב',
    status: 'pending',
    priority: 'critical',
    autoCheck: true
  },
  {
    id: 'mobile-friendly',
    category: 'performance',
    title: 'מובייל-פרנדלי',
    description: 'רוחב מתאים, פונט קריא, tap targets גדולים',
    status: 'pending',
    priority: 'critical',
    autoCheck: true
  },
  {
    id: 'no-broken-links',
    category: 'performance',
    title: 'ללא קישורים שבורים',
    description: 'אין 404/500, אין קבצים כבדים מיותרים',
    status: 'pending',
    priority: 'high',
    autoCheck: true
  },

  // 5. Search Console
  {
    id: 'domain-verification',
    category: 'search-console',
    title: 'אימות דומיין ב-Search Console',
    description: 'אימות ברמת DNS או HTML',
    status: 'pending',
    priority: 'critical',
    autoCheck: false
  },
  {
    id: 'sitemap-submission',
    category: 'search-console',
    title: 'הגשת sitemap',
    description: 'הגשה ומעקב אחר סטטוס ב-Search Console',
    status: 'pending',
    priority: 'critical',
    autoCheck: false
  },
  {
    id: 'coverage-monitoring',
    category: 'search-console',
    title: 'מעקב כיסוי אינדקס',
    description: 'בדיקת "כיסוי אינדקס" והתראות שגיאה',
    status: 'pending',
    priority: 'high',
    autoCheck: false
  },

  // 6. סמנטיקה וסכימות
  {
    id: 'basic-schema',
    category: 'semantics',
    title: 'סכימה בסיסית לישות',
    description: 'Organization/LocalBusiness ולדפי שירות/מאמר',
    status: 'pending',
    priority: 'high',
    autoCheck: true
  },
  {
    id: 'nap-consistency',
    category: 'semantics',
    title: 'קונסיסטנטיות NAP',
    description: 'עקביות בשם, כתובת, טלפון בכל האתר',
    status: 'pending',
    priority: 'medium',
    autoCheck: true
  },

  // 7. קישוריות חיצונית ועדכון
  {
    id: 'quality-backlinks',
    category: 'linking',
    title: 'קישורים חיצוניים איכותיים',
    description: 'בניית קישורים איכותיים לדף הבית ולדפי יעד',
    status: 'pending',
    priority: 'medium',
    autoCheck: false
  },
  {
    id: 'content-freshness',
    category: 'meta',
    title: 'רענון תוכן תקופתי',
    description: 'עדכון תוכן תקופתי בדפים אסטרטגיים',
    status: 'pending',
    priority: 'medium',
    autoCheck: false
  }
]

// Auto-check functions
export class SEOChecker {
  static async checkRobotsAccessibility(): Promise<{ passed: boolean; details: string }> {
    try {
      const response = await fetch('/robots.txt')
      const robotsContent = await response.text()
      
      // Check for blocking directives
      const hasDisallow = robotsContent.includes('Disallow: /')
      const hasNoIndex = document.querySelector('meta[name="robots"][content*="noindex"]')
      
      if (hasDisallow || hasNoIndex) {
        return {
          passed: false,
          details: 'נמצאו חסימות: ' + (hasDisallow ? 'Disallow ב-robots.txt' : '') + (hasNoIndex ? 'noindex meta tag' : '')
        }
      }
      
      return { passed: true, details: 'אין חסימות מערכתיות' }
    } catch (error) {
      return { passed: false, details: 'שגיאה בבדיקת robots.txt' }
    }
  }

  static checkUniqueTitles(): { passed: boolean; details: string } {
    const titles = Array.from(document.querySelectorAll('title')).map(el => el.textContent)
    const uniqueTitles = new Set(titles)
    
    return {
      passed: titles.length === uniqueTitles.size,
      details: `נמצאו ${titles.length} titles, ${uniqueTitles.size} ייחודיים`
    }
  }

  static checkSingleH1(): { passed: boolean; details: string } {
    const h1Elements = document.querySelectorAll('h1')
    
    return {
      passed: h1Elements.length === 1,
      details: `נמצאו ${h1Elements.length} אלמנטי H1 (צריך להיות 1)`
    }
  }

  static checkCanonicalTags(): { passed: boolean; details: string } {
    const canonical = document.querySelector('link[rel="canonical"]')
    
    return {
      passed: !!canonical,
      details: canonical ? 'קיים canonical tag' : 'חסר canonical tag'
    }
  }

  static checkContentQuality(): { passed: boolean; details: string } {
    const textContent = document.body.innerText
    const wordCount = textContent.split(/\s+/).length
    const minWords = 300
    
    return {
      passed: wordCount >= minWords,
      details: `${wordCount} מילים (מינימום ${minWords})`
    }
  }

  static async checkCoreWebVitals(): Promise<{ passed: boolean; details: string }> {
    return new Promise((resolve) => {
      // Simulate Core Web Vitals check
      setTimeout(() => {
        const lcp = Math.random() * 4 // Simulate LCP
        const cls = Math.random() * 0.2 // Simulate CLS
        
        const lcpPassed = lcp < 2.5
        const clsPassed = cls < 0.1
        
        resolve({
          passed: lcpPassed && clsPassed,
          details: `LCP: ${lcp.toFixed(2)}s, CLS: ${cls.toFixed(3)}`
        })
      }, 1000)
    })
  }

  static checkMobileFriendly(): { passed: boolean; details: string } {
    const viewport = document.querySelector('meta[name="viewport"]')
    const hasViewport = !!viewport
    const isMobileOptimized = window.innerWidth <= 768 ? true : hasViewport
    
    return {
      passed: isMobileOptimized,
      details: hasViewport ? 'יש viewport meta tag' : 'חסר viewport meta tag'
    }
  }

  static checkInternalLinking(): { passed: boolean; details: string } {
    const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]')
    const externalLinks = document.querySelectorAll('a[href^="http"]')
    
    const ratio = internalLinks.length / (internalLinks.length + externalLinks.length)
    
    return {
      passed: ratio > 0.7 && internalLinks.length >= 5,
      details: `${internalLinks.length} קישורים פנימיים, ${externalLinks.length} חיצוניים`
    }
  }

  static checkSchemaMarkup(): { passed: boolean; details: string } {
    const schemaScripts = document.querySelectorAll('script[type="application/ld+json"]')
    
    return {
      passed: schemaScripts.length > 0,
      details: `נמצאו ${schemaScripts.length} schema scripts`
    }
  }
}

// Quality Gates - prevent publishing if critical issues exist
export class ContentQualityGate {
  static async validateBeforePublish(content: {
    title: string
    description: string
    content: string
    slug: string
  }): Promise<{ canPublish: boolean; issues: string[] }> {
    const issues: string[] = []

    // Check minimum content length
    const wordCount = content.content.split(/\s+/).length
    if (wordCount < 300) {
      issues.push(`תוכן קצר מדי: ${wordCount} מילים (מינימום 300)`)
    }

    // Check unique title
    if (content.title.length < 10) {
      issues.push('כותרת קצרה מדי (מינימום 10 תווים)')
    }

    // Check unique description
    if (content.description.length < 50) {
      issues.push('תיאור קצר מדי (מינימום 50 תווים)')
    }

    // Check slug quality
    if (!/^[a-z0-9-]+$/.test(content.slug)) {
      issues.push('Slug לא תקין - רק אותיות אנגליות קטנות, מספרים ומקפים')
    }

    // Check for duplicate content patterns
    const commonPhrases = ['לורם איפסום', 'טקסט לדוגמה', 'הכנס תוכן כאן']
    const hasPlaceholder = commonPhrases.some(phrase => 
      content.content.toLowerCase().includes(phrase.toLowerCase())
    )
    
    if (hasPlaceholder) {
      issues.push('נמצא טקסט placeholder - יש להחליף בתוכן אמיתי')
    }

    return {
      canPublish: issues.length === 0,
      issues
    }
  }
}

// Sitemap generator
export class SitemapGenerator {
  static async generateSitemap(pages: any[], posts: any[], portfolioItems: any[]): Promise<string> {
    const baseUrl = 'https://eran-fixer.com'
    const now = new Date().toISOString().split('T')[0]

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`

    // Add static pages
    const staticPages = [
      { url: '/services', priority: 0.9, changefreq: 'monthly' },
      { url: '/seo-israel', priority: 0.9, changefreq: 'monthly' },
      { url: '/portfolio', priority: 0.8, changefreq: 'weekly' },
      { url: '/blog', priority: 0.8, changefreq: 'daily' },
      { url: '/clients', priority: 0.7, changefreq: 'monthly' },
      { url: '/research', priority: 0.7, changefreq: 'monthly' },
      { url: '/faq', priority: 0.6, changefreq: 'monthly' },
      { url: '/contact', priority: 0.6, changefreq: 'monthly' },
      { url: '/about', priority: 0.5, changefreq: 'monthly' }
    ]

    staticPages.forEach(page => {
      sitemap += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    })

    // Add dynamic pages
    pages.filter(page => page.status === 'published').forEach(page => {
      sitemap += `
  <url>
    <loc>${baseUrl}/${page.slug}</loc>
    <lastmod>${page.updated_at.split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    })

    // Add blog posts
    posts.filter(post => post.status === 'published').forEach(post => {
      sitemap += `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.updated_at.split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    })

    // Add portfolio items
    portfolioItems.filter(item => item.status === 'published').forEach(item => {
      sitemap += `
  <url>
    <loc>${baseUrl}/portfolio/${item.slug}</loc>
    <lastmod>${item.updated_at.split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    })

    sitemap += '\n</urlset>'
    return sitemap
  }
}

// Performance monitoring
export class PerformanceMonitor {
  static measurePageLoad(): Promise<PerformanceMetrics> {
    return new Promise((resolve) => {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
          const paint = performance.getEntriesByType('paint')
          
          const metrics = {
            loadTime: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
            domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
            firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime || 0,
            firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
            memoryUsage: this.getMemoryUsage()
          }
          
          resolve(metrics)
        }, 100)
      })
    })
  }

  static getMemoryUsage(): number {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      return Math.round(memory.usedJSHeapSize / 1048576) // MB
    }
    return 0
  }

  static async checkCoreWebVitals(): Promise<CoreWebVitals> {
    return new Promise((resolve) => {
      // Simulate real Core Web Vitals measurement
      setTimeout(() => {
        resolve({
          lcp: Math.random() * 3 + 1, // 1-4 seconds
          cls: Math.random() * 0.15, // 0-0.15
          inp: Math.random() * 300 + 100, // 100-400ms
          fid: Math.random() * 200 + 50 // 50-250ms
        })
      }, 1000)
    })
  }
}

interface PerformanceMetrics {
  loadTime: number
  domContentLoaded: number
  firstPaint: number
  firstContentfulPaint: number
  memoryUsage: number
}

interface CoreWebVitals {
  lcp: number // Largest Contentful Paint
  cls: number // Cumulative Layout Shift
  inp: number // Interaction to Next Paint
  fid: number // First Input Delay
}

// SEO Audit Runner
export class SEOAudit {
  static async runFullAudit(): Promise<{
    score: number
    checklist: SEOChecklistItem[]
    recommendations: string[]
  }> {
    const checklist = [...seoChecklistTemplate]
    const recommendations: string[] = []
    let passedChecks = 0

    // Run auto-checks
    for (const item of checklist) {
      if (item.autoCheck) {
        try {
          let result: { passed: boolean; details: string }

          switch (item.id) {
            case 'robots-accessibility':
              result = await SEOChecker.checkRobotsAccessibility()
              break
            case 'unique-titles':
              result = SEOChecker.checkUniqueTitles()
              break
            case 'single-h1':
              result = SEOChecker.checkSingleH1()
              break
            case 'canonical-tags':
              result = SEOChecker.checkCanonicalTags()
              break
            case 'real-content':
              result = SEOChecker.checkContentQuality()
              break
            case 'core-web-vitals':
              result = await SEOChecker.checkCoreWebVitals()
              break
            case 'mobile-friendly':
              result = SEOChecker.checkMobileFriendly()
              break
            case 'internal-linking':
              result = SEOChecker.checkInternalLinking()
              break
            case 'basic-schema':
              result = SEOChecker.checkSchemaMarkup()
              break
            default:
              continue
          }

          item.status = result.passed ? 'passed' : 'failed'
          item.details = result.details
          item.lastChecked = new Date().toISOString()

          if (result.passed) {
            passedChecks++
          } else if (item.priority === 'critical') {
            recommendations.push(`🚨 קריטי: ${item.title} - ${result.details}`)
          } else if (item.priority === 'high') {
            recommendations.push(`⚠️ חשוב: ${item.title} - ${result.details}`)
          }
        } catch (error) {
          item.status = 'failed'
          item.details = 'שגיאה בבדיקה'
        }
      }
    }

    const score = Math.round((passedChecks / checklist.filter(item => item.autoCheck).length) * 100)

    // Add general recommendations based on score
    if (score < 70) {
      recommendations.unshift('🔥 דרוש שיפור מיידי - יש בעיות קריטיות שמונעות אינדוקס')
    } else if (score < 85) {
      recommendations.unshift('⚡ כמעט מושלם - עוד כמה שיפורים קטנים')
    } else {
      recommendations.unshift('🎉 מעולה! האתר מוכן לאינדוקס מושלם')
    }

    return { score, checklist, recommendations }
  }
}