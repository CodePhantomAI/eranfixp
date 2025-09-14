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

  // Open Graph tags
  updateMetaTag('og:title', data.title, true)
  updateMetaTag('og:description', data.description, true)
  updateMetaTag('og:type', data.type || 'website', true)
  
  if (data.url) {
    updateMetaTag('og:url', data.url, true)
  }
  
  if (data.image) {
    updateMetaTag('og:image', data.image, true)
  }

  if (data.publishedTime) {
    updateMetaTag('article:published_time', data.publishedTime, true)
  }

  if (data.modifiedTime) {
    updateMetaTag('article:modified_time', data.modifiedTime, true)
  }

  // Twitter Card tags
  updateMetaTag('twitter:card', 'summary_large_image')
  updateMetaTag('twitter:title', data.title)
  updateMetaTag('twitter:description', data.description)
  
  if (data.image) {
    updateMetaTag('twitter:image', data.image)
  }
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