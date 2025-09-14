import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Search, Edit, Trash2, ExternalLink, ArrowLeft, Globe } from 'lucide-react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Modal } from './ui/Modal'
import { LoadingSpinner } from './ui/LoadingSpinner'
import { supabase } from '../lib/supabase'
import { formatDate } from '../lib/utils'
import toast from 'react-hot-toast'

interface Redirect {
  id: string
  from_path: string
  to_path: string
  status_code: number
  created_at: string
  updated_at: string
}

interface RedirectFormData {
  from_path: string
  to_path: string
  status_code: number
}

export const RedirectsManager: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [redirects, setRedirects] = useState<Redirect[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingRedirect, setEditingRedirect] = useState<Redirect | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [redirectToDelete, setRedirectToDelete] = useState<Redirect | null>(null)
  const [formData, setFormData] = useState<RedirectFormData>({
    from_path: '',
    to_path: '',
    status_code: 301
  })
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})

  useEffect(() => {
    // Check if we should open the create modal immediately
    if (searchParams.get('action') === 'create') {
      openCreateModal()
      // Remove the action parameter from URL
      setSearchParams({})
    }
    
    loadRedirects()
  }, [searchParams, setSearchParams])

  const loadRedirects = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('redirects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setRedirects(data || [])
    } catch (error: any) {
      toast.error('שגיאה בטעינת ההפניות')
      console.error('Error loading redirects:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const errors: {[key: string]: string} = {}

    if (!formData.from_path.trim()) {
      errors.from_path = 'נתיב מקור חובה'
    } else if (!formData.from_path.startsWith('/')) {
      errors.from_path = 'נתיב מקור חייב להתחיל ב-/'
    }

    if (!formData.to_path.trim()) {
      errors.to_path = 'נתיב יעד חובה'
    } else if (!formData.to_path.startsWith('/') && !formData.to_path.startsWith('http')) {
      errors.to_path = 'נתיב יעד חייב להתחיל ב-/ או להיות URL מלא'
    }

    if (![301, 302, 307, 308].includes(formData.status_code)) {
      errors.status_code = 'קוד סטטוס לא תקין'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSaveRedirect = async () => {
    if (!validateForm()) return

    try {
      const redirectPayload = {
        from_path: formData.from_path.trim(),
        to_path: formData.to_path.trim(),
        status_code: formData.status_code,
        updated_at: new Date().toISOString()
      }

      if (editingRedirect) {
        // Update existing redirect
        const { data, error } = await supabase
          .from('redirects')
          .update(redirectPayload)
          .eq('id', editingRedirect.id)
          .select()

        if (error) throw error
        console.log('Redirect updated successfully:', data)
        toast.success('ההפניה עודכנה בהצלחה')
      } else {
        // Create new redirect
        const { data, error } = await supabase
          .from('redirects')
          .insert([{ ...redirectPayload, created_at: new Date().toISOString() }])
          .select()

        if (error) throw error
        console.log('Redirect created successfully:', data)
        toast.success('ההפניה נוצרה בהצלחה')
      }

      setShowModal(false)
      setEditingRedirect(null)
      setFormData({ from_path: '', to_path: '', status_code: 301 })
      setFormErrors({})
      loadRedirects()
    } catch (error: any) {
      console.error('Error saving redirect:', error)
      toast.error(error.message || 'שגיאה בשמירת ההפניה')
    }
  }

  const handleDeleteRedirect = async () => {
    if (!redirectToDelete) return

    try {
      const { error } = await supabase
        .from('redirects')
        .delete()
        .eq('id', redirectToDelete.id)

      if (error) throw error
      
      toast.success('ההפניה נמחקה בהצלחה')
      setShowDeleteModal(false)
      setRedirectToDelete(null)
      loadRedirects()
    } catch (error: any) {
      toast.error('שגיאה במחיקת ההפניה')
    }
  }

  const openEditModal = (redirect: Redirect) => {
    setEditingRedirect(redirect)
    setFormData({
      from_path: redirect.from_path,
      to_path: redirect.to_path,
      status_code: redirect.status_code
    })
    setFormErrors({})
    setShowModal(true)
  }

  const openCreateModal = () => {
    setEditingRedirect(null)
    setFormData({ from_path: '', to_path: '', status_code: 301 })
    setFormErrors({})
    setShowModal(true)
  }

  const filteredRedirects = redirects.filter(redirect =>
    redirect.from_path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    redirect.to_path.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusCodeColor = (code: number) => {
    switch (code) {
      case 301: return 'bg-green-100 text-green-800'
      case 302: return 'bg-blue-100 text-blue-800'
      case 307: return 'bg-yellow-100 text-yellow-800'
      case 308: return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusCodeText = (code: number) => {
    switch (code) {
      case 301: return '301 - קבוע'
      case 302: return '302 - זמני'
      case 307: return '307 - זמני'
      case 308: return '308 - קבוע'
      default: return code.toString()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ניהול הפניות 301</h1>
          <p className="text-gray-600 mt-1">נהל הפניות URL לשיפור SEO ותחזוקת קישורים</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 ml-2" />
          הפניה חדשה
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="חיפוש הפניות..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Redirects List */}
      <div className="bg-white rounded-xl shadow-sm border">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredRedirects.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">אין הפניות</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? 'לא נמצאו הפניות התואמות לחיפוש'
                : 'עדיין לא נוצרו הפניות במערכת'
              }
            </p>
            {!searchTerm && (
              <Button onClick={openCreateModal}>
                <Plus className="w-4 h-4 ml-2" />
                הוסף הפניה ראשונה
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    נתיב מקור
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    נתיב יעד
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    סטטוס
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    נוצר
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    פעולות
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRedirects.map((redirect) => (
                  <tr key={redirect.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                          {redirect.from_path}
                        </code>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <ArrowLeft className="w-4 h-4 text-gray-400 ml-2" />
                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                          {redirect.to_path}
                        </code>
                        {redirect.to_path.startsWith('http') && (
                          <ExternalLink className="w-3 h-3 text-gray-400 mr-1" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusCodeColor(redirect.status_code)}`}>
                        {getStatusCodeText(redirect.status_code)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(redirect.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <button
                          onClick={() => openEditModal(redirect)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="עריכה"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setRedirectToDelete(redirect)
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

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingRedirect ? 'עריכת הפניה' : 'הפניה חדשה'}
        size="lg"
      >
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">מה זה הפניות 301?</h3>
            <p className="text-sm text-blue-700">
              הפניות 301 מעבירות משתמשים ומנועי חיפוש מכתובת ישנה לכתובת חדשה, 
              ומשמרות את הדירוג ב-SEO.
            </p>
          </div>

          <Input
            label="נתיב מקור (מאיפה)"
            value={formData.from_path}
            onChange={(e) => setFormData({ ...formData, from_path: e.target.value })}
            placeholder="/old-page"
            error={formErrors.from_path}
          />

          <Input
            label="נתיב יעד (לאן)"
            value={formData.to_path}
            onChange={(e) => setFormData({ ...formData, to_path: e.target.value })}
            placeholder="/new-page או https://example.com"
            error={formErrors.to_path}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              קוד סטטוס
            </label>
            <select
              value={formData.status_code}
              onChange={(e) => setFormData({ ...formData, status_code: parseInt(e.target.value) })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={301}>301 - הפניה קבועה (מומלץ)</option>
              <option value={302}>302 - הפניה זמנית</option>
              <option value={307}>307 - הפניה זמנית (שומר על method)</option>
              <option value={308}>308 - הפניה קבועה (שומר על method)</option>
            </select>
            {formErrors.status_code && (
              <p className="text-sm text-red-600 mt-1">{formErrors.status_code}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 space-x-reverse">
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              ביטול
            </Button>
            <Button onClick={handleSaveRedirect}>
              {editingRedirect ? 'עדכן הפניה' : 'צור הפניה'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="מחיקת הפניה"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            האם אתה בטוח שברצונך למחוק את ההפניה מ-"{redirectToDelete?.from_path}" 
            ל-"{redirectToDelete?.to_path}"?
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
              onClick={handleDeleteRedirect}
            >
              מחק הפניה
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}