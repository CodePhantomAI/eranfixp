import React, { useState, useEffect } from 'react'
import { Plus, Search, Filter, Edit, Trash2, Download, FileText, Calendar, BarChart } from 'lucide-react'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'
import { LoadingSpinner } from './ui/LoadingSpinner'
import { ResearchEditor } from './ResearchEditor'
import { supabase } from '../lib/supabase'
import { formatDate } from '../lib/utils'
import toast from 'react-hot-toast'
import { AutoSEO } from '../lib/seo-automation'

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
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
}

const categories = [
  { value: 'all', label: 'כל הקטגוריות' },
  { value: 'seo', label: 'קידום אתרים' },
  { value: 'web-development', label: 'פיתוח אתרים' },
  { value: 'ai', label: 'בינה מלאכותית' },
  { value: 'digital-marketing', label: 'שיווק דיגיטלי' },
  { value: 'ux-ui', label: 'חוויית משתמש' },
  { value: 'analytics', label: 'אנליטיקה' },
]

export const ResearchManager: React.FC = () => {
  const [papers, setPapers] = useState<ResearchPaper[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [paperToDelete, setPaperToDelete] = useState<ResearchPaper | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingPaper, setEditingPaper] = useState<ResearchPaper | null>(null)

  useEffect(() => {
    loadPapers()
  }, [])

  const loadPapers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('research_papers')
        .select('*')
        .order('publication_date', { ascending: false })

      if (error) throw error
      setPapers(data || [])
    } catch (error: any) {
      toast.error('שגיאה בטעינת המחקרים')
      console.error('Error loading research papers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePaper = async () => {
    if (!paperToDelete) return

    try {
      const { error } = await supabase
        .from('research_papers')
        .delete()
        .eq('id', paperToDelete.id)

      if (error) throw error
      
      toast.success('המחקר נמחק בהצלחה')
      setShowDeleteModal(false)
      setPaperToDelete(null)
      loadPapers()
    } catch (error: any) {
      toast.error('שגיאה במחיקת המחקר')
    }
  }

  const handleSavePaper = async (paperData: any) => {
    try {
      const paperPayload = {
        title: paperData.title,
        slug: paperData.slug,
        abstract: paperData.abstract,
        content: paperData.content,
        featured_image: paperData.featured_image || null,
        pdf_url: paperData.pdf_url || null,
        authors: paperData.authors,
        publication_date: paperData.publication_date || null,
        category: paperData.category,
        tags: paperData.tags,
        citations: 0,
        downloads: 0,
        status: paperData.status,
        updated_at: new Date().toISOString()
      }

      let error
      
      if (editingPaper) {
        // Update existing paper
        const result = await supabase
          .from('research_papers')
          .update(paperPayload)
          .eq('id', editingPaper.id)
          .select()
        error = result.error
        console.log('Research paper updated:', result.data)
        
        // הודעה לגוגל על עדכון מחקר
        if (result.data && result.data[0]) {
          AutoSEO.notifyGoogleOfNewPage(`/research/${result.data[0].slug}`)
        }
        
        toast.success('המחקר עודכן בהצלחה')
      } else {
        // Create new paper
        const result = await supabase
          .from('research_papers')
          .insert([{ ...paperPayload, created_at: new Date().toISOString() }])
          .select()
        error = result.error
        console.log('Research paper created:', result.data)
        
        // הודעה לגוגל על מחקר חדש
        if (result.data && result.data[0]) {
          AutoSEO.notifyGoogleOfNewPage(`/research/${result.data[0].slug}`)
          console.log('Notified Google about new research paper:', result.data[0].slug)
        }
        
        toast.success('המחקר נוצר בהצלחה')
      }

      if (error) throw error
      setShowCreateModal(false)
      setShowEditModal(false)
      setEditingPaper(null)
      loadPapers()
    } catch (error: any) {
      console.error('Error saving research paper:', error)
      toast.error(error.message || 'שגיאה בשמירת המחקר')
    }
  }

  const filteredPapers = papers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || paper.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || paper.category === categoryFilter
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ניהול מחקרים</h1>
          <p className="text-gray-600 mt-1">נהל את כל המחקרים והעבודות המקצועיות</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 ml-2" />
          מחקר חדש
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
                placeholder="חיפוש מחקרים..."
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

      {/* Papers List */}
      <div className="bg-white rounded-xl shadow-sm border">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredPapers.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">אין מחקרים</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'לא נמצאו מחקרים התואמים לחיפוש'
                : 'עדיין לא נוצרו מחקרים במערכת'
              }
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 ml-2" />
              צור מחקר ראשון
            </Button>
          </div>
        ) : (
          <div className="space-y-4 p-6">
            {filteredPapers.map((paper) => (
              <div key={paper.id} className="border rounded-lg p-6 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{paper.title}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(paper.status)}`}>
                        {getStatusText(paper.status)}
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium rounded-full">
                        {categories.find(cat => cat.value === paper.category)?.label || paper.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      {paper.authors.length > 0 && (
                        <span>מחברים: {paper.authors.join(', ')}</span>
                      )}
                      {paper.publication_date && (
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 ml-1" />
                          {formatDate(paper.publication_date)}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Download className="w-4 h-4 ml-1" />
                        {paper.downloads} הורדות
                      </div>
                      <div className="flex items-center">
                        <BarChart className="w-4 h-4 ml-1" />
                        {paper.citations} ציטוטים
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {paper.abstract}
                    </p>
                    
                    {paper.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {paper.tags.slice(0, 5).map((tag, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                        {paper.tags.length > 5 && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            +{paper.tags.length - 5}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 space-x-reverse mr-4">
                    {paper.pdf_url && (
                      <a
                        href={paper.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="הורד PDF"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => {
                        setEditingPaper(paper)
                        setShowEditModal(true)
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="עריכה"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setPaperToDelete(paper)
                        setShowDeleteModal(true)
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
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
        title="מחיקת מחקר"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            האם אתה בטוח שברצונך למחוק את המחקר "{paperToDelete?.title}"?
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
              onClick={handleDeletePaper}
            >
              מחק מחקר
            </Button>
          </div>
        </div>
      </Modal>

      {/* Research Editor for Create */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          <ResearchEditor
            onSave={handleSavePaper}
            onCancel={() => setShowCreateModal(false)}
          />
        </div>
      )}

      {/* Research Editor for Edit */}
      {showEditModal && editingPaper && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          <ResearchEditor
            onSave={handleSavePaper}
            onCancel={() => {
              setShowEditModal(false)
              setEditingPaper(null)
            }}
            initialData={{
              title: editingPaper.title,
              slug: editingPaper.slug,
              abstract: editingPaper.abstract,
              content: editingPaper.content,
              featured_image: editingPaper.featured_image || '',
              pdf_url: editingPaper.pdf_url || '',
              authors: editingPaper.authors,
              publication_date: editingPaper.publication_date || '',
              category: editingPaper.category,
              tags: editingPaper.tags,
              status: editingPaper.status
            }}
          />
        </div>
      )}
    </div>
  )
}