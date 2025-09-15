import React, { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { ArrowLeft, Download, Calendar, User, Tag } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { formatDate } from '../../lib/utils'

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
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [contentType, setContentType] = useState<'page' | 'blog' | 'portfolio' | 'research'>('page')

  useEffect(() => {
    if (slug) {
      console.log('Loading content for slug:', slug, 'pathname:', location.pathname)
      
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
      setNotFound(true)
      setLoading(false)
    }
  }, [slug, location.pathname])

  const loadPage = async (pageSlug: string) => {
    try {
      setLoading(true)
      setNotFound(false)
      
      console.log('Loading page with slug:', pageSlug)
      
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', pageSlug)
        .eq('status', 'published')
        .maybeSingle()

      console.log('Page query result:', { data, error })

      if (error && error.code !== 'PGRST116') {
        console.error('Page loading error:', error)
        throw error
      }
      
      if (!data) {
        console.log('No page found for slug:', pageSlug)
        setNotFound(true)
        return
      }
      
      console.log('Page loaded successfully:', data)
      setContent(data)
      
      // Update page title
      document.title = data.meta_title || `${data.title} - ארן פיקסר | EranFixer`
    } catch (error) {
      console.error('Error loading page:', error)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  const loadBlogPost = async (postSlug: string) => {
    try {
      setLoading(true)
      setNotFound(false)
      
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
        console.error('Blog post loading error:', error)
        throw error
      }
      
      if (!data) {
        console.log('No blog post found for slug:', postSlug)
        setNotFound(true)
        return
      }
      
      console.log('Blog post loaded successfully:', data)
      setContent(data)
      
      // Update page title
      document.title = data.meta_title || `${data.title} - בלוג EranFixer`
    } catch (error) {
      console.error('Error loading blog post:', error)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  const loadPortfolioItem = async (itemSlug: string) => {
    try {
      setLoading(true)
      setNotFound(false)
      
      console.log('Loading portfolio item with slug:', itemSlug)
      
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('slug', itemSlug)
        .eq('status', 'published')
        .maybeSingle()

      console.log('Portfolio item query result:', { data, error })

      if (error && error.code !== 'PGRST116') {
        console.error('Portfolio item loading error:', error)
        throw error
      }
      
      if (!data) {
        console.log('No portfolio item found for slug:', itemSlug)
        setNotFound(true)
        return
      }
      
      console.log('Portfolio item loaded successfully:', data)
      setContent(data)
      
      // Update page title
      document.title = `${data.title} - תיק עבודות EranFixer`
    } catch (error) {
      console.error('Error loading portfolio item:', error)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  const loadResearchPaper = async (paperSlug: string) => {
    try {
      setLoading(true)
      setNotFound(false)
      
      console.log('Loading research paper with slug:', paperSlug)
      
      const { data, error } = await supabase
        .from('research_papers')
        .select('*')
        .eq('slug', paperSlug)
        .eq('status', 'published')
        .maybeSingle()

      console.log('Research paper query result:', { data, error })

      if (error && error.code !== 'PGRST116') {
        console.error('Research paper loading error:', error)
        throw error
      }
      
      if (!data) {
        console.log('No research paper found for slug:', paperSlug)
        setNotFound(true)
        return
      }
      
      console.log('Research paper loaded successfully:', data)
      setContent(data)
      
      // Update page title
      document.title = `${data.title} - מחקרים EranFixer`
    } catch (error) {
      console.error('Error loading research paper:', error)
      setNotFound(true)
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
          <p className="mt-2 text-sm text-gray-500">
            טוען {contentType}: {slug}
          </p>
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
              href={contentType === 'blog' ? '/blog' : contentType === 'portfolio' ? '/portfolio' : contentType === 'research' ? '/research' : '/'}
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

  // Blog post layout
  if (contentType === 'blog') {
    return (
      <div className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="bg-white rounded-2xl shadow-sm p-8">
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
                    className="px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: content.blog_categories.color }}
                  >
                    {content.blog_categories.name}
                  </span>
                )}
                {content.published_at && (
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="w-4 h-4 ml-1" />
                    {formatDate(content.published_at)}
                  </div>
                )}
                {content.read_time && (
                  <span className="text-gray-500 text-sm">
                    {content.read_time} דקות קריאה
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {content.title}
              </h1>
              
              {content.excerpt && (
                <p className="text-xl text-gray-600 leading-relaxed">
                  {content.excerpt}
                </p>
              )}
            </header>
            
            <div 
              className="prose prose-lg max-w-none"
              style={{ direction: 'rtl' }}
              dangerouslySetInnerHTML={{ __html: content.content }}
            />
            
            {content.tags && content.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="font-semibold text-gray-900 mb-3">תגיות:</h3>
                <div className="flex flex-wrap gap-2">
                  {content.tags.map((tag: string, index: number) => (
                    <span key={index} className="flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      <Tag className="w-3 h-3 ml-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </div>
    )
  }

  // Portfolio item layout
  if (contentType === 'portfolio') {
    return (
      <div className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="bg-white rounded-2xl shadow-sm p-8">
            {content.featured_image && (
              <img
                src={content.featured_image}
                alt={content.title}
                className="w-full h-64 object-cover rounded-lg mb-8"
              />
            )}
            
            <header className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
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
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {content.title}
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
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
              className="prose prose-lg max-w-none"
              style={{ direction: 'rtl' }}
              dangerouslySetInnerHTML={{ __html: content.content }}
            />
            
            {content.technologies && content.technologies.length > 0 && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="font-semibold text-gray-900 mb-3">טכנולוגיות:</h3>
                <div className="flex flex-wrap gap-2">
                  {content.technologies.map((tech: string, index: number) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </div>
    )
  }

  // Research paper layout
  if (contentType === 'research') {
    return (
      <div className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="bg-white rounded-2xl shadow-sm p-8">
            {content.featured_image && (
              <img
                src={content.featured_image}
                alt={content.title}
                className="w-full h-64 object-cover rounded-lg mb-8"
              />
            )}
            
            <header className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {content.category}
                </span>
                {content.publication_date && (
                  <span className="text-gray-500 text-sm">
                    פורסם: {formatDate(content.publication_date)}
                  </span>
                )}
                <span className="text-gray-500 text-sm">
                  {content.downloads || 0} הורדות
                </span>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {content.title}
              </h1>
              
              {content.authors && content.authors.length > 0 && (
                <p className="text-lg text-gray-600 mb-4">
                  מחברים: {content.authors.join(', ')}
                </p>
              )}
              
              {content.abstract && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">תקציר:</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {content.abstract}
                  </p>
                </div>
              )}
              
              {content.pdf_url && (
                <a
                  href={content.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  הורד PDF
                  <Download className="w-4 h-4 mr-2" />
                </a>
              )}
            </header>
            
            <div 
              className="prose prose-lg max-w-none"
              style={{ direction: 'rtl' }}
              dangerouslySetInnerHTML={{ __html: content.content }}
            />
            
            {content.tags && content.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="font-semibold text-gray-900 mb-3">תגיות:</h3>
                <div className="flex flex-wrap gap-2">
                  {content.tags.map((tag: string, index: number) => (
                    <span key={index} className="flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      <Tag className="w-3 h-3 ml-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </div>
    )
  }

  // Default page layout
  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="bg-white rounded-2xl shadow-sm p-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {content.title}
            </h1>
            <div className="text-sm text-gray-500">
              עודכן: {formatDate(content.updated_at)}
            </div>
          </header>
          
          <div 
            className="prose prose-lg max-w-none"
            style={{ direction: 'rtl' }}
            dangerouslySetInnerHTML={{ __html: content.content }}
          />
        </article>
      </div>
    </div>
  )
}