// Auto-Sitemap System - עדכון אוטומטי של Sitemap
import { supabase } from './supabase'
import { AutoSEO } from './seo-automation'

export class AutoSitemapManager {
  private static baseUrl = 'https://eran-fixer.com'

  // עדכון אוטומטי של sitemap בכל פעם שמפרסמים תוכן
  static async updateSitemapOnContentChange() {
    try {
      console.log('AutoSitemap: Starting sitemap update...')
      
      // יצירת sitemap מעודכן
      const sitemap = await this.generateDynamicSitemap()
      
      // שמירה ב-localStorage לזמן זה (בסביבה אמיתית זה יהיה שמירה לשרת)
      localStorage.setItem('auto-generated-sitemap', sitemap)
      
      // הודעה למנועי חיפוש על העדכון
      await AutoSEO.submitToSearchConsole(`${this.baseUrl}/sitemap.xml`)
      
      console.log('AutoSitemap: Sitemap updated successfully')
      return true
    } catch (error) {
      console.error('AutoSitemap: Error updating sitemap:', error)
      return false
    }
  }

  // יצירת sitemap דינמי מהנתונים העדכניים
  private static async generateDynamicSitemap(): Promise<string> {
    const entries: Array<{
      url: string
      lastmod: string
      changefreq: string
      priority: number
    }> = []

    // דפים סטטיים עם עדיפות גבוהה
    const staticPages = [
      { url: '/', priority: 1.0, changefreq: 'weekly' },
      { url: '/services', priority: 0.9, changefreq: 'monthly' },
      { url: '/seo-israel', priority: 0.9, changefreq: 'monthly' },
      { url: '/portfolio', priority: 0.8, changefreq: 'weekly' },
      { url: '/blog', priority: 0.8, changefreq: 'daily' },
      { url: '/clients', priority: 0.7, changefreq: 'monthly' },
      { url: '/research', priority: 0.7, changefreq: 'monthly' },
      { url: '/contact', priority: 0.8, changefreq: 'monthly' },
      { url: '/about', priority: 0.6, changefreq: 'monthly' },
      { url: '/faq', priority: 0.6, changefreq: 'monthly' },
      { url: '/system', priority: 0.4, changefreq: 'monthly' }
    ]

    const today = new Date().toISOString().split('T')[0]
    
    staticPages.forEach(page => {
      entries.push({
        url: `${this.baseUrl}${page.url}`,
        lastmod: today,
        changefreq: page.changefreq,
        priority: page.priority
      })
    })

    try {
      // טעינת תוכן דינמי מהמסד
      const [pagesResult, postsResult, portfolioResult, researchResult] = await Promise.all([
        supabase.from('pages').select('slug, updated_at, status').eq('status', 'published'),
        supabase.from('blog_posts').select('slug, updated_at, status').eq('status', 'published'),
        supabase.from('portfolio_items').select('slug, updated_at, status').eq('status', 'published'),
        supabase.from('research_papers').select('slug, updated_at, status').eq('status', 'published')
      ])

      // הוספת עמודים דינמיים
      if (pagesResult.data) {
        pagesResult.data.forEach(page => {
          entries.push({
            url: `${this.baseUrl}/${page.slug}`,
            lastmod: page.updated_at.split('T')[0],
            changefreq: 'monthly',
            priority: 0.7
          })
        })
      }

      // הוספת פוסטי בלוג
      if (postsResult.data) {
        postsResult.data.forEach(post => {
          entries.push({
            url: `${this.baseUrl}/blog/${post.slug}`,
            lastmod: post.updated_at.split('T')[0],
            changefreq: 'weekly',
            priority: 0.8
          })
        })
      }

      // הוספת פרויקטים
      if (portfolioResult.data) {
        portfolioResult.data.forEach(item => {
          entries.push({
            url: `${this.baseUrl}/portfolio/${item.slug}`,
            lastmod: item.updated_at.split('T')[0],
            changefreq: 'monthly',
            priority: 0.7
          })
        })
      }

      // הוספת מחקרים
      if (researchResult.data) {
        researchResult.data.forEach(paper => {
          entries.push({
            url: `${this.baseUrl}/research/${paper.slug}`,
            lastmod: paper.updated_at.split('T')[0],
            changefreq: 'monthly',
            priority: 0.7
          })
        })
      }

    } catch (error) {
      console.error('AutoSitemap: Error loading dynamic content:', error)
    }

    // יצירת XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
`

    entries.forEach(entry => {
      sitemap += `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>
`
    })

    sitemap += '</urlset>'
    
    console.log(`AutoSitemap: Generated sitemap with ${entries.length} entries`)
    return sitemap
  }

  // הודעה לגוגל על עדכון מיידי
  static async notifySearchEngines(newPageUrl?: string) {
    try {
      if (newPageUrl) {
        console.log('AutoSitemap: Notifying search engines about new page:', newPageUrl)
        await AutoSEO.notifyGoogleOfNewPage(newPageUrl)
      }
      
      // עדכון ה-sitemap המלא
      await this.updateSitemapOnContentChange()
      
      return true
    } catch (error) {
      console.error('AutoSitemap: Error notifying search engines:', error)
      return false
    }
  }

  // בדיקה אם צריך לעדכן sitemap
  static shouldUpdateSitemap(contentType: string, oldStatus?: string, newStatus?: string): boolean {
    // עדכן sitemap אם:
    // 1. תוכן חדש נוצר עם סטטוס published
    // 2. סטטוס השתנה ל-published או מ-published
    return (
      newStatus === 'published' || 
      (oldStatus === 'published' && newStatus !== 'published')
    )
  }
}

// Hook לשימוש ברכיבים
export const useAutoSitemap = () => {
  const updateSitemapForContent = async (
    contentType: 'page' | 'blog' | 'portfolio' | 'research',
    slug: string,
    status: string,
    previousStatus?: string
  ) => {
    if (AutoSitemapManager.shouldUpdateSitemap(contentType, previousStatus, status)) {
      console.log(`AutoSitemap: Updating sitemap for ${contentType}: ${slug}`)
      
      const pageUrl = contentType === 'blog' ? `/blog/${slug}` :
                     contentType === 'portfolio' ? `/portfolio/${slug}` :
                     contentType === 'research' ? `/research/${slug}` :
                     `/${slug}`
      
      await AutoSitemapManager.notifySearchEngines(pageUrl)
    }
  }

  return { updateSitemapForContent }
}