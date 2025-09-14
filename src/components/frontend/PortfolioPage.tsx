import React, { useState, useEffect } from 'react'
import { ExternalLink, Calendar, Code, User, Filter, Search } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { formatDate } from '../../lib/utils'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import toast from 'react-hot-toast'

interface PortfolioItem {
  id: string
  title: string
  slug: string
  description: string
  featured_image: string | null
  client_name: string | null
  project_url: string | null
  technologies: string[]
  category: string
  completion_date: string | null
}

const categories = [
  { value: 'all', label: 'כל הפרויקטים' },
  { value: 'web-development', label: 'פיתוח אתרים' },
  { value: 'seo', label: 'קידום SEO' },
  { value: 'ai-solutions', label: 'פתרונות AI' },
  { value: 'e-commerce', label: 'חנויות מקוונות' },
  { value: 'mobile-apps', label: 'אפליקציות' },
]

export const PortfolioPage: React.FC = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    loadPortfolioItems()
  }, [])

  const loadPortfolioItems = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('status', 'published')
        .order('completion_date', { ascending: false })

      if (error) throw error
      setPortfolioItems(data || [])
    } catch (error) {
      console.error('Error loading portfolio items:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = portfolioItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.client_name && item.client_name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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
              תיק העבודות שלנו
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              פרויקטים מובילים ומורכבים שביצענו עבור לקוחותינו - מאתרי תדמית מתקדמים ועד מערכות עסקיות מקיפות. 
              כל פרויקט מותאם אישית ומשלב טכנולוגיות חדישות עם עיצוב מקצועי ופונקציונליות מתקדמת.
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
                placeholder="חיפוש פרויקטים..."
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
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">אין פרויקטים</h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'לא נמצאו פרויקטים התואמים לחיפוש'
                  : 'עדיין לא הועלו פרויקטים לתיק העבודות'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={item.featured_image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {categories.find(cat => cat.value === item.category)?.label || item.category}
                      </span>
                    </div>

                    {/* Project URL */}
                    {item.project_url && (
                      <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <a
                          href={item.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          title="צפה באתר"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900">
                        {item.title}
                      </h3>
                      {item.completion_date && (
                        <div className="flex items-center text-gray-500 text-sm">
                          <Calendar className="w-4 h-4 ml-1" />
                          {new Date(item.completion_date).getFullYear()}
                        </div>
                      )}
                    </div>

                    {item.client_name && (
                      <div className="flex items-center text-gray-600 mb-3">
                        <User className="w-4 h-4 ml-2" />
                        <span className="text-sm">{item.client_name}</span>
                      </div>
                    )}
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {item.description}
                    </p>

                    {/* Technologies */}
                    {item.technologies.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center mb-2">
                          <Code className="w-4 h-4 ml-2 text-gray-400" />
                          <span className="text-sm text-gray-500">טכנולוגיות:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.technologies.slice(0, 4).map((tech, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              {tech}
                            </span>
                          ))}
                          {item.technologies.length > 4 && (
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              +{item.technologies.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <a
                        href={`/portfolio/${item.slug}`}
                        className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                      >
                        פרטים נוספים
                      </a>
                      
                      {item.project_url && (
                        <a
                          href={item.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 ml-1" />
                          <span className="text-sm">צפה באתר</span>
                        </a>
                      )}
                    </div>
                    
                    {/* Related services based on category */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      {item.category === 'web-development' && (
                        <a
                          href="https://telaviv.eranfixer.co.il"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          בניית אתרים בתל אביב
                        </a>
                      )}
                      {item.category === 'seo' && (
                        <a
                          href="https://netanya.eranfixer.co.il"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          קידום אתרים בנתניה
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            רוצים פרויקט כזה?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            בואו נדבר על איך אנחנו יכולים לעזור לכם ליצור משהו מדהים
          </p>
          <a
            href="https://wa.me/972522126366?text=היי, אני מעוניין ליצור פרויקט דומה"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-colors inline-block"
          >
            בואו נתחיל פרויקט בווטסאפ
          </a>
        </div>
      </section>
    </div>
  )
}