import React, { useState, useEffect } from 'react'
import { Plus, Search, Filter, Edit, Trash2, Star, Building, ExternalLink, Users } from 'lucide-react'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'
import { LoadingSpinner } from './ui/LoadingSpinner'
import { supabase } from '../lib/supabase'
import { formatDate } from '../lib/utils'
import toast from 'react-hot-toast'

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
  created_at: string
}

const industries = [
  'כל התחומים',
  'טכנולוגיה',
  'בריאות',
  'חינוך',
  'מסחר',
  'שירותים מקצועיים',
  'תיירות',
  'נדל"ן',
  'אחר'
]

export const ClientsManager: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [industryFilter, setIndustryFilter] = useState<string>('כל התחומים')
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured' | 'regular'>('all')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    website: '',
    industry: '',
    description: '',
    testimonial: '',
    rating: 5,
    project_count: 0,
    featured: false
  })
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})

  useEffect(() => {
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
    } catch (error: any) {
      toast.error('שגיאה בטעינת הלקוחות')
      console.error('Error loading clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const errors: {[key: string]: string} = {}

    if (!formData.name.trim()) {
      errors.name = 'שם הלקוח חובה'
    }

    if (!formData.description.trim()) {
      errors.description = 'תיאור הלקוח חובה'
    }

    if (formData.website && !formData.website.startsWith('http')) {
      errors.website = 'כתובת האתר חייבת להתחיל ב-http או https'
    }

    if (formData.rating < 1 || formData.rating > 5) {
      errors.rating = 'דירוג חייב להיות בין 1 ל-5'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSaveClient = async () => {
    if (!validateForm()) return

    try {
      const clientPayload = {
        name: formData.name.trim(),
        logo: formData.logo.trim() || null,
        website: formData.website.trim() || null,
        industry: formData.industry || null,
        description: formData.description.trim(),
        testimonial: formData.testimonial.trim() || null,
        rating: formData.rating,
        project_count: formData.project_count,
        featured: formData.featured
      }

      if (editingClient) {
        // Update existing client
        const { data, error } = await supabase
          .from('clients')
          .update(clientPayload)
          .eq('id', editingClient.id)
          .select()

        if (error) throw error
        console.log('Client updated successfully:', data)
        toast.success('הלקוח עודכן בהצלחה')
      } else {
        // Create new client
        const { data, error } = await supabase
          .from('clients')
          .insert([{ ...clientPayload, created_at: new Date().toISOString() }])
          .select()

        if (error) throw error
        console.log('Client created successfully:', data)
        toast.success('הלקוח נוצר בהצלחה')
      }

      setShowCreateModal(false)
      setShowEditModal(false)
      setEditingClient(null)
      setFormData({
        name: '',
        logo: '',
        website: '',
        industry: '',
        description: '',
        testimonial: '',
        rating: 5,
        project_count: 0,
        featured: false
      })
      setFormErrors({})
      loadClients()
    } catch (error: any) {
      console.error('Error saving client:', error)
      toast.error(error.message || 'שגיאה בשמירת הלקוח')
    }
  }
  const handleDeleteClient = async () => {
    if (!clientToDelete) return

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientToDelete.id)

      if (error) throw error
      
      toast.success('הלקוח נמחק בהצלחה')
      setShowDeleteModal(false)
      setClientToDelete(null)
      loadClients()
    } catch (error: any) {
      toast.error('שגיאה במחיקת הלקוח')
    }
  }

  const toggleFeatured = async (client: Client) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({ featured: !client.featured })
        .eq('id', client.id)

      if (error) throw error
      
      toast.success(client.featured ? 'הלקוח הוסר מהמובילים' : 'הלקוח נוסף למובילים')
      loadClients()
    } catch (error: any) {
      toast.error('שגיאה בעדכון הלקוח')
    }
  }

  const openCreateModal = () => {
    setEditingClient(null)
    setFormData({
      name: '',
      logo: '',
      website: '',
      industry: '',
      description: '',
      testimonial: '',
      rating: 5,
      project_count: 0,
      featured: false
    })
    setFormErrors({})
    setShowCreateModal(true)
  }

  const openEditModal = (client: Client) => {
    setEditingClient(client)
    setFormData({
      name: client.name,
      logo: client.logo || '',
      website: client.website || '',
      industry: client.industry || '',
      description: client.description,
      testimonial: client.testimonial || '',
      rating: client.rating,
      project_count: client.project_count,
      featured: client.featured
    })
    setFormErrors({})
    setShowEditModal(true)
  }
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (client.industry && client.industry.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesIndustry = industryFilter === 'כל התחומים' || client.industry === industryFilter
    const matchesFeatured = featuredFilter === 'all' || 
                           (featuredFilter === 'featured' && client.featured) ||
                           (featuredFilter === 'regular' && !client.featured)
    return matchesSearch && matchesIndustry && matchesFeatured
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ניהול לקוחות</h1>
          <p className="text-gray-600 mt-1">נהל את כל הלקוחות וההמלצות שלהם</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 ml-2" />
          לקוח חדש
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="חיפוש לקוחות..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">כל הלקוחות</option>
              <option value="featured">לקוחות מובילים</option>
              <option value="regular">לקוחות רגילים</option>
            </select>
            
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="bg-white rounded-xl shadow-sm border">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-12">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">אין לקוחות</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || industryFilter !== 'כל התחומים' || featuredFilter !== 'all'
                ? 'לא נמצאו לקוחות התואמים לחיפוש'
                : 'עדיין לא נוספו לקוחות למערכת'
              }
            </p>
            <Button onClick={openCreateModal}>
              <Plus className="w-4 h-4 ml-2" />
              הוסף לקוח ראשון
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredClients.map((client) => (
              <div key={client.id} className={`border rounded-lg p-6 hover:shadow-md transition-shadow ${client.featured ? 'border-yellow-300 bg-yellow-50' : ''}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
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
                      <h3 className="font-semibold text-gray-900">{client.name}</h3>
                      {client.industry && (
                        <p className="text-sm text-gray-600">{client.industry}</p>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleFeatured(client)}
                    className={`p-1 rounded transition-colors ${
                      client.featured 
                        ? 'text-yellow-500 hover:text-yellow-600' 
                        : 'text-gray-400 hover:text-yellow-500'
                    }`}
                    title={client.featured ? 'הסר מלקוחות מובילים' : 'הוסף للקוחות מובילים'}
                  >
                    <Star className={`w-5 h-5 ${client.featured ? 'fill-current' : ''}`} />
                  </button>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {client.description}
                </p>
                
                {client.testimonial && (
                  <blockquote className="bg-gray-50 p-3 rounded-lg mb-4 text-sm italic text-gray-700">
                    "{client.testimonial}"
                  </blockquote>
                )}
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(client.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 mr-2">
                      {client.project_count} פרויקטים
                    </span>
                  </div>
                  
                  {client.website && (
                    <a
                      href={client.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <button
                      onClick={() => {
                        openEditModal(client)
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="עריכה"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setClientToDelete(client)
                        setShowDeleteModal(true)
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="מחיקה"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="מחיקת לקוח"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            האם אתה בטוח שברצונך למחוק את הלקוח "{clientToDelete?.name}"?
          </p>
          <p className="text-sm text-red-600">
            פעולה זו לא ניתנת לביטול!
          </p>
          <div className="flex justify-end space-x-3 space-x-reverse">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              ביטול
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteClient}
            >
              מחק לקוח
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create/Edit Client Modal */}
      <Modal
        isOpen={showCreateModal || showEditModal}
        onClose={() => {
          setShowCreateModal(false)
          setShowEditModal(false)
          setEditingClient(null)
          setFormData({
            name: '',
            logo: '',
            website: '',
            industry: '',
            description: '',
            testimonial: '',
            rating: 5,
            project_count: 0,
            featured: false
          })
          setFormErrors({})
        }}
        title={editingClient ? 'עריכת לקוח' : 'לקוח חדש'}
        size="lg"
      >
        <div className="space-y-6">
          <form onSubmit={(e) => { e.preventDefault(); handleSaveClient(); }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Client Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  שם הלקוח *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="שם הלקוח או החברה"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formErrors.name && (
                  <p className="text-sm text-red-600 mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  תחום פעילות
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">בחר תחום</option>
                  {industries.slice(1).map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>

              {/* Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  לוגו (URL)
                </label>
                <input
                  type="url"
                  value={formData.logo}
                  onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                  placeholder="https://example.com/logo.png"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  אתר אינטרנט
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://example.com"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formErrors.website && (
                  <p className="text-sm text-red-600 mt-1">{formErrors.website}</p>
                )}
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  דירוג (1-5)
                </label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                  <option value={4}>⭐⭐⭐⭐ (4)</option>
                  <option value={3}>⭐⭐⭐ (3)</option>
                  <option value={2}>⭐⭐ (2)</option>
                  <option value={1}>⭐ (1)</option>
                </select>
                {formErrors.rating && (
                  <p className="text-sm text-red-600 mt-1">{formErrors.rating}</p>
                )}
              </div>

              {/* Project Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  מספר פרויקטים
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.project_count}
                  onChange={(e) => setFormData(prev => ({ ...prev, project_count: parseInt(e.target.value) || 0 }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תיאור הלקוח *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                placeholder="תאר את הלקוח ואת העבודה שנעשתה עבורו..."
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formErrors.description && (
                <p className="text-sm text-red-600 mt-1">{formErrors.description}</p>
              )}
            </div>

            {/* Testimonial */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                המלצה מהלקוח
              </label>
              <textarea
                value={formData.testimonial}
                onChange={(e) => setFormData(prev => ({ ...prev, testimonial: e.target.value }))}
                rows={3}
                placeholder="המלצה או ציטוט מהלקוח (אופציונלי)..."
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Featured */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="mr-2 block text-sm text-gray-900">
                לקוח מוביל (יוצג בראש הדף)
              </label>
            </div>

            <div className="flex justify-end space-x-3 space-x-reverse">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowCreateModal(false)
                  setShowEditModal(false)
                  setEditingClient(null)
                }}
              >
                ביטול
              </Button>
              <Button type="submit">
                {editingClient ? 'עדכן לקוח' : 'צור לקוח'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  )
}