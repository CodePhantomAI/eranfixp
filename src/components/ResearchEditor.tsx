import React, { useState } from 'react'
import { Save, ArrowLeft, Globe, FileText, Calendar, User, Download } from 'lucide-react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { RichTextEditor } from './RichTextEditor'
import { slugify } from '../lib/utils'

interface ResearchFormData {
  title: string
  slug: string
  abstract: string
  content: string
  featured_image: string
  pdf_url: string
  authors: string[]
  publication_date: string
  category: string
  tags: string[]
  status: 'draft' | 'published' | 'archived'
}

interface ResearchEditorProps {
  onSave: (data: ResearchFormData) => void
  onCancel: () => void
  initialData?: Partial<ResearchFormData>
}

const categories = [
  { value: 'seo', label: 'קידום אתרים' },
  { value: 'web-development', label: 'פיתוח אתרים' },
  { value: 'ai', label: 'בינה מלאכותית' },
  { value: 'digital-marketing', label: 'שיווק דיגיטלי' },
  { value: 'ux-ui', label: 'חוויית משתמש' },
  { value: 'analytics', label: 'אנליטיקה' },
]

export const ResearchEditor: React.FC<ResearchEditorProps> = ({ 
  onSave, 
  onCancel, 
  initialData 
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'content' | 'details'>('content')
  const [formData, setFormData] = useState<ResearchFormData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    abstract: initialData?.abstract || '',
    content: initialData?.content || '',
    featured_image: initialData?.featured_image || '',
    pdf_url: initialData?.pdf_url || '',
    authors: initialData?.authors || [],
    publication_date: initialData?.publication_date || '',
    category: initialData?.category || 'seo',
    tags: initialData?.tags || [],
    status: initialData?.status || 'draft'
  })
  const [authorInput, setAuthorInput] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  // Auto-generate slug from title
  React.useEffect(() => {
    if (formData.title && (!formData.slug || !initialData?.slug)) {
      setFormData(prev => ({ ...prev, slug: slugify(formData.title) }))
    }
  }, [formData.title, formData.slug, initialData])

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'כותרת חובה'
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'נתיב URL חובה'
    }
    
    if (!formData.abstract.trim()) {
      newErrors.abstract = 'תקציר חובה'
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'תוכן חובה'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    try {
      await onSave(formData)
    } finally {
      setIsLoading(false)
    }
  }

  const addAuthor = () => {
    if (authorInput.trim() && !formData.authors.includes(authorInput.trim())) {
      setFormData(prev => ({
        ...prev,
        authors: [...prev.authors, authorInput.trim()]
      }))
      setAuthorInput('')
    }
  }

  const removeAuthor = (author: string) => {
    setFormData(prev => ({
      ...prev,
      authors: prev.authors.filter(a => a !== author)
    }))
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <ArrowLeft className="w-4 h-4 ml-1" />
              חזור לרשימה
            </Button>
            <div className="border-r border-gray-300 h-6 mx-2" />
            <h1 className="text-xl font-semibold text-gray-900">
              {initialData?.title ? 'עריכת מחקר' : 'מחקר חדש'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-3 space-x-reverse">
            <Button 
              type="submit" 
              form="research-form" 
              disabled={isLoading}
              size="sm"
            >
              <Save className="w-4 h-4 ml-1" />
              {isLoading ? 'שומר...' : 'שמירה'}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex mt-6 border-b">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'content'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="w-4 h-4 inline ml-2" />
            תוכן
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Globe className="w-4 h-4 inline ml-2" />
            פרטים
          </button>
        </div>
      </div>

      {/* Form */}
      <form id="research-form" onSubmit={handleSubmit} className="p-6">
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Title */}
            <div>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="כותרת המחקר..."
                className="block w-full px-4 py-4 text-2xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title}</p>
              )}
            </div>

            {/* Abstract */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תקציר המחקר
              </label>
              <textarea
                value={formData.abstract}
                onChange={(e) => setFormData(prev => ({ ...prev, abstract: e.target.value }))}
                rows={5}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="תקציר מפורט של המחקר..."
              />
              {errors.abstract && (
                <p className="text-sm text-red-600 mt-1">{errors.abstract}</p>
              )}
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תוכן המחקר המלא
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                placeholder="כתוב את תוכן המחקר המלא כאן..."
              />
              {errors.content && (
                <p className="text-sm text-red-600 mt-1">{errors.content}</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  נתיב URL (Slug)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="research-name"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.slug && (
                  <p className="text-sm text-red-600 mt-1">{errors.slug}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  קטגוריה
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Publication Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  תאריך פרסום
                </label>
                <input
                  type="date"
                  value={formData.publication_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, publication_date: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  סטטוס המחקר
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">טיוטה</option>
                  <option value="published">פורסם</option>
                  <option value="archived">בארכיון</option>
                </select>
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  תמונה ראשית
                </label>
                <input
                  type="url"
                  value={formData.featured_image}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* PDF URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  קישור לקובץ PDF
                </label>
                <input
                  type="url"
                  value={formData.pdf_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, pdf_url: e.target.value }))}
                  placeholder="https://example.com/research.pdf"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Authors */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                מחברים
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={authorInput}
                  onChange={(e) => setAuthorInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAuthor())}
                  placeholder="הוסף מחבר..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button type="button" onClick={addAuthor} size="sm">
                  הוסף
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.authors.map((author, index) => (
                  <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center">
                    <User className="w-3 h-3 ml-1" />
                    {author}
                    <button
                      type="button"
                      onClick={() => removeAuthor(author)}
                      className="mr-2 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תגיות
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="הוסף תגית..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button type="button" onClick={addTag} size="sm">
                  הוסף
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="mr-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}