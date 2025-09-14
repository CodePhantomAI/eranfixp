import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Search, Filter, Edit, Trash2, Upload, Image as ImageIcon, Download, Copy } from 'lucide-react'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'
import { LoadingSpinner } from './ui/LoadingSpinner'
import { supabase } from '../lib/supabase'
import { uploadToCloudinary, deleteFromCloudinary } from '../lib/cloudinary'
import { formatDate } from '../lib/utils'
import toast from 'react-hot-toast'

interface MediaItem {
  id: string
  filename: string
  original_name: string
  file_size: number
  mime_type: string
  url: string
  alt_text: string | null
  created_at: string
}

export const MediaManager: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<MediaItem | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)

  useEffect(() => {
    // Check if we should open the upload modal immediately
    if (searchParams.get('action') === 'upload') {
      setShowUploadModal(true)
      // Remove the action parameter from URL
      setSearchParams({})
    }
    
    loadMediaItems()
  }, [searchParams, setSearchParams])

  const loadMediaItems = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMediaItems(data || [])
    } catch (error: any) {
      toast.error('שגיאה בטעינת הקבצים')
      console.error('Error loading media items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error('אנא בחר קבצים להעלאה')
      return
    }

    setUploading(true)
    try {
      const uploadPromises = Array.from(selectedFiles).map(async (file) => {
        // Upload to Cloudinary
        const cloudinaryResult = await uploadToCloudinary(file, 'eranfixer-media')
        
        // Save to database
        const { data, error } = await supabase
          .from('media')
          .insert([{
            filename: cloudinaryResult.publicId,
            original_name: file.name,
            file_size: file.size,
            mime_type: file.type,
            url: cloudinaryResult.url,
            alt_text: null,
            created_at: new Date().toISOString()
          }])
          .select()

        if (error) throw error
        console.log('Media file saved successfully:', data)
        return cloudinaryResult
      })

      await Promise.all(uploadPromises)
      
      toast.success(`${selectedFiles.length} קבצים הועלו בהצלחה`)
      setShowUploadModal(false)
      setSelectedFiles(null)
      loadMediaItems()
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error('שגיאה בהעלאת הקבצים')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!itemToDelete) return

    try {
      // Delete from Cloudinary (if possible)
      try {
        await deleteFromCloudinary(itemToDelete.filename)
      } catch (error) {
        console.warn('Could not delete from Cloudinary:', error)
        // Continue with database deletion even if Cloudinary fails
      }
      
      // Delete from database
      const { error } = await supabase
        .from('media')
        .delete()
        .eq('id', itemToDelete.id)

      if (error) throw error
      
      toast.success('הקובץ נמחק בהצלחה')
      setShowDeleteModal(false)
      setItemToDelete(null)
      loadMediaItems()
    } catch (error: any) {
      toast.error('שגיאה במחיקת הקובץ')
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('הקישור הועתק ללוח')
  }

  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = item.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.alt_text && item.alt_text.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = typeFilter === 'all' || item.mime_type.startsWith(typeFilter)
    return matchesSearch && matchesType
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ניהול מדיה</h1>
          <p className="text-gray-600 mt-1">נהל תמונות וקבצי מדיה עם Cloudinary</p>
        </div>
        <Button onClick={() => setShowUploadModal(true)}>
          <Plus className="w-4 h-4 ml-2" />
          העלאת קבצים
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
                placeholder="חיפוש קבצים..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">כל הקבצים</option>
              <option value="image">תמונות</option>
              <option value="video">וידאו</option>
              <option value="application">מסמכים</option>
            </select>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      <div className="bg-white rounded-xl shadow-sm border">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">אין קבצי מדיה</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || typeFilter !== 'all'
                ? 'לא נמצאו קבצים התואמים לחיפוש'
                : 'עדיין לא הועלו קבצים למערכת'
              }
            </p>
            <Button onClick={() => setShowUploadModal(true)}>
              <Plus className="w-4 h-4 ml-2" />
              העלה קבצים ראשונים
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="group relative bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square">
                  {item.mime_type.startsWith('image/') ? (
                    <img
                      src={item.url}
                      alt={item.alt_text || item.original_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2 space-x-reverse">
                      <button
                        onClick={() => copyToClipboard(item.url)}
                        className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                        title="העתק קישור"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                        title="פתח בחלון חדש"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => {
                          setItemToDelete(item)
                          setShowDeleteModal(true)
                        }}
                        className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
                        title="מחק"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-900 truncate" title={item.original_name}>
                    {item.original_name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatFileSize(item.file_size)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDate(item.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="העלאת קבצים"
        size="lg"
      >
        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              בחר קבצים להעלאה
            </h3>
            <p className="text-gray-600 mb-4">
              תמונות, וידאו ומסמכים עד 10MB לקובץ
            </p>
            <input
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx"
              onChange={(e) => setSelectedFiles(e.target.files)}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer inline-block"
            >
              בחר קבצים
            </label>
          </div>

          {selectedFiles && selectedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">קבצים נבחרים:</h4>
              <div className="max-h-32 overflow-y-auto">
                {Array.from(selectedFiles).map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 space-x-reverse">
            <Button
              variant="secondary"
              onClick={() => setShowUploadModal(false)}
              disabled={uploading}
            >
              ביטול
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFiles || selectedFiles.length === 0 || uploading}
            >
              {uploading ? (
                <>
                  <LoadingSpinner size="sm" className="ml-2" />
                  מעלה...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 ml-2" />
                  העלה קבצים
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="מחיקת קובץ"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            האם אתה בטוח שברצונך למחוק את הקובץ "{itemToDelete?.original_name}"?
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
              onClick={handleDelete}
            >
              מחק קובץ
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}