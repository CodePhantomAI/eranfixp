// Fast Indexing Checklist - רשימת בדיקות לאינדוקס מהיר
export interface FastIndexingCheck {
  id: string
  title: string
  description: string
  status: 'passed' | 'failed' | 'warning' | 'pending'
  priority: 'critical' | 'high' | 'medium' | 'low'
  autoFix: boolean
  timeToFix: string
  impact: string
}

export const fastIndexingChecklist: FastIndexingCheck[] = [
  // בדיקות קריטיות לאינדוקס מהיר
  {
    id: 'sitemap-updated',
    title: 'Sitemap מעודכן אוטומטית',
    description: 'וידוא שה-sitemap מתעדכן מיד עם תוכן חדש',
    status: 'pending',
    priority: 'critical',
    autoFix: true,
    timeToFix: '5 דקות',
    impact: 'זירוז אינדוקס פי 3-5'
  },
  {
    id: 'indexnow-api',
    title: 'IndexNow API פעיל',
    description: 'שליחה אוטומטית למנועי חיפוש על תוכן חדש',
    status: 'pending',
    priority: 'critical',
    autoFix: true,
    timeToFix: '10 דקות',
    impact: 'אינדוקס תוך שעות במקום ימים'
  },
  {
    id: 'internal-links',
    title: 'קישורים פנימיים לדפים חדשים',
    description: 'כל דף חדש מקושר מלפחות 2 דפים קיימים',
    status: 'pending',
    priority: 'high',
    autoFix: false,
    timeToFix: '15 דקות',
    impact: 'שיפור crawl depth ו-page authority'
  },
  {
    id: 'meta-tags-complete',
    title: 'Meta tags מלאים',
    description: 'כל דף חדש עם title, description, og:tags מלאים',
    status: 'pending',
    priority: 'high',
    autoFix: true,
    timeToFix: '5 דקות',
    impact: 'שיפור הבנת התוכן על ידי גוגל'
  },
  {
    id: 'structured-data',
    title: 'Structured Data מתקדם',
    description: 'Schema.org markup לכל סוגי התוכן',
    status: 'pending',
    priority: 'high',
    autoFix: true,
    timeToFix: '20 דקות',
    impact: 'Rich snippets ו-featured snippets'
  },
  {
    id: 'social-sharing',
    title: 'אופטימיזציה לשיתוף חברתי',
    description: 'מטא-טאגים מושלמים לפייסבוק, טוויטר, לינקדאין',
    status: 'pending',
    priority: 'medium',
    autoFix: true,
    timeToFix: '10 דקות',
    impact: 'זירוז crawling דרך social signals'
  },
  {
    id: 'page-speed',
    title: 'מהירות טעינה מעולה',
    description: 'Core Web Vitals בירוק (LCP < 2.5s, CLS < 0.1)',
    status: 'pending',
    priority: 'medium',
    autoFix: false,
    timeToFix: '1-2 שעות',
    impact: 'עדיפות crawling גבוהה יותר'
  },
  {
    id: 'mobile-optimization',
    title: 'אופטימיזציה מובייל מושלמת',
    description: 'Mobile-first indexing ready',
    status: 'pending',
    priority: 'medium',
    autoFix: false,
    timeToFix: '30 דקות',
    impact: 'אינדוקס מהיר יותר (Google Mobile-First)'
  },
  {
    id: 'content-quality',
    title: 'איכות תוכן גבוהה',
    description: 'תוכן ייחודי, מעמיק ורלוונטי (300+ מילים)',
    status: 'pending',
    priority: 'medium',
    autoFix: false,
    timeToFix: '1-3 שעות',
    impact: 'עדיפות אינדוקס גבוהה יותר'
  },
  {
    id: 'canonical-tags',
    title: 'Canonical URLs תקינים',
    description: 'מניעת duplicate content ובעיות אינדוקס',
    status: 'pending',
    priority: 'medium',
    autoFix: true,
    timeToFix: '5 דקות',
    impact: 'מניעת בלבול של גוגל'
  },
  {
    id: 'breadcrumbs',
    title: 'Breadcrumbs מובנים',
    description: 'ניווט היררכי ברור לגוגל ולמשתמשים',
    status: 'pending',
    priority: 'low',
    autoFix: false,
    timeToFix: '45 דקות',
    impact: 'שיפור הבנת מבנה האתר'
  }
]

// פונקציות בדיקה אוטומטיות
export class FastIndexingChecker {
  static async checkSitemapStatus(): Promise<{ passed: boolean; details: string }> {
    try {
      const response = await fetch('/sitemap.xml')
      if (!response.ok) {
        return { passed: false, details: 'Sitemap לא נגיש' }
      }
      
      const sitemapText = await response.text()
      const urlCount = (sitemapText.match(/<loc>/g) || []).length
      const lastmod = sitemapText.includes('<lastmod>')
      
      return {
        passed: urlCount > 0 && lastmod,
        details: `${urlCount} URLs, ${lastmod ? 'עם' : 'ללא'} תאריכי עדכון`
      }
    } catch (error) {
      return { passed: false, details: 'שגיאה בגישה ל-sitemap' }
    }
  }

  static async checkIndexNowAPI(): Promise<{ passed: boolean; details: string }> {
    try {
      // בדיקה שה-Edge Function פעיל
      const testUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify-indexnow`
      const response = await fetch(testUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: 'https://eran-fixer.com/test' })
      })

      return {
        passed: response.status !== 404,
        details: response.status === 404 ? 'Edge Function לא זמין' : 'IndexNow API פעיל'
      }
    } catch (error) {
      return { passed: false, details: 'שגיאה בבדיקת IndexNow API' }
    }
  }

  static checkMetaTags(): { passed: boolean; details: string } {
    const title = document.querySelector('title')?.textContent || ''
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || ''
    const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || ''
    const ogDescription = document.querySelector('meta[property="og:description"]')?.getAttribute('content') || ''
    const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content') || ''

    const issues = []
    if (title.length < 30 || title.length > 60) issues.push('Title לא אופטימלי')
    if (description.length < 120 || description.length > 160) issues.push('Description לא אופטימלי')
    if (!ogTitle) issues.push('חסר og:title')
    if (!ogDescription) issues.push('חסר og:description')
    if (!ogImage) issues.push('חסר og:image')

    return {
      passed: issues.length === 0,
      details: issues.length === 0 ? 'כל המטא-טאגים תקינים' : issues.join(', ')
    }
  }

  static checkInternalLinking(): { passed: boolean; details: string } {
    const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]')
    const externalLinks = document.querySelectorAll('a[href^="http"]')
    
    const totalLinks = internalLinks.length + externalLinks.length
    const internalRatio = totalLinks > 0 ? (internalLinks.length / totalLinks) * 100 : 0

    return {
      passed: internalLinks.length >= 5 && internalRatio >= 60,
      details: `${internalLinks.length} קישורים פנימיים (${internalRatio.toFixed(1)}% מכלל הקישורים)`
    }
  }

  static async checkPageSpeed(): Promise<{ passed: boolean; details: string }> {
    return new Promise((resolve) => {
      // מדידת ביצועים בסיסית
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
          const loadTime = navigation.loadEventEnd - navigation.loadEventStart
          
          resolve({
            passed: loadTime < 3000,
            details: `זמן טעינה: ${Math.round(loadTime)}ms`
          })
        }, 100)
      })
    })
  }
}

// אוטומציה לבדיקות
export const runFastIndexingAudit = async (): Promise<{
  score: number
  checklist: FastIndexingCheck[]
  criticalIssues: number
  recommendations: string[]
}> => {
  const checklist = [...fastIndexingChecklist]
  let passedChecks = 0
  const recommendations: string[] = []

  // הרצת בדיקות אוטומטיות
  for (const check of checklist) {
    try {
      let result: { passed: boolean; details: string }

      switch (check.id) {
        case 'sitemap-updated':
          result = await FastIndexingChecker.checkSitemapStatus()
          break
        case 'indexnow-api':
          result = await FastIndexingChecker.checkIndexNowAPI()
          break
        case 'meta-tags-complete':
          result = FastIndexingChecker.checkMetaTags()
          break
        case 'internal-links':
          result = FastIndexingChecker.checkInternalLinking()
          break
        case 'page-speed':
          result = await FastIndexingChecker.checkPageSpeed()
          break
        default:
          continue
      }

      check.status = result.passed ? 'passed' : 'failed'
      
      if (result.passed) {
        passedChecks++
      } else if (check.priority === 'critical') {
        recommendations.push(`🚨 קריטי: ${check.title} - ${result.details}`)
      } else if (check.priority === 'high') {
        recommendations.push(`⚠️ חשוב: ${check.title} - ${result.details}`)
      }
    } catch (error) {
      check.status = 'failed'
      console.error(`Error checking ${check.id}:`, error)
    }
  }

  const score = Math.round((passedChecks / checklist.filter(c => c.status !== 'pending').length) * 100)
  const criticalIssues = checklist.filter(c => c.status === 'failed' && c.priority === 'critical').length

  // המלצות כלליות
  if (score < 60) {
    recommendations.unshift('🔥 דרוש שיפור מיידי - יש בעיות שמונעות אינדוקס מהיר')
  } else if (score < 80) {
    recommendations.unshift('⚡ כמעט מושלם - עוד כמה שיפורים קטנים')
  } else {
    recommendations.unshift('🎉 מעולה! האתר מוכן לאינדוקס מהיר')
  }

  return { score, checklist, criticalIssues, recommendations }
}