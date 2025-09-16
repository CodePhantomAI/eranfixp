import React, { useState, useEffect } from 'react'
import { Download, Calendar, User, Tag, FileText, BarChart, Search, Filter } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { formatDate } from '../../lib/utils'
import { LoadingSpinner } from '../ui/LoadingSpinner'

interface ResearchPaper {
  id: string
  title: string
  slug: string
  abstract: string
  featured_image: string | null
  pdf_url: string | null
  authors: string[]
  publication_date: string | null
  category: string
  tags: string[]
  citations: number
  downloads: number
}

const categories = [
  { value: 'all', label: 'כל המחקרים' },
  { value: 'seo', label: 'קידום אתרים' },
  { value: 'web-development', label: 'פיתוח אתרים' },
  { value: 'ai', label: 'בינה מלאכותית' },
  { value: 'digital-marketing', label: 'שיווק דיגיטלי' },
  { value: 'ux-ui', label: 'חוויית משתמש' },
  { value: 'analytics', label: 'אנליטיקה' },
]

export const ResearchPage: React.FC = () => {
  const [papers, setPapers] = useState<ResearchPaper[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    loadResearchPapers()
  }, [])

  const loadResearchPapers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('research_papers')
        .select('*')
        .eq('status', 'published')
        .order('publication_date', { ascending: false })

      if (error) throw error
      setPapers(data || [])
    } catch (error) {
      console.error('Error loading research papers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPapers = papers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || paper.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalDownloads = papers.reduce((sum, paper) => sum + paper.downloads, 0)
  const totalCitations = papers.reduce((sum, paper) => sum + paper.citations, 0)

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
              מחקרים ועבודות מקצועיות
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              מחקרים מעמיקים ומקצועיים, ניתוחים מבוססי נתונים ותובנות חדשניות בתחום הדיגיטל, 
              קידום אתרים, פיתוח מתקדם, בינה מלאכותית ושיווק דיגיטלי. מחקרים שנכתבו על ידי מומחים 
              ומבוססים על ניסיון מעשי וניתוח נתונים אמיתיים מפרויקטים מוצלחים.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{papers.length}</div>
              <div className="text-gray-600">מחקרים פורסמו</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{totalDownloads.toLocaleString()}</div>
              <div className="text-gray-600">הורדות</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{totalCitations}</div>
              <div className="text-gray-600">ציטוטים</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{categories.length - 1}</div>
              <div className="text-gray-600">תחומי מחקר</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="חיפוש מחקרים..."
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

      {/* Research Papers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPapers.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">אין מחקרים</h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'לא נמצאו מחקרים התואמים לחיפוש'
                  : 'עדיין לא פורסמו מחקרים'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredPapers.map((paper) => (
                <article key={paper.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Paper Image */}
                    <div className="lg:col-span-1">
                      <div className="relative h-48 lg:h-full min-h-[200px] rounded-lg overflow-hidden">
                        <img
                          src={paper.featured_image || 'https://res.cloudinary.com/dd9n4kiee/image/upload/v1754580943/ChatGPT_Image_Jul_31_2025_08_06_57_AM_zd8jvr.png'}
                          alt={paper.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4">
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {categories.find(cat => cat.value === paper.category)?.label || paper.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Paper Content */}
                    <div className="lg:col-span-3">
                      <div className="h-full flex flex-col">
                        {/* Header */}
                        <div className="mb-4">
                          <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            {paper.title}
                          </h2>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                            {paper.authors.length > 0 && (
                              <div className="flex items-center">
                                <User className="w-4 h-4 ml-1" />
                                <span>{paper.authors.join(', ')}</span>
                              </div>
                            )}
                            
                            {paper.publication_date && (
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 ml-1" />
                                <span>{formatDate(paper.publication_date)}</span>
                              </div>
                            )}
                            
                            <div className="flex items-center">
                              <Download className="w-4 h-4 ml-1" />
                              <span>{paper.downloads} הורדות</span>
                            </div>
                            
                            <div className="flex items-center">
                              <BarChart className="w-4 h-4 ml-1" />
                              <span>{paper.citations} ציטוטים</span>
                            </div>
                          </div>
                        </div>

                        {/* Abstract */}
                        <div className="flex-1 mb-6">
                          <h3 className="font-semibold text-gray-900 mb-2">תקציר:</h3>
                          <p className="text-gray-600 leading-relaxed line-clamp-4">
                            {paper.abstract}
                          </p>
                        </div>

                        {/* Tags */}
                        {paper.tags.length > 0 && (
                          <div className="mb-6">
                            <div className="flex flex-wrap gap-2">
                              {paper.tags.map((tag, index) => (
                                <span key={index} className="flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                  <Tag className="w-3 h-3 ml-1" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <a
                              href={`/research/${paper.slug}`}
                              className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                            >
                              קרא עוד
                            </a>
                            
                            {paper.pdf_url && (
                              <a
                                href={paper.pdf_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                <Download className="w-4 h-4 ml-2" />
                                הורד PDF
                              </a>
                            )}
                          </div>

                          <div className="text-sm text-gray-500">
                            מחקר מס׳ {paper.id.slice(-6)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            רוצים לשתף פעולה במחקר?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            אנחנו תמיד מחפשים שותפים למחקרים חדשים ומעניינים
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/972522126366?text=היי, אני מעוניין לשתף פעולה במחקר"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-colors inline-block"
            >
              צרו קשר למחקר משותף בווטסאפ
            </a>
            <a
              href="https://codephantomai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-block"
            >
              שיתוף מיסטר פיקס ו-AI
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}