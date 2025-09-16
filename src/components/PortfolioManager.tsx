import React, { useState, useEffect } from 'react'
import { Plus, Search, Filter, Edit, Trash2, Eye, ExternalLink, Calendar, Code } from 'lucide-react'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'
import { LoadingSpinner } from './ui/LoadingSpinner'
import { PortfolioEditor } from './PortfolioEditor'
import { supabase } from '../lib/supabase'
import { formatDate } from '../lib/utils'
import toast from 'react-hot-toast'
import { AutoSEO } from '../lib/seo-automation'

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
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
}

const categories = [
  { value: 'all', label: 'כל הקטגוריות' },
  { value: 'web-development', label: 'פיתוח אתרים' },
  { value: 'seo', label: 'קידום SEO' },
  { value: 'ai-solutions', label: 'פתרונות AI' },
  { value: 'e-commerce', label: 'חנויות מקוונות' },
  { value: 'mobile-apps', label: 'אפליקציות' },
]

export const PortfolioManager: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<PortfolioItem | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null)

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('completion_date', { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (error: any) {
      toast.error('שגיאה בטעינת תיק העבודות')
      console.error('Error loading portfolio items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteItem = async () => {
    if (!itemToDelete) return

    try {
      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', itemToDelete.id)

      if (error) throw error
      
      toast.success('הפרויקט נמחק בהצלחה')
      setShowDeleteModal(false)
      setItemToDelete(null)
      loadItems()
    } catch (error: any) {
      toast.error('שגיאה במחיקת הפרויקט')
    }
  }

  const handleSaveItem = async (itemData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('משתמש לא מחובר')

      const itemPayload = {
        title: itemData.title,
        slug: itemData.slug,
        description: itemData.description,
        content: itemData.content,
        featured_image: itemData.featured_image || null,
        client_name: itemData.client_name || null,
        project_url: itemData.project_url || null,
        technologies: itemData.technologies,
        category: itemData.category,
        completion_date: itemData.completion_date || null,
        status: itemData.status,
        author_id: user.id,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      }

      let error
      
      if (editingItem) {
        // Update existing item
        const result = await supabase
          .from('portfolio_items')
          .update(itemPayload)
          .eq('id', editingItem.id)
          .select()
        error = result.error
        console.log('Portfolio item updated:', result.data)
        
        // הודעה לגוגל על עדכון פרויקט
        if (result.data && result.data[0]) {
          AutoSEO.notifyGoogleOfNewPage(`/portfolio/${result.data[0].slug}`)
        }
      } else {
        // Create new item
        const result = await supabase
          .from('portfolio_items')
          .insert([itemPayload])
          .select()
        error = result.error
        console.log('Portfolio item created:', result.data)
        
        // הודעה לגוגל על פרויקט חדש
        if (result.data && result.data[0]) {
          AutoSEO.notifyGoogleOfNewPage(`/portfolio/${result.data[0].slug}`)
          console.log('Notified Google about new portfolio item:', result.data[0].slug)
        }
      }

      if (error) throw error
      toast.success(editingItem ? 'הפרויקט עודכן בהצלחה' : 'הפרויקט נוצר בהצלחה')
      setShowCreateModal(false)
      setShowEditModal(false)
      setEditingItem(null)
      loadItems()
    } catch (error: any) {
      console.error('Error saving portfolio item:', error)
      toast.error(error.message || 'שגיאה בשמירת הפרויקט')
    }
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.client_name && item.client_name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'פורסם'
      case 'draft': return 'טיוטה'
      case 'archived': return 'בארכיון'
      default: return status
    }
  }

  return (
    <>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ניהול תיק עבודות</h1>
          <p className="text-gray-600 mt-1">נהל את כל הפרויקטים בתיק העבודות</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 ml-2" />
          פרויקט חדש
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
                placeholder="חיפוש פרויקטים..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">כל הסטטוסים</option>
              <option value="published">פורסם</option>
              <option value="draft">טיוטה</option>
              <option value="archived">בארכיון</option>
            </select>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Items Grid */}
      <div className="bg-white rounded-xl shadow-sm border">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">אין פרויקטים</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'לא נמצאו פרויקטים התואמים לחיפוש'
                : 'עדיין לא נוצרו פרויקטים בתיק העבודות'
              }
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 ml-2" />
              צור פרויקט ראשון
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48">
                  <img
                    src={item.featured_image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                    {item.project_url && (
                      <a
                        href={item.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  
                  {item.client_name && (
                    <p className="text-sm text-gray-600 mb-2">לקוח: {item.client_name}</p>
                  )}
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  
                  {item.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.technologies.slice(0, 3).map((tech, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                      {item.technologies.length > 3 && (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          +{item.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      {item.status === 'published' && (
                        <button
                          onClick={() => window.open(`/portfolio/${item.slug}`, '_blank')}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="צפייה באתר"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setEditingItem(item)
                          setShowEditModal(true)
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="עריכה"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setItemToDelete(item)
                          setShowDeleteModal(true)
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="מחיקה"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {item.completion_date && (
                      <div className="flex items-center text-gray-500 text-xs">
                        <Calendar className="w-3 h-3 ml-1" />
                        {new Date(item.completion_date).getFullYear()}
                      </div>
                    )}
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
        title="מחיקת פרויקט"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            האם אתה בטוח שברצונך למחוק את הפרויקט "{itemToDelete?.title}"?
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
              onClick={handleDeleteItem}
            >
              מחק פרויקט
            </Button>
          </div>
        </div>
      </Modal>

      {/* Portfolio Editor */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          <PortfolioEditor
            onSave={handleSaveItem}
            onCancel={() => setShowCreateModal(false)}
          />
        </div>
      )}

      {/* Portfolio Editor for Edit */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          <PortfolioEditor
            onSave={handleSaveItem}
            onCancel={() => {
              setShowEditModal(false)
              setEditingItem(null)
            }}
            initialData={{
              title: editingItem.title,
              slug: editingItem.slug,
              description: editingItem.description,
              content: editingItem.content,
              featured_image: editingItem.featured_image || '',
              client_name: editingItem.client_name || '',
              project_url: editingItem.project_url || '',
              technologies: editingItem.technologies,
              category: editingItem.category,
              completion_date: editingItem.completion_date || '',
              status: editingItem.status
            }}
          />
        </div>
      )}
    </div>
    </>
  )
}
