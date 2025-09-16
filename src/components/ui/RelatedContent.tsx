import React, { useState, useEffect } from 'react'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { formatDate } from '../../lib/utils'

interface RelatedItem {
  id: string
  title: string
  excerpt: string
  url: string
  image?: string
  date?: string
  type: 'blog' | 'portfolio' | 'research'
}

interface RelatedContentProps {
  currentId: string
  currentType: 'blog' | 'portfolio' | 'research'
  tags?: string[]
  category?: string
}

export const RelatedContent: React.FC<RelatedContentProps> = ({
  currentId,
  currentType,
  tags = [],
  category
}) => {
  const [relatedItems, setRelatedItems] = useState<RelatedItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRelatedContent()
  }, [currentId, currentType, tags, category])

  const loadRelatedContent = async () => {
    try {
      setLoading(true)
      let relatedData: RelatedItem[] = []

      // Get related content based on type
      if (currentType === 'blog') {
        // Get related blog posts by category or tags
        const { data: blogPosts } = await supabase
          .from('blog_posts')
          .select('id, title, excerpt, slug, featured_image, published_at, tags, blog_categories(name)')
          .eq('status', 'published')
          .neq('id', currentId)
          .limit(3)

        relatedData = (blogPosts || []).map(post => ({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          url: `/blog/${post.slug}`,
          image: post.featured_image,
          date: post.published_at,
          type: 'blog' as const
        }))
      } else if (currentType === 'portfolio') {
        // Get related portfolio items by category
        const { data: portfolioItems } = await supabase
          .from('portfolio_items')
          .select('id, title, description, slug, featured_image, completion_date, category')
          .eq('status', 'published')
          .neq('id', currentId)
          .limit(3)

        relatedData = (portfolioItems || []).map(item => ({
          id: item.id,
          title: item.title,
          excerpt: item.description,
          url: `/portfolio/${item.slug}`,
          image: item.featured_image,
          date: item.completion_date,
          type: 'portfolio' as const
        }))
      } else if (currentType === 'research') {
        // Get related research papers by category or tags
        const { data: researchPapers } = await supabase
          .from('research_papers')
          .select('id, title, abstract, slug, featured_image, publication_date, category, tags')
          .eq('status', 'published')
          .neq('id', currentId)
          .limit(3)

        relatedData = (researchPapers || []).map(paper => ({
          id: paper.id,
          title: paper.title,
          excerpt: paper.abstract,
          url: `/research/${paper.slug}`,
          image: paper.featured_image,
          date: paper.publication_date,
          type: 'research' as const
        }))
      }

      setRelatedItems(relatedData)
    } catch (error) {
      console.error('Error loading related content:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || relatedItems.length === 0) return null

  return (
    <section className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        תוכן קשור
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedItems.map((item, index) => (
          <a
            key={item.id}
            href={item.url}
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={item.image || 'https://res.cloudinary.com/dzm47vpw8/image/upload/v1758009884/Gemini_Generated_Image_h6crelh6crelh6cr_eoviix.png'}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                  item.type === 'blog' ? 'bg-green-600' :
                  item.type === 'portfolio' ? 'bg-purple-600' : 'bg-orange-600'
                }`}>
                  {item.type === 'blog' ? 'בלוג' :
                   item.type === 'portfolio' ? 'פרויקט' : 'מחקר'}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {item.title}
              </h4>
              
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                {item.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                {item.date && (
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
                    <Calendar className="w-3 h-3 ml-1" />
                    {formatDate(item.date)}
                  </div>
                )}
                
                <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  קרא עוד
                  <ArrowLeft className="w-4 h-4 mr-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}