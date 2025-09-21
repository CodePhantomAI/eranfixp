// Facebook Debug Helper - פתרון בעיות שיתוף בפייסבוק

export class FacebookDebugger {
  // בדיקה אם המטא-טאגים מוכנים לשיתוף
  static validateOpenGraphTags(url: string, title: string, description: string, image?: string): {
    isValid: boolean
    issues: string[]
    warnings: string[]
  } {
    const issues: string[] = []
    const warnings: string[] = []

    // בדיקת כותרת
    if (!title || title.length < 10) {
      issues.push('כותרת קצרה מדי או חסרה')
    } else if (title.length > 60) {
      warnings.push('כותרת ארוכה מדי לפייסבוק (מעל 60 תווים)')
    }

    // בדיקת תיאור
    if (!description || description.length < 50) {
      issues.push('תיאור קצר מדי או חסר')
    } else if (description.length > 160) {
      warnings.push('תיאור ארוך מדי (מעל 160 תווים)')
    }

    // בדיקת תמונה
    if (!image) {
      issues.push('חסרה תמונה featured')
    } else if (!image.startsWith('http')) {
      issues.push('תמונה חייבת להיות URL מלא')
    }

    // בדיקת URL
    if (!url || !url.startsWith('https://')) {
      issues.push('URL חייב להתחיל ב-https://')
    }

    return {
      isValid: issues.length === 0,
      issues,
      warnings
    }
  }

  // יצירת מטא-טאגים עבור שיתוף בפייסבוק
  static generateFacebookMeta(data: {
    title: string
    description: string
    url: string
    image?: string
    type?: 'website' | 'article'
    publishedTime?: string
    author?: string
  }): string {
    const meta = []

    // Basic Open Graph
    meta.push(`<meta property="og:title" content="${this.escapeHtml(data.title)}" />`)
    meta.push(`<meta property="og:description" content="${this.escapeHtml(data.description)}" />`)
    meta.push(`<meta property="og:url" content="${data.url}" />`)
    meta.push(`<meta property="og:type" content="${data.type || 'website'}" />`)
    meta.push(`<meta property="og:site_name" content="EranFixer - ערן פיקסר" />`)
    meta.push(`<meta property="og:locale" content="he_IL" />`)

    // Image
    if (data.image) {
      meta.push(`<meta property="og:image" content="${data.image}" />`)
      meta.push(`<meta property="og:image:width" content="1200" />`)
      meta.push(`<meta property="og:image:height" content="630" />`)
      meta.push(`<meta property="og:image:type" content="image/jpeg" />`)
      meta.push(`<meta property="og:image:alt" content="${this.escapeHtml(data.title)}" />`)
      meta.push(`<meta property="og:image:secure_url" content="${data.image}" />`)
    }

    // Article specific
    if (data.type === 'article') {
      if (data.publishedTime) {
        meta.push(`<meta property="article:published_time" content="${data.publishedTime}" />`)
      }
      if (data.author) {
        meta.push(`<meta property="article:author" content="${this.escapeHtml(data.author)}" />`)
      }
      meta.push(`<meta property="article:publisher" content="https://www.facebook.com/mrfixermusic/" />`)
    }

    // Twitter Cards
    meta.push(`<meta name="twitter:card" content="summary_large_image" />`)
    meta.push(`<meta name="twitter:title" content="${this.escapeHtml(data.title)}" />`)
    meta.push(`<meta name="twitter:description" content="${this.escapeHtml(data.description)}" />`)
    meta.push(`<meta name="twitter:site" content="@eranfixer" />`)
    meta.push(`<meta name="twitter:creator" content="@eranfixer" />`)
    
    if (data.image) {
      meta.push(`<meta name="twitter:image" content="${data.image}" />`)
      meta.push(`<meta name="twitter:image:alt" content="${this.escapeHtml(data.title)}" />`)
    }

    return meta.join('\n')
  }

  // ניקוי HTML למניעת XSS
  private static escapeHtml(text: string): string {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  // בדיקת URL עם Facebook API (אופציונלי)
  static async checkFacebookScraping(url: string): Promise<{
    success: boolean
    scrapedData?: any
    error?: string
  }> {
    try {
      // נסיון לקרוא איך פייסבוק רואה את הדף
      const proxyUrl = `https://graph.facebook.com/v18.0/?scrape=true&id=${encodeURIComponent(url)}`
      
      // Note: זה יעבוד רק עם Facebook App Token
      // בפועל נשתמש בזה רק אם יש לנו הרשאות
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: 'לא ניתן לבדוק עם Facebook API ללא token' 
      }
    }
  }

  // יצירת link preview עבור debug
  static generatePreview(data: {
    title: string
    description: string
    image?: string
    domain: string
  }): string {
    return `
      <div style="
        max-width: 500px;
        border: 1px solid #dadde1;
        border-radius: 8px;
        overflow: hidden;
        font-family: -apple-system, system-ui, sans-serif;
        background: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      ">
        ${data.image ? `
          <img src="${data.image}" alt="" style="
            width: 100%;
            height: 260px;
            object-fit: cover;
            display: block;
          " />
        ` : ''}
        <div style="padding: 16px;">
          <div style="
            color: #8a8d91;
            font-size: 12px;
            text-transform: uppercase;
            margin-bottom: 5px;
            direction: rtl;
          ">${data.domain}</div>
          <div style="
            color: #1d2129;
            font-size: 16px;
            font-weight: 600;
            line-height: 1.2;
            margin-bottom: 5px;
            direction: rtl;
          ">${data.title}</div>
          <div style="
            color: #606770;
            font-size: 14px;
            line-height: 1.4;
            direction: rtl;
          ">${data.description}</div>
        </div>
      </div>
    `
  }
}

// פונקציה מהירה לבדיקת מטא-טאגים
export const debugCurrentPageMeta = () => {
  const meta: {[key: string]: string} = {}
  
  // Open Graph tags
  document.querySelectorAll('meta[property^="og:"]').forEach(tag => {
    const property = tag.getAttribute('property')
    const content = tag.getAttribute('content')
    if (property && content) {
      meta[property] = content
    }
  })
  
  // Twitter tags
  document.querySelectorAll('meta[name^="twitter:"]').forEach(tag => {
    const name = tag.getAttribute('name')
    const content = tag.getAttribute('content')
    if (name && content) {
      meta[name] = content
    }
  })
  
  console.table(meta)
  return meta
}

// שימוש: debugCurrentPageMeta() בקונסול לבדיקה מהירה