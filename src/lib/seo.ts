// SEO optimization utilities

interface SEOData {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  canonical?: string
}

export const updateSEOTags = (data: SEOData) => {
  // Update title
  document.title = data.title

  // Ensure page is visible for crawlers
  document.body.style.visibility = 'visible'
  document.body.style.opacity = '1'

  // Update or create meta tags
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

  // Basic meta tags
  updateMetaTag('description', data.description)
  if (data.keywords) {
    updateMetaTag('keywords', data.keywords.join(', '))
  }
  if (data.author) {
    updateMetaTag('author', data.author)
  }

  // Canonical URL - CRITICAL for Facebook
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }
  canonical.href = data.canonical || data.url || window.location.href

  // Open Graph tags - CRITICAL for Facebook
  updateMetaTag('og:title', data.title, true)
  updateMetaTag('og:description', data.description, true)
  updateMetaTag('og:type', data.type || 'website', true)
  updateMetaTag('og:site_name', 'EranFixer - ערן פיקסר', true)
  updateMetaTag('og:locale', 'he_IL', true)
  
  if (data.url) {
    updateMetaTag('og:url', data.url, true)
  }
  
  if (data.image) {
    updateMetaTag('og:image', data.image, true)
    updateMetaTag('og:image:width', '1200', true)
    updateMetaTag('og:image:height', '630', true)
    updateMetaTag('og:image:alt', data.title, true)
    updateMetaTag('og:image:type', 'image/jpeg', true)
    updateMetaTag('og:image:secure_url', data.image, true)
  }

  if (data.publishedTime) {
    updateMetaTag('article:published_time', data.publishedTime, true)
    updateMetaTag('article:author', data.author || 'ערן פיקסר', true)
  }

  if (data.modifiedTime) {
    updateMetaTag('article:modified_time', data.modifiedTime, true)
  }

  // Twitter Card tags - also affects Facebook
  updateMetaTag('twitter:card', 'summary_large_image')
  updateMetaTag('twitter:title', data.title)
  updateMetaTag('twitter:description', data.description)
  updateMetaTag('twitter:site', '@eranfixer')
  updateMetaTag('twitter:creator', '@eranfixer')
  
  if (data.image) {
    updateMetaTag('twitter:image', data.image)
    updateMetaTag('twitter:image:alt', data.title)
  }

  // Additional Facebook tags for better sharing
  updateMetaTag('og:updated_time', new Date().toISOString(), true)
  
  // Ensure image has all required attributes for Facebook
  if (data.image) {
    updateMetaTag('og:image:secure_url', data.image, true)
    updateMetaTag('og:image:type', 'image/png', true)
  }
  
  // Force visibility for crawlers
  document.body.style.visibility = 'visible'
  document.body.style.opacity = '1'
  document.body.style.background = '#ffffff'

  // Additional SEO tags for better crawling
  updateMetaTag('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1')
  updateMetaTag('googlebot', 'index, follow')
  updateMetaTag('bingbot', 'index, follow')
  updateMetaTag('facebookbot', 'index, follow')
}

export const generateStructuredData = (type: string, data: any) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data
  }

  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]')
  if (existingScript) {
    existingScript.remove()
  }

  // Add new structured data
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(structuredData)
  document.head.appendChild(script)
}

export const generateBreadcrumbs = (path: string) => {
  const pathSegments = path.split('/').filter(Boolean)
  const breadcrumbs = [
    { name: 'בית', url: '/' }
  ]

  let currentPath = ''
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    breadcrumbs.push({
      name: segment.charAt(0).toUpperCase() + segment.slice(1),
      url: currentPath
    })
  })

  return breadcrumbs
}

// Sitemap generation helper
export const generateSitemapEntry = (url: string, lastmod?: string, changefreq?: string, priority?: number) => {
  return {
    url,
    lastmod: lastmod || new Date().toISOString().split('T')[0],
    changefreq: changefreq || 'monthly',
    priority: priority || 0.5
  }
}

// Rich snippets helpers
export const generateFAQStructuredData = (faqs: Array<{ question: string; answer: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}

export const generateArticleStructuredData = (article: {
  title: string
  description: string
  author: string
  publishedTime: string
  modifiedTime?: string
  image?: string
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    author: {
      '@type': 'Person',
      name: article.author
    },
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime || article.publishedTime,
    image: article.image,
    publisher: {
      '@type': 'Organization',
      name: 'Eran Fixer',
      logo: {
        '@type': 'ImageObject',
        url: 'https://eran-fixer.com/logo.png'
      }
    }
  }
}