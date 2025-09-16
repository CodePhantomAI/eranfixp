import React, { useState, useEffect } from 'react'
import { Star, ExternalLink, Building, Users, Award, TrendingUp, ArrowLeft } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { updateSEOTags } from '../../lib/seo'

interface Client {
  id: string
  name: string
  logo: string | null
  website: string | null
  industry: string | null
  description: string
  testimonial: string | null
  rating: number
  project_count: number
  featured: boolean
}

const industries = [
  'טכנולוגיה',
  'בריאות',
  'חינוך',
  'מסחר',
  'שירותים מקצועיים',
  'תיירות',
  'נדל"ן',
  'אחר'
]

export const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all')

  useEffect(() => {
    // Set SEO for clients page
    updateSEOTags({
      title: 'הלקוחות שלנו - EranFixer | המלצות ועדויות מלקוחות מרוצים',
      description: 'קראו המלצות ועדויות מלקוחות מרוצים של EranFixer. חברות ועסקים שבחרו בשירותי הקידום, פיתוח ופתרונות הדיגיטל שלנו ורואים תוצאות מדהימות.',
      url: 'https://eran-fixer.com/clients',
      type: 'website'
    })
    
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('featured', { ascending: false })
        .order('project_count', { ascending: false })

      if (error) throw error
      setClients(data || [])
    } catch (error) {
      console.error('Error loading clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredClients = clients.filter(client => 
    selectedIndustry === 'all' || client.industry === selectedIndustry
  )

  const featuredClients = filteredClients.filter(client => client.featured)
  const regularClients = filteredClients.filter(client => !client.featured)

  const stats = {
    totalClients: clients.length,
    totalProjects: clients.reduce((sum, client) => sum + client.project_count, 0),
    averageRating: clients.length > 0 ? (clients.reduce((sum, client) => sum + client.rating, 0) / clients.length).toFixed(1) : '0',
    industries: [...new Set(clients.map(client => client.industry).filter(Boolean))].length
  }

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
              הלקוחות שלנו
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              אנחנו גאים לעבוד עם חברות מובילות, עסקים מצליחים וארגונים מכל הגדלים ברחבי ישראל ובעולם. 
              הלקוחות שלנו מגיעים מתחומים מגוונים - מסטארטאפים טכנולוגיים ועד חברות ותיקות, 
              מעסקים מקומיים ועד מותגים בינלאומיים. כולם חולקים מכנה משותף: הרצון להצליח בעולם הדיגיטלי.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalClients}+</div>
              <div className="text-gray-600">לקוחות מרוצים</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalProjects}+</div>
              <div className="text-gray-600">פרויקטים הושלמו</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.averageRating}</div>
              <div className="text-gray-600">דירוג ממוצע</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4">
                <Building className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.industries}+</div>
              <div className="text-gray-600">תחומי פעילות</div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Filter */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setSelectedIndustry('all')}
              className={`px-6 py-3 rounded-full font-medium transition-colors ${
                selectedIndustry === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-blue-50'
              }`}
            >
              כל התחומים
            </button>
            {industries.map((industry) => (
              <button
                key={industry}
                onClick={() => setSelectedIndustry(industry)}
                className={`px-6 py-3 rounded-full font-medium transition-colors ${
                  selectedIndustry === industry
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-blue-50'
                }`}
              >
                {industry}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Clients */}
      {featuredClients.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">לקוחות מובילים</h2>
              <p className="text-xl text-gray-600">חברות שבחרו לעבוד איתנו ורואות תוצאות</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredClients.map((client) => (
                <div key={client.id} className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-sm border-2 border-blue-100">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center">
                      {client.logo ? (
                        <img
                          src={client.logo}
                          alt={client.name}
                          className="w-16 h-16 rounded-lg object-cover ml-4"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center ml-4">
                          <Building className="w-8 h-8 text-blue-600" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{client.name}</h3>
                        {client.industry && (
                          <p className="text-blue-800 font-medium">{client.industry}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Award className="w-5 h-5 text-yellow-500 ml-1" />
                      <span className="text-sm font-medium text-gray-600">לקוח מוביל</span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-6 leading-relaxed font-medium">
                    {client.description}
                  </p>

                  {client.testimonial && (
                    <blockquote className="bg-white p-4 rounded-lg border-r-4 border-blue-500 mb-6 shadow-sm">
                      <p className="text-gray-700 italic font-medium">"{client.testimonial}"</p>
                    </blockquote>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex">
                        {[...Array(client.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-800 mr-2 font-medium">
                      <span className="text-sm text-gray-700 mr-2 font-medium">
                        {client.project_count} פרויקטים
                      </span>
                    </div>

                    {client.website && (
                      <a
                        href={client.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
                      >
                        <ExternalLink className="w-4 h-4 ml-1" />
                        <span className="text-sm">אתר הלקוח</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular Clients */}
      {regularClients.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">עוד לקוחות מרוצים</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularClients.map((client) => (
                <div key={client.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    {client.logo ? (
                      <img
                        src={client.logo}
                        alt={client.name}
                        className="w-12 h-12 rounded-lg object-cover ml-3"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center ml-3">
                        <Building className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-gray-900">{client.name}</h3>
                      {client.industry && (
                        <p className="text-sm text-gray-600">{client.industry}</p>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {client.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex">
                        {[...Array(client.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 mr-2">
                        {client.project_count} פרויקטים
                      </span>
                    </div>

                    {client.website && (
                      <a
                        href={client.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {filteredClients.length === 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">אין לקוחות בתחום זה</h3>
            <p className="text-gray-600">נסו לבחור תחום אחר או צפו בכל הלקוחות</p>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            רוצים להצטרף ללקוחות המרוצים שלנו?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            בואו נדבר על איך אנחנו יכולים לעזור לעסק שלכם לצמוח
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/972522126366?text=היי, אני מעוניין להצטרף ללקוחות המרוצים שלכם"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-colors inline-flex items-center justify-center"
            >
              בואו נתחיל לעבוד יחד
              <ArrowLeft className="w-4 h-4 mr-2" />
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-block"
            >
              צור קשר לפרטים
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}