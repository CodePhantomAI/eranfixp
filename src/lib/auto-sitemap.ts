// Auto-Sitemap System - עדכון אוטומטי של Sitemap
// הסיטמאפ עצמו נוצר דינמית ע"י Edge Function ב-Supabase
// קובץ זה אחראי רק להודיע למנועי חיפוש על שינויים
import { AutoSEO } from './seo-automation'

export class AutoSitemapManager {
  private static baseUrl = 'https://eran-fixer.com'
  private static sitemapUrl = 'https://0ec90b57d6e95fcbda19832f.supabase.co/functions/v1/sitemap'

  // עדכון אוטומטי של sitemap בכל פעם שמפרסמים תוכן
  static async updateSitemapOnContentChange() {
    try {
      console.log('AutoSitemap: Content changed, notifying search engines...')

      // הודעה למנועי חיפוש על העדכון
      // ה-sitemap עצמו דינמי ויתעדכן אוטומטית
      await AutoSEO.submitToSearchConsole(`${this.baseUrl}/sitemap.xml`)

      // הודעה ל-IndexNow על העדכון
      await this.notifyIndexNow(`${this.baseUrl}/sitemap.xml`)

      console.log('AutoSitemap: Search engines notified successfully')
      return true
    } catch (error) {
      console.error('AutoSitemap: Error notifying search engines:', error)
      return false
    }
  }

  // הודעה ל-IndexNow על sitemap מעודכן
  private static async notifyIndexNow(url: string) {
    try {
      const response = await fetch('https://0ec90b57d6e95fcbda19832f.supabase.co/functions/v1/notify-indexnow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      })

      if (response.ok) {
        console.log('AutoSitemap: IndexNow notified successfully')
      }
    } catch (error) {
      console.error('AutoSitemap: Error notifying IndexNow:', error)
    }
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