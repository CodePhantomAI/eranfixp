import React, { useState, useEffect } from 'react'
import { Calendar, Clock, User, Tag, ArrowLeft, Search, Filter } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { formatDate } from '../../lib/utils'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { updateSEOTags } from '../../lib/seo'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  featured_image: string | null
  published_at: string
  read_time: number
  views: number
  tags: string[]
  blog_categories: {
    name: string
    color: string
  } | null
}

interface BlogCategory {
  id: string
  name: string
  slug: string
  color: string
}

export const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    // Set SEO for blog page
    updateSEOTags({
      title: 'בלוג EranFixer - מאמרים מקצועיים על קידום אתרים ופיתוח',
      description: 'מאמרים מעמיקים ומקצועיים על קידום אתרים, פיתוח מתקדם, בינה מלאכותית ושיווק דיגיטלי. תוכן איכותי מהמומחים של EranFixer',
      url: 'https://eran-fixer.com/blog',
      image: 'https://res.cloudinary.com/dzm47vpw8/image/upload/v1758009884/Gemini_Generated_Image_h6crelh6crelh6cr_eoviix.png',
      type: 'website'
    })
    
    loadBlogData()
  }, [])

  const loadBlogData = async () => {
    try {
      setLoading(true)
      
      // Load categories
      const { data: categoriesData } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name')

      // Load posts
      const { data: postsData } = await supabase
        .from('blog_posts')
        .select(`
          *,
          blog_categories (
            name,
            color
          )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .order('created_at', { ascending: false })

      setCategories(categoriesData || [])
      setPosts(postsData || [])
    } catch (error) {
      console.error('Error loading blog data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || 
                           (post.blog_categories && post.blog_categories.name === selectedCategory)
    return matchesSearch && matchesCategory
  })

  const featuredPost = filteredPosts[0]
  const regularPosts = filteredPosts.slice(1)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              בלוג EranFixer
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              מאמרים מקצועיים, מחקרים מעמיקים, טיפים מעשיים ותובנות חדשניות בתחום הדיגיטל, 
              קידום אתרים, פיתוח מתקדם, בינה מלאכותית ושיווק דיגיטלי. תוכן איכותי שנכתב על ידי מומחים עם ניסיון מוכח.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="חיפוש מאמרים..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">כל הקטגוריות</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">אין מאמרים</h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'לא נמצאו מאמרים התואמים לחיפוש'
                  : 'עדיין לא פורסמו מאמרים בבלוג'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Featured Post */}
              {featuredPost && (
                <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="relative h-64 lg:h-auto">
                      <img
                        src={featuredPost.featured_image || 'https://res.cloudinary.com/dzm47vpw8/image/upload/v1758009884/Gemini_Generated_Image_h6crelh6crelh6cr_eoviix.png'}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          מאמר מומלץ
                        </span>
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center gap-4 mb-4">
                        {featuredPost.blog_categories && (
                          <span 
                            className="px-3 py-1 rounded-full text-sm font-medium text-white"
                            style={{ backgroundColor: featuredPost.blog_categories.color }}
                          >
                            {featuredPost.blog_categories.name}
                          </span>
                        )}
                        <div className="flex items-center text-gray-500 text-sm">
                          <Calendar className="w-4 h-4 ml-1" />
                          {formatDate(featuredPost.published_at)}
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock className="w-4 h-4 ml-1" />
                          {featuredPost.read_time} דקות קריאה
                        </div>
                      </div>
                      
                      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                        {featuredPost.title}
                      </h2>
                      
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {featuredPost.excerpt}
                      </p>

                      {featuredPost.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {featuredPost.tags.map((tag, index) => (
                            <span key={index} className="flex items-center text-gray-500 text-sm">
                              <Tag className="w-3 h-3 ml-1" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <a
                        href={`/blog/${featuredPost.slug}`}
                        className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        קרא עוד
                        <ArrowLeft className="w-4 h-4 mr-2" />
                      </a>
                      
                     {/* Related links based on content */}
                     {featuredPost.title.includes('SEO') && (
                        <a
                          href="https://seo.eranfixer.co.il"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-500 hover:text-blue-600 transition-colors mr-4"
                        >
                          מחקרי SEO מתקדמים
                        </a>
                      )}
                      
                     {featuredPost.title.includes('AI') && (
                        <a
                          href="https://ai.eranfixer.co.il"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-500 hover:text-blue-600 transition-colors mr-4"
                        >
                          תובנות AI נוספות
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              )}

              {/* Regular Posts Grid */}
              {regularPosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularPosts.map((post) => (
                    <article key={post.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                      <div className="relative h-48">
                        <img
                          src={post.featured_image || 'https://res.cloudinary.com/dzm47vpw8/image/upload/v1758009884/Gemini_Generated_Image_h6crelh6crelh6cr_eoviix.png'}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                        {post.blog_categories && (
                          <div className="absolute top-4 right-4">
                            <span 
                              className="px-2 py-1 rounded-full text-xs font-medium text-white"
                              style={{ backgroundColor: post.blog_categories.color }}
                            >
                              {post.blog_categories.name}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 ml-1" />
                            {formatDate(post.published_at)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 ml-1" />
                            {post.read_time} דקות
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>

                        <a
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
                        >
                          קרא עוד
                          <ArrowLeft className="w-4 h-4 mr-2" />
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}