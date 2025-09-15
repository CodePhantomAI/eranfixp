import React, { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { ArrowLeft, Download } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { updateSEOTags, generateArticleStructuredData } from '../../lib/seo'
import { RelatedContent } from '../ui/RelatedContent'
import { LoadingSpinner } from '../ui/LoadingSpinner'

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
  const [page, setPage] = useState<Page | null>(null)
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [contentType, setContentType] = useState<'page' | 'blog' | 'portfolio' | 'research'>('page')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('DynamicPage: Loading content for slug:', slug, 'path:', location.pathname)
    
    if (slug) {
      // Determine content type from URL
      if (location.pathname.startsWith('/blog/')) {
        setContentType('blog')
        loadBlogPost(slug)
      } else if (location.pathname.startsWith('/portfolio/')) {
        setContentType('portfolio')
        loadPortfolioItem(slug)
      } else if (location.pathname.startsWith('/research/')) {
        setContentType('research')
        loadResearchPaper(slug)
      } else {
        setContentType('page')
        loadPage(slug)
      }
    } else {
      console.log('DynamicPage: No slug provided')
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
        .eq('status', 'published')
        .maybeSingle()

      console.log('Page query result:', { data, error })

      if (error && error.code !== 'PGRST116') {
        console.error('Database error loading page:', error)
        throw error
      }
      
      if (!data) {
        console.log('Page not found:', pageSlug)
        setNotFound(true)
        return
      }
      
      if (data) {
        console.log('Page loaded successfully:', data.title)
        setContent(data)
        document.title = data.meta_title || `${data.title} - ארן פיקסר | EranFixer`
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
        console.error('Database error loading blog post:', error)
        throw error
      }
      
      if (!data) {
        console.log('Blog post not found:', postSlug)
        setNotFound(true)
        return
      }
      
      if (data) {
        console.log('Blog post loaded successfully:', data.title)
        setContent(data)
        document.title = data.meta_title || `${data.title} - בלוג EranFixer`
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
        document.title = `${data.title} - תיק עבודות EranFixer`
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
      const { data, error } = await supabase
        .from('research_papers')
        .select('*')
        .eq('slug', paperSlug)
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
        document.title = `${data.title} - מחקרים EranFixer`
      }
    } catch (error) {
      console.error('Error loading research paper:', error)
      setError('שגיאה בטעינת המחקר')
    } finally {
      setLoading(false)
    }
  }

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">טוען תוכן...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">שגיאה</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
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
              className="border-2 border-blue-600 text-blue-600 dark:text-blue-400 px-6 py-3 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-colors inline-block"
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
        <div className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
            {content.featured_image && (
              <img
                src={content.featured_image}
                alt={content.title}
                className="w-full h-64 object-cover rounded-lg mb-8"
              />
            )}
            <header className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                {content.blog_categories && (
                  <span 
                    className="px-3 py-1 rounded-full text-sm font-medium text-white animate-pulse"
                    style={{ backgroundColor: content.blog_categories.color }}
                  >
                    {content.blog_categories.name}
                  </span>
                )}
                <span className="text-gray-500 text-sm">
                  {formatDate(content.published_at)}
                </span>
                <span className="text-gray-500 text-sm">
                  {content.read_time} דקות קריאה
                </span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {content.title}
              </h1>
              {content.excerpt && (
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  {content.excerpt}
                </p>
              )}
            </header>
            
            <div 
              className="prose prose-lg max-w-none dark:prose-invert"
              style={{ direction: 'rtl' }}
              dangerouslySetInnerHTML={{ __html: content.content }}
            />
            
            {/* Add custom styles for better text visibility */}
            <style jsx>{`
              .prose * {
                color: inherit !important;
              }
              .dark .prose * {
                color: #e5e7eb !important;
              }
              .dark .prose h1,
              .dark .prose h2,
              .dark .prose h3,
              .dark .prose h4,
              .dark .prose h5,
              .dark .prose h6 {
                color: #ffffff !important;
                font-weight: bold !important;
              }
              .dark .prose b,
              .dark .prose strong {
                color: #60a5fa !important;
                font-weight: 700 !important;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
              }
            `}</style>
            
            <RelatedContent 
              currentId={content.id}
              currentType="blog"
              tags={content.tags}
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
      <div className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
            {content.featured_image && (
              <img
                src={content.featured_image}
                alt={content.title}
                className="w-full h-64 object-cover rounded-lg mb-8"
              />
            )}
            <header className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                  {content.category}
                </span>
                {content.client_name && (
                  <span className="text-gray-500 text-sm">
                    לקוח: {content.client_name}
                  </span>
                )}
                {content.completion_date && (
                  <span className="text-gray-500 text-sm">
                    הושלם: {formatDate(content.completion_date)}
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {content.title}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                {content.description}
              </p>
              {content.project_url && (
                <a
                  href={content.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-700"
                >
                  צפה בפרויקט החי
                  <ArrowLeft className="w-4 h-4 mr-2" />
                </a>
              )}
            </header>
            
            <div 
              className="prose prose-lg max-w-none dark:prose-invert"
              style={{ direction: 'rtl' }}
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
      <div className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
            {content.featured_image && (
              <img
                src={content.featured_image}
                alt={content.title}
                className="w-full h-64 object-cover rounded-lg mb-8"
              />
            )}
            <header className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                  {content.category}
                </span>
                {content.publication_date && (
                  <span className="text-gray-500 text-sm">
                    פורסם: {formatDate(content.publication_date)}
                  </span>
                )}
                <span className="text-gray-500 text-sm">
                  {content.downloads} הורדות
                </span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {content.title}
              </h1>
              {content.authors.length > 0 && (
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                  מחברים: {content.authors.join(', ')}
                </p>
              )}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">תקציר:</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {content.abstract}
                </p>
              </div>
              {content.pdf_url && (
                <a
                  href={content.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300"
                >
                  הורד PDF
                  <Download className="w-4 h-4 mr-2" />
                </a>
              )}
            </header>
            
            <div 
              className="prose prose-lg max-w-none dark:prose-invert"
              style={{ direction: 'rtl' }}
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
  return (
    <div className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {content.title}
            </h1>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              עודכן: {new Date(content.updated_at).toLocaleDateString('he-IL')}
            </div>
          </header>
          
          <div 
            className="prose prose-lg max-w-none dark:prose-invert"
            style={{ direction: 'rtl' }}
            dangerouslySetInnerHTML={{ __html: content.content }}
          />
        </article>
      </div>
    </div>
  )
}