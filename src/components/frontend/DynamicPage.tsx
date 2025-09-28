import React, { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { ArrowLeft, Download, Calendar, User, Tag } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { formatDate } from '../../lib/utils'
import { RelatedContent } from '../ui/RelatedContent'
import { TableOfContents } from '../ui/TableOfContents'
import { useSEOOptimization } from '../../lib/seo-automation'
import { updateSEOTags } from '../../lib/seo'

interface Page {
  id: string
  title: string
  slug: string
  content: string
  meta_title: string | null
  meta_description: string | null
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
}

export const DynamicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const location = useLocation()
  const { updatePageSEO } = useSEOOptimization()
  
  // Debug logging
  console.log('DynamicPage loading with:', { slug, pathname: location.pathname })
  
  // Force visibility immediately - CRITICAL for crawlers
  useEffect(() => {
    document.body.style.visibility = 'visible'
    document.body.style.opacity = '1'
    document.body.style.background = '#ffffff'
  }, [])
  
  const [page, setPage] = useState<Page | null>(null)
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [contentType, setContentType] = useState<'page' | 'blog' | 'portfolio' | 'research'>('page')
  const [error, setError] = useState<string | null>(null)

  // Immediate SEO setup for crawlers - CRITICAL for Facebook
  useEffect(() => {
    // Set basic meta tags immediately to help crawlers
    const currentUrl = window.location.href
    const baseTitle = 'EranFixer - ערן פיקסר | פתרונות דיגיטליים מתקדמים'
    const baseDescription = 'מומחה מוכח בקידום אתרים אורגני, בניית אתרים מקצועיים, ניהול מוניטין דיגיטלי ופתרונות AI לעסקים'
    const baseImage = 'https://res.cloudinary.com/dzm47vpw8/image/upload/v1758009884/Gemini_Generated_Image_h6crelh6crelh6cr_eoviix.png'
    
    updateSEOTags({
      title: baseTitle,
      description: baseDescription,
      url: currentUrl,
      canonical: currentUrl,
      image: baseImage,
      type: 'article'
    })
  }, [])

  useEffect(() => {
    console.log('DynamicPage useEffect:', { slug, pathname: location.pathname })
    
    if (slug) {
      // Determine content type from URL
      if (location.pathname.startsWith('/blog/')) {
        console.log('Loading blog post:', slug)
        setContentType('blog')
        loadBlogPost(slug)
      } else if (location.pathname.startsWith('/portfolio/')) {
        console.log('Loading portfolio item:', slug)
        setContentType('portfolio')
        loadPortfolioItem(slug)
      } else if (location.pathname.startsWith('/research/')) {
        console.log('Loading research paper:', slug)
        setContentType('research')
        loadResearchPaper(slug)
      } else {
        console.log('Loading page:', slug)
        setContentType('page')
        loadPage(slug)
      }
    } else {
      setNotFound(true)
      setLoading(false)
    }
  }, [slug, location.pathname])

  const loadPage = async (pageSlug: string) => {
    try {
      setLoading(true)
      setNotFound(false)
      setError(null)
      
      console.log('Loading page with slug:', pageSlug)
      
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', pageSlug)
        .maybeSingle()

      console.log('Supabase response:', { data, error })

      if (error && error.code !== 'PGRST116') {
        console.error('Supabase error:', error)
        throw error
      }
      
      if (!data) {
        console.log('No page found for slug:', pageSlug)
        setNotFound(true)
        
        // Set 404 meta tags for crawlers
        updateSEOTags({
          title: `עמוד לא נמצא - ${pageSlug} | EranFixer`,
          description: 'העמוד שחיפשתם לא נמצא באתר EranFixer',
          url: window.location.href,
          canonical: window.location.href,
          type: 'website'
        })
        return
      }
      
      if (data) {
        console.log('Page loaded successfully:', data)
        setContent(data)
        document.title = data.meta_title || `${data.title} - ארן פיקסר | EranFixer`
        
        // עדכון SEO אוטומטי
        updatePageSEO({
          title: data.meta_title || `${data.title} - ארן פיקסר | EranFixer`,
          description: data.meta_description || data.content.replace(/<[^>]*>/g, '').substring(0, 160),
          slug: data.slug,
          type: 'page',
          modifiedTime: data.updated_at
        })
      }
    } catch (error) {
      console.error('Error loading page:', error)
      setError('שגיאה בטעינת העמוד')
    } finally {
      setLoading(false)
    }
  }

  const loadBlogPost = async (postSlug: string) => {
    try {
      setLoading(true)
      setNotFound(false)
      setError(null)
      
      console.log('Loading blog post with slug:', postSlug)
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          blog_categories (
            name,
            color
          )
        `)
        .eq('slug', postSlug)
        .eq('status', 'published')
        .maybeSingle()

      console.log('Blog post query result:', { data, error })

      if (error && error.code !== 'PGRST116') {
        throw error
      }
      
      if (!data) {
        console.log('No blog post found for slug:', postSlug)
        setNotFound(true)
        return
      }
      
      if (data) {
        setContent(data)
        
        // Enhanced SEO for Facebook sharing
        const blogUrl = `https://eran-fixer.com/blog/${data.slug}`
        const blogImage = data.featured_image || 'https://res.cloudinary.com/dzm47vpw8/image/upload/c_fill,w_1200,h_630,q_auto,f_auto/v1758009884/Gemini_Generated_Image_h6crelh6crelh6cr_eoviix.png'
        
        // Update SEO immediately for Facebook crawler - SYNCHRONOUS
        updateSEOTags({
          title: data.meta_title || `${data.title} - בלוג EranFixer`,
          description: data.meta_description || data.excerpt,
          url: blogUrl,
          canonical: blogUrl,
          image: blogImage,
          type: 'article',
          author: 'ערן פיקסר',
          publishedTime: data.published_at,
          modifiedTime: data.updated_at,
          keywords: data.tags || []
        })
        
        // Force page title update
        document.title = data.meta_title || `${data.title} - בלוג EranFixer`
        
        // עדכון SEO לבלוג
        updatePageSEO({
          title: data.meta_title || `${data.title} - בלוג EranFixer`,
          description: data.meta_description || data.excerpt,
          slug: data.slug,
          type: 'blog',
          publishedTime: data.published_at,
          modifiedTime: data.updated_at,
          image: blogImage
        })
      }
    } catch (error) {
      console.error('Error loading blog post:', error)
      setError('שגיאה בטעינת הפוסט')
    } finally {
      setLoading(false)
    }
  }

  const loadPortfolioItem = async (itemSlug: string) => {
    try {
      setLoading(true)
      setNotFound(false)
      setError(null)
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('slug', itemSlug)
        .eq('status', 'published')
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        throw error
      }
      
      if (!data) {
        setNotFound(true)
        return
      }
      
      if (data) {
        setContent(data)
        const portfolioUrl = `https://eran-fixer.com/portfolio/${data.slug}`
        const portfolioImage = data.featured_image || 'https://res.cloudinary.com/dzm47vpw8/image/upload/c_fill,w_1200,h_630,q_auto,f_auto/v1758009884/Gemini_Generated_Image_h6crelh6crelh6cr_eoviix.png'
        
        // Update SEO for Facebook immediately
        updateSEOTags({
          title: `${data.title} - תיק עבודות | EranFixer`,
          description: data.description,
          url: portfolioUrl,
          canonical: portfolioUrl,
          image: portfolioImage,
          type: 'article',
          author: 'ערן פיקסר',
          modifiedTime: data.updated_at
        })
        
        // עדכון SEO לפורטפוליו
        updatePageSEO({
          title: `${data.title} - תיק עבודות | EranFixer`,
          description: data.description,
          slug: data.slug,
          type: 'portfolio',
          modifiedTime: data.updated_at,
          image: data.featured_image
        })
      }
    } catch (error) {
      console.error('Error loading portfolio item:', error)
      setError('שגיאה בטעינת הפרויקט')
    } finally {
      setLoading(false)
    }
  }

  const loadResearchPaper = async (paperSlug: string) => {
    try {
      setLoading(true)
      setNotFound(false)
      setError(null)
      
      console.log('Loading research paper with slug:', paperSlug)
      
      const { data, error } = await supabase
        .from('research_papers')
        .select('*')
        .eq('slug', paperSlug)
        .eq('status', 'published')
        .maybeSingle()

      console.log('Research paper query result:', { data, error })
      if (error && error.code !== 'PGRST116') {
        throw error
      }
      
      if (!data) {
        console.log('No research paper found for slug:', paperSlug)
        setNotFound(true)
        return
      }
      
      if (data) {
        setContent(data)
        const researchUrl = `https://eran-fixer.com/research/${data.slug}`
        const researchImage = data.featured_image || 'https://res.cloudinary.com/dzm47vpw8/image/upload/c_fill,w_1200,h_630,q_auto,f_auto/v1758009884/Gemini_Generated_Image_h6crelh6crelh6cr_eoviix.png'
        
        // Update SEO for Facebook immediately
        updateSEOTags({
          title: `${data.title} - מחקרים | EranFixer`,
          description: data.abstract,
          url: researchUrl,
          canonical: researchUrl,
          image: researchImage,
          type: 'article',
          author: 'ערן פיקסר',
          publishedTime: data.publication_date,
          modifiedTime: data.updated_at
        })
        
        // עדכון SEO למחקרים
        updatePageSEO({
          title: `${data.title} - מחקרים | EranFixer`,
          description: data.abstract,
          slug: data.slug,
          type: 'research',
          publishedTime: data.publication_date,
          modifiedTime: data.updated_at,
          image: data.featured_image || 'https://res.cloudinary.com/dzm47vpw8/image/upload/v1758009884/Gemini_Generated_Image_h6crelh6crelh6cr_eoviix.png'
        })
      }
    } catch (error) {
      console.error('Error loading research paper:', error)
      setError('שגיאה בטעינת המחקר')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">טוען תוכן...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">שגיאה</h1>
          <p className="text-xl text-gray-600 mb-8">
            {error}
          </p>
          <a
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block"
          >
            חזור לדף הבית
          </a>
        </div>
      </div>
    )
  }

  if (notFound || !content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">
            {contentType === 'blog' && 'הפוסט לא נמצא'}
            {contentType === 'portfolio' && 'הפרויקט לא נמצא'}
            {contentType === 'research' && 'המחקר לא נמצא'}
            {contentType === 'page' && 'העמוד לא נמצא'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block"
            >
              חזור לדף הבית
            </a>
            <a
              href={contentType === 'blog' ? '/blog' : contentType === 'portfolio' ? '/portfolio' : '/'}
              className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-colors inline-block"
            >
              {contentType === 'blog' && 'לכל הפוסטים'}
              {contentType === 'portfolio' && 'לכל הפרויקטים'}
              {contentType === 'research' && 'לכל המחקרים'}
              {contentType === 'page' && 'לדף הבית'}
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Render different layouts based on content type
  if (contentType === 'blog') {
    return (
      <>
        <TableOfContents content={content.content} />
        <div className="py-8 sm:py-12 lg:py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <article className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8">
          {content.featured_image && (
            <img
              src={content.featured_image}
              alt={content.title}
              className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-lg mb-6 sm:mb-8"
            />
          )}
          
          <header className="mb-6 sm:mb-8">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4">
              {content.blog_categories && (
                <span 
                  className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-white"
                  style={{ backgroundColor: content.blog_categories.color }}
                >
                  {content.blog_categories.name}
                </span>
              )}
              <div className="flex items-center text-gray-500 text-xs sm:text-sm">
                <Calendar className="w-4 h-4 ml-1" />
                {formatDate(content.published_at)}
              </div>
              <span className="text-gray-500 text-xs sm:text-sm">
                {content.read_time} דקות קריאה
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {content.title}
            </h1>
            
            {content.excerpt && (
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                {content.excerpt}
              </p>
            )}
          </header>
          
          <div 
            className="prose prose-sm sm:prose-base lg:prose-lg max-w-none dark:prose-invert"
            style={{ direction: 'rtl' }}
            onClick={(e) => {
              const target = e.target as HTMLElement
              if (target.tagName === 'A') {
                const href = target.getAttribute('href')
                if (href) {
                  e.preventDefault()
                  e.stopPropagation()
                  window.open(href, '_blank', 'noopener,noreferrer')
                }
              }
            }}
            dangerouslySetInnerHTML={{ __html: content.content }}
          />
          
          <RelatedContent 
            currentId={content.id}
            currentType="blog"
            tags={content.tags || []}
            category={content.blog_categories?.name}
          />
          </article>
        </div>
      </div>
      </>
    )
  }

  if (contentType === 'portfolio') {
    return (
      <div className="py-8 sm:py-12 lg:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8">
            {content.featured_image && (
              <img
                src={content.featured_image}
                alt={content.title}
                className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-lg mb-6 sm:mb-8"
              />
            )}
            <header className="mb-6 sm:mb-8">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4">
                <span className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium animate-pulse">
                  {content.category}
                </span>
                {content.client_name && (
                  <span className="text-gray-500 text-xs sm:text-sm">
                    לקוח: {content.client_name}
                  </span>
                )}
                {content.completion_date && (
                  <span className="text-gray-500 text-xs sm:text-sm">
                    הושלם: {formatDate(content.completion_date)}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                {content.title}
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                {content.description}
              </p>
              {content.project_url && (
                <a
                  href={content.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-700 text-sm sm:text-base"
                >
                  צפה בפרויקט החי
                  <ArrowLeft className="w-4 h-4 mr-2" />
                </a>
              )}
            </header>
            
            <div 
              className="prose prose-sm sm:prose-base lg:prose-lg max-w-none dark:prose-invert"
              style={{ direction: 'rtl' }}
              onClick={(e) => {
                const target = e.target as HTMLElement
                if (target.tagName === 'A') {
                  e.stopPropagation()
                  const href = target.getAttribute('href')
                  if (href) {
                    window.open(href, '_blank', 'noopener,noreferrer')
                  }
                }
              }}
              dangerouslySetInnerHTML={{ __html: content.content }}
            />
            
            <RelatedContent 
              currentId={content.id}
              currentType="portfolio"
              category={content.category}
            />
          </article>
        </div>
      </div>
    )
  }

  if (contentType === 'research') {
    return (
      <div className="py-8 sm:py-12 lg:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8">
            {content.featured_image && (
              <img
                src={content.featured_image}
                alt={content.title}
                className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-lg mb-6 sm:mb-8"
              />
            )}
            <header className="mb-6 sm:mb-8">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4">
                <span className="bg-purple-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium animate-pulse">
                  {content.category}
                </span>
                {content.publication_date && (
                  <span className="text-gray-500 text-xs sm:text-sm">
                    פורסם: {formatDate(content.publication_date)}
                  </span>
                )}
                <span className="text-gray-500 text-xs sm:text-sm">
                  {content.downloads} הורדות
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                {content.title}
              </h1>
              {content.authors.length > 0 && (
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-4">
                  מחברים: {content.authors.join(', ')}
                </p>
              )}
              <div className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">תקציר:</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                  {content.abstract}
                </p>
              </div>
              {content.pdf_url && (
                <a
                  href={content.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-4 bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300 text-sm sm:text-base"
                >
                  הורד PDF
                  <Download className="w-4 h-4 mr-2" />
                </a>
              )}
            </header>
            
            <div 
              className="prose prose-sm sm:prose-base lg:prose-lg max-w-none dark:prose-invert"
              style={{ direction: 'rtl' }}
              onClick={(e) => {
                const target = e.target as HTMLElement
                if (target.tagName === 'A') {
                  e.stopPropagation()
                  const href = target.getAttribute('href')
                  if (href) {
                    window.open(href, '_blank', 'noopener,noreferrer')
                  }
                }
              }}
              dangerouslySetInnerHTML={{ __html: content.content }}
            />
            
            <RelatedContent 
              currentId={content.id}
              currentType="research"
              tags={content.tags}
              category={content.category}
            />
          </article>
        </div>
      </div>
    )
  }

  // Default page layout
  return (
    <div className="py-8 sm:py-12 lg:py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8">
          <header className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {content.title}
            </h1>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              עודכן: {new Date(content.updated_at).toLocaleDateString('he-IL')}
            </div>
          </header>
          
          <div 
            className="prose prose-sm sm:prose-base lg:prose-lg max-w-none dark:prose-invert"
            style={{ direction: 'rtl' }}
            onClick={(e) => {
              const target = e.target as HTMLElement
              if (target.tagName === 'A') {
                e.stopPropagation()
                const href = target.getAttribute('href')
                if (href) {
                  window.open(href, '_blank', 'noopener,noreferrer')
                }
              }
            }}
            dangerouslySetInnerHTML={{ __html: content.content }}
          />
        </article>
      </div>
    </div>
  )
}