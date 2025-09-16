// SEO Automation - יצירת Sitemap אוטומטי וOptimized מנועי חיפוש
import { supabase } from './supabase'

export interface SitemapEntry {
  url: string
  lastmod: string
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

export class AutoSEO {
  private static baseUrl = 'https://eran-fixer.com'

  // יצירת Sitemap מלא ואוטומטי
  static async generateCompleteSitemap(): Promise<string> {
    const entries: SitemapEntry[] = []
    const now = new Date().toISOString().split('T')[0]

    // דפים סטטיים בעדיפות גבוהה
    const staticPages = [
      { url: '/', priority: 1.0, changefreq: 'weekly' as const },
      { url: '/services', priority: 0.9, changefreq: 'monthly' as const },
      { url: '/seo-israel', priority: 0.9, changefreq: 'monthly' as const },
      { url: '/portfolio', priority: 0.8, changefreq: 'weekly' as const },
      { url: '/blog', priority: 0.8, changefreq: 'daily' as const },
      { url: '/clients', priority: 0.7, changefreq: 'monthly' as const },
      { url: '/research', priority: 0.7, changefreq: 'monthly' as const },
      { url: '/contact', priority: 0.8, changefreq: 'monthly' as const },
      { url: '/about', priority: 0.6, changefreq: 'monthly' as const },
      { url: '/faq', priority: 0.6, changefreq: 'monthly' as const }
    ]

    staticPages.forEach(page => {
      entries.push({
        url: `${this.baseUrl}${page.url}`,
        lastmod: now,
        changefreq: page.changefreq,
        priority: page.priority
      })
    })

    try {
      // עמודים דינמיים מהמסד נתונים
      const { data: pages } = await supabase
        .from('pages')
        .select('slug, updated_at, status')
        .eq('status', 'published')

      if (pages) {
        pages.forEach(page => {
          entries.push({
            url: `${this.baseUrl}/${page.slug}`,
            lastmod: page.updated_at.split('T')[0],
            changefreq: 'monthly',
            priority: 0.7
          })
        })
      }

      // פוסטי בלוג
      const { data: blogPosts } = await supabase
        .from('blog_posts')
        .select('slug, updated_at, status')
        .eq('status', 'published')

      if (blogPosts) {
        blogPosts.forEach(post => {
          entries.push({
            url: `${this.baseUrl}/blog/${post.slug}`,
            lastmod: post.updated_at.split('T')[0],
            changefreq: 'weekly',
            priority: 0.8
          })
        })
      }

      // פרויקטים בתיק עבודות
      const { data: portfolioItems } = await supabase
        .from('portfolio_items')
        .select('slug, updated_at, status')
        .eq('status', 'published')

      if (portfolioItems) {
        portfolioItems.forEach(item => {
          entries.push({
            url: `${this.baseUrl}/portfolio/${item.slug}`,
            lastmod: item.updated_at.split('T')[0],
            changefreq: 'monthly',
            priority: 0.7
          })
        })
      }

      // מחקרים
      const { data: researchPapers } = await supabase
        .from('research_papers')
        .select('slug, updated_at, status')
        .eq('status', 'published')

      if (researchPapers) {
        researchPapers.forEach(paper => {
          entries.push({
            url: `${this.baseUrl}/research/${paper.slug}`,
            lastmod: paper.updated_at.split('T')[0],
            changefreq: 'monthly',
            priority: 0.7
          })
        })
      }

    } catch (error) {
      console.error('Error loading dynamic content for sitemap:', error)
    }

    // בניית XML
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
    return sitemap
  }

  // שליחה אוטומטית לGoogle Search Console
  static async submitToSearchConsole(sitemapUrl: string = `${this.baseUrl}/sitemap.xml`) {
    try {
      // Google IndexNow API (חדש וחינמי)
      const indexNowUrl = 'https://api.indexnow.org/indexnow'
      
      const response = await fetch(indexNowUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          host: 'eran-fixer.com',
          key: 'eranfixer2025', // מפתח אימות פשוט
          keyLocation: `${this.baseUrl}/eranfixer2025.txt`,
          urlList: [sitemapUrl]
        })
      })

      if (response.ok) {
        console.log('Sitemap submitted to IndexNow successfully')
        return true
      }
    } catch (error) {
      console.error('Error submitting to IndexNow:', error)
    }

    return false
  }

  // יצירת Structured Data מתקדם
  static generatePageStructuredData(pageData: {
    title: string
    description: string
    url: string
    type: 'WebPage' | 'Article' | 'CreativeWork'
    datePublished?: string
    dateModified?: string
    author?: string
    image?: string
  }) {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': pageData.type,
      'headline': pageData.title,
      'description': pageData.description,
      'url': pageData.url,
      'publisher': {
        '@type': 'Organization',
        'name': 'Eran Fixer',
        'url': 'https://eran-fixer.com',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://res.cloudinary.com/dd9n4kiee/image/upload/v1754580943/ChatGPT_Image_Jul_31_2025_08_06_57_AM_zd8jvr.png'
        },
        'sameAs': [
          'https://www.facebook.com/mrfixermusic/',
          'https://www.instagram.com/mrfixermusic/',
          'https://www.linkedin.com/in/eranfixer/',
          'https://x.com/eranfixer'
        ]
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': pageData.url
      }
    }

    if (pageData.datePublished) {
      structuredData['datePublished'] = pageData.datePublished
    }
    if (pageData.dateModified) {
      structuredData['dateModified'] = pageData.dateModified
    }
    if (pageData.author) {
      structuredData['author'] = {
        '@type': 'Person',
        'name': pageData.author
      }
    }
    if (pageData.image) {
      structuredData['image'] = {
        '@type': 'ImageObject',
        'url': pageData.image
      }
    }

    return structuredData
  }

  // עדכון meta tags דינמי
  static updatePageSEO(pageData: {
    title: string
    description: string
    url: string
    image?: string
    type?: string
    publishedTime?: string
    modifiedTime?: string
  }) {
    // Update document title
    document.title = pageData.title

    // Helper function for meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`
      let meta = document.querySelector(selector) as HTMLMetaElement
      
      if (!meta) {
        meta = document.createElement('meta')
        if (property) {
          meta.setAttribute('property', name)
        } else {
          meta.setAttribute('name', name)
        }
        document.head.appendChild(meta)
      }
      
      meta.setAttribute('content', content)
    }

    // Basic SEO tags
    updateMetaTag('description', pageData.description)
    updateMetaTag('robots', 'index, follow, max-snippet:-1, max-image-preview:large')
    
    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = pageData.url

    // Open Graph tags
    updateMetaTag('og:title', pageData.title, true)
    updateMetaTag('og:description', pageData.description, true)
    updateMetaTag('og:url', pageData.url, true)
    updateMetaTag('og:type', pageData.type || 'website', true)
    updateMetaTag('og:site_name', 'Eran Fixer', true)
    updateMetaTag('og:locale', 'he_IL', true)

    if (pageData.image) {
      updateMetaTag('og:image', pageData.image, true)
      updateMetaTag('og:image:width', '1200', true)
      updateMetaTag('og:image:height', '630', true)
    }

    // Twitter tags
    updateMetaTag('twitter:card', 'summary_large_image')
    updateMetaTag('twitter:title', pageData.title)
    updateMetaTag('twitter:description', pageData.description)
    updateMetaTag('twitter:site', '@eranfixer')
    updateMetaTag('twitter:creator', '@eranfixer')
    
    if (pageData.image) {
      updateMetaTag('twitter:image', pageData.image)
      updateMetaTag('twitter:image:alt', pageData.title)
    }

    // Article tags
    if (pageData.publishedTime) {
      updateMetaTag('article:published_time', pageData.publishedTime, true)
    }
    if (pageData.modifiedTime) {
      updateMetaTag('article:modified_time', pageData.modifiedTime, true)
    }
  }

  // פונקציה להודעה לגוגל על עמוד חדש
  static async notifyGoogleOfNewPage(url: string) {
    try {
      // Google IndexNow - הודעה מיידית על עמוד חדש
      const indexNowUrl = 'https://api.indexnow.org/indexnow'
      
      const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`
      
      const response = await fetch(indexNowUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          host: 'eran-fixer.com',
          key: 'eranfixer2025',
          keyLocation: `${this.baseUrl}/eranfixer2025.txt`,
          urlList: [fullUrl]
        })
      })

      if (response.ok) {
        console.log('Page submitted to Google IndexNow:', fullUrl)
        return true
      }
    } catch (error) {
      console.error('Error notifying Google of new page:', error)
    }

    return false
  }

  // פונקציה לבדיקה אם עמוד מוכן לאינדקס
  static validatePageForIndexing(pageData: {
    title: string
    content: string
    slug: string
    meta_description?: string
  }): { canIndex: boolean; issues: string[] } {
    const issues: string[] = []

    // בדיקת כותרת
    if (!pageData.title || pageData.title.length < 10) {
      issues.push('כותרת קצרה מדי או חסרה')
    }
    if (pageData.title.length > 60) {
      issues.push('כותרת ארוכה מדי לSEO (מעל 60 תווים)')
    }

    // בדיקת תוכן
    const wordCount = pageData.content.replace(/<[^>]*>/g, '').split(/\s+/).length
    if (wordCount < 150) {
      issues.push(`תוכן קצר מדי: ${wordCount} מילים (מינימום 150)`)
    }

    // בדיקת תיאור
    if (!pageData.meta_description || pageData.meta_description.length < 120) {
      issues.push('תיאור SEO קצר מדי או חסר')
    }
    if (pageData.meta_description && pageData.meta_description.length > 160) {
      issues.push('תיאור SEO ארוך מדי (מעל 160 תווים)')
    }

    // בדיקת slug
    if (!/^[a-z0-9-]+$/.test(pageData.slug)) {
      issues.push('Slug לא תקין - רק אותיות אנגליות, מספרים ומקפים')
    }

    return {
      canIndex: issues.length === 0,
      issues
    }
  }

  // יצירת breadcrumbs מבני
  static generateBreadcrumbs(path: string) {
    const pathSegments = path.split('/').filter(Boolean)
    const breadcrumbs = [{
      '@type': 'ListItem',
      'position': 1,
      'name': 'בית',
      'item': this.baseUrl
    }]

    let currentPath = ''
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const name = this.getPageName(segment, currentPath)
      
      breadcrumbs.push({
        '@type': 'ListItem',
        'position': index + 2,
        'name': name,
        'item': `${this.baseUrl}${currentPath}`
      })
    })

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs
    }
  }

  private static getPageName(segment: string, fullPath: string): string {
    const pageNames: { [key: string]: string } = {
      'services': 'שירותים',
      'portfolio': 'תיק עבודות',
      'blog': 'בלוג',
      'research': 'מחקרים',
      'clients': 'לקוחות',
      'contact': 'צור קשר',
      'about': 'אודות',
      'faq': 'שאלות נפוצות',
      'seo-israel': 'קידום אתרים בישראל'
    }

    return pageNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
  }

  // יצירת קובץ robots.txt מתקדם
  static generateRobotsTxt(): string {
    return `# Robots.txt עבור EranFixer.com - מותאם לקידום מתקדם
User-agent: *
Allow: /

# חסימת דפי ניהול בלבד
Disallow: /admin/

# אישור מפורש למנועי חיפוש מובילים
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 2

User-agent: Slurp
Allow: /
Crawl-delay: 3

# מפת האתר המעודכנת אוטומטית
Sitemap: ${this.baseUrl}/sitemap.xml

# Host directive
Host: eran-fixer.com

# למידע נוסף למנועי חיפוש
# Site: https://eran-fixer.com
# Contact: eranfixer@gmail.com`
  }
}

// Hook לשימוש ברכיבים
export const useSEOOptimization = () => {
  const updatePageSEO = (pageData: {
    title: string
    description: string
    slug: string
    type?: 'page' | 'blog' | 'portfolio' | 'research'
    publishedTime?: string
    modifiedTime?: string
    image?: string
  }) => {
    const fullUrl = `${AutoSEO['baseUrl']}${
      pageData.type === 'blog' ? '/blog/' : 
      pageData.type === 'portfolio' ? '/portfolio/' :
      pageData.type === 'research' ? '/research/' : '/'
    }${pageData.slug}`

    AutoSEO.updatePageSEO({
      title: pageData.title,
      description: pageData.description,
      url: fullUrl,
      image: pageData.image,
      type: pageData.type === 'blog' ? 'article' : 'website',
      publishedTime: pageData.publishedTime,
      modifiedTime: pageData.modifiedTime
    })

    // הוספת Structured Data
    const structuredData = AutoSEO.generatePageStructuredData({
      title: pageData.title,
      description: pageData.description,
      url: fullUrl,
      type: pageData.type === 'blog' ? 'Article' : 'WebPage',
      datePublished: pageData.publishedTime,
      dateModified: pageData.modifiedTime,
      author: 'ערן פיקסר',
      image: pageData.image
    })

    // הוספת Breadcrumbs
    const breadcrumbs = AutoSEO.generateBreadcrumbs(fullUrl.replace(AutoSEO['baseUrl'], ''))

    // עדכון structured data בDOM
    const existingScript = document.querySelector('script[type="application/ld+json"][data-page]')
    if (existingScript) {
      existingScript.remove()
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-page', pageData.slug)
    script.textContent = JSON.stringify([structuredData, breadcrumbs])
    document.head.appendChild(script)

    // הודעה לגוגל על העמוד החדש
    AutoSEO.notifyGoogleOfNewPage(fullUrl)
  }

  return { updatePageSEO }
}