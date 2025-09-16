import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Search, Filter, Edit, Trash2, Eye, Globe, FileText, Calendar, User } from 'lucide-react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Modal } from './ui/Modal'
import { LoadingSpinner } from './ui/LoadingSpinner'
import { PageEditor } from './PageEditor'
import { supabase } from '../lib/supabase'
import { formatDate } from '../lib/utils'
import toast from 'react-hot-toast'
import { AutoSEO } from '../lib/seo-automation'

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
  author_id: string
}

export const PagesManager: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all')
  const [showEditor, setShowEditor] = useState(false)
  const [editingPage, setEditingPage] = useState<Page | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [pageToDelete, setPageToDelete] = useState<Page | null>(null)

  useEffect(() => {
    // Check if we should open the editor immediately
    if (searchParams.get('action') === 'create') {
      setShowEditor(true)
      // Remove the action parameter from URL
      setSearchParams({})
    }
    
    loadPages()
  }, [searchParams, setSearchParams])

  const loadPages = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      setPages(data || [])
    } catch (error: any) {
      toast.error('שגיאה בטעינת העמודים')
      console.error('Error loading pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSavePage = async (pageData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      console.log('Current user:', user)
      if (!user) throw new Error('משתמש לא מחובר')

      console.log('Saving page with full data:', pageData)

      const pagePayload = {
        title: pageData.title,
        slug: pageData.slug,
        content: pageData.content,
        meta_title: pageData.meta_title || null,
        meta_description: pageData.meta_description || null,
        status: pageData.status,
        author_id: user.id,
        updated_at: new Date().toISOString()
      }

      console.log('Final page payload to save:', pagePayload)

      if (editingPage) {
        // Update existing page
        console.log('Updating existing page with ID:', editingPage.id)
        const { data, error } = await supabase
          .from('pages')
          .update(pagePayload)
          .eq('id', editingPage.id)
          .select()

        if (error) throw error
        console.log('Page updated successfully - result:', data)
        
        // הודעה לגוגל על עדכון העמוד
        if (data && data[0]) {
          AutoSEO.notifyGoogleOfNewPage(`/${data[0].slug}`)
        }
        
        toast.success('העמוד עודכן בהצלחה')
      } else {
        // Create new page
        console.log('Creating new page...')
        const { data, error } = await supabase
          .from('pages')
          .insert([{ ...pagePayload, created_at: new Date().toISOString() }])
          .select()

        console.log('Create page result:', { data, error })
        if (error) throw error
        
        console.log('Page created successfully - new page data:', data)
        
        // הודעה לגוגל על עמוד חדש
        if (data && data[0]) {
          AutoSEO.notifyGoogleOfNewPage(`/${data[0].slug}`)
          console.log('Notified Google about new page:', data[0].slug)
        }
        
        toast.success('העמוד נוצר בהצלחה')
      }

      setShowEditor(false)
      setEditingPage(null)
      loadPages()
    } catch (error: any) {
      console.error('DETAILED Error saving page:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      console.error('Error details:', error.details)
      toast.error(error.message || 'שגיאה בשמירת העמוד')
    }
  }

  const handleDeletePage = async () => {
    if (!pageToDelete) return

    try {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', pageToDelete.id)

      if (error) throw error
      
      toast.success('העמוד נמחק בהצלחה')
      setShowDeleteModal(false)
      setPageToDelete(null)
      loadPages()
    } catch (error: any) {
      toast.error('שגיאה במחיקת העמוד')
    }
  }

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.slug.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter
    return matchesSearch && matchesStatus
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

  if (showEditor) {
    return (
      <PageEditor
        onSave={handleSavePage}
        onCancel={() => {
          setShowEditor(false)
          setEditingPage(null)
        }}
        initialData={editingPage ? {
          title: editingPage.title,
          slug: editingPage.slug,
          content: editingPage.content,
          meta_title: editingPage.meta_title || '',
          meta_description: editingPage.meta_description || '',
          status: editingPage.status
        } : undefined}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ניהול עמודים</h1>
          <p className="text-gray-600 mt-1">נהל את כל העמודים באתר</p>
        </div>
        <Button onClick={() => setShowEditor(true)}>
          <Plus className="w-4 h-4 ml-2" />
          עמוד חדש
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="חיפוש עמודים..."
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
          </div>
        </div>
      </div>

      {/* Pages List */}
      <div className="bg-white rounded-xl shadow-sm border">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">אין עמודים</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'לא נמצאו עמודים התואמים לחיפוש'
                : 'עדיין לא נוצרו עמודים במערכת'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button onClick={() => setShowEditor(true)}>
                <Plus className="w-4 h-4 ml-2" />
                צור עמוד ראשון
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    עמוד
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    סטטוס
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    עודכן
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    פעולות
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{page.title}</h3>
                        <p className="text-sm text-gray-500">/{page.slug}</p>
                        {page.meta_description && (
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                            {page.meta_description}
                          </p>
                        )}
                        {page.status === 'published' && (
                          <a 
                            href={`/${page.slug}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline mt-1 block"
                          >
                            צפה באתר הציבורי ↗
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(page.status)}`}>
                        {getStatusText(page.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 ml-1" />
                        {formatDate(page.updated_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        {page.status === 'published' && (
                          <a
                            href={`/${page.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="צפייה באתר"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => {
                            setEditingPage(page)
                            setShowEditor(true)
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="עריכה"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setPageToDelete(page)
                            setShowDeleteModal(true)
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="מחיקה"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="מחיקת עמוד"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            האם אתה בטוח שברצונך למחוק את העמוד "{pageToDelete?.title}"?
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
              onClick={handleDeletePage}
            >
              מחק עמוד
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}