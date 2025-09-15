import React, { useState } from 'react'
import { Save, ArrowLeft, Globe, FileText, Calendar, Tag, User, Eye } from 'lucide-react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { RichTextEditor } from './RichTextEditor'
import { SEOTools } from './admin/SEOTools'
import { ContentPreview } from './ui/ContentPreview'
import { slugify } from '../lib/utils'

interface BlogFormData {
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image: string
  meta_title: string
  meta_description: string
  category_id: string
  tags: string[]
  read_time: number
  status: 'draft' | 'published' | 'archived'
}

interface BlogEditorProps {
  onSave: (data: BlogFormData) => void
  onCancel: () => void
  initialData?: Partial<BlogFormData>
  categories: Array<{id: string, name: string, color: string}>
}

export const BlogEditor: React.FC<BlogEditorProps> = ({ 
  onSave, 
  onCancel, 
  initialData,
  categories = []
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content')
  const [showPreview, setShowPreview] = useState(false)
  const [formData, setFormData] = useState<BlogFormData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    featured_image: initialData?.featured_image || '',
    meta_title: initialData?.meta_title || '',
    meta_description: initialData?.meta_description || '',
    category_id: initialData?.category_id || '',
    tags: initialData?.tags || [],
    read_time: initialData?.read_time || 5,
    status: initialData?.status || 'draft'
  })
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
    
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'תקציר חובה'
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
      console.log('Blog validation failed:', errors)
      return
    }
    
    console.log('Submitting blog with content length:', formData.content.length)
    console.log('Blog content preview:', formData.content.substring(0, 200))
    
    setIsLoading(true)
    try {
      await onSave(formData)
    } finally {
      setIsLoading(false)
    }
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
              {initialData?.title ? 'עריכת פוסט' : 'פוסט חדש'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-3 space-x-reverse">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowPreview(true)}
            >
              <Eye className="w-4 h-4 ml-1" />
              תצוגה מקדימה
            </Button>
            <Button 
              type="submit" 
              form="blog-form" 
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
            onClick={() => setActiveTab('seo')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'seo'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Globe className="w-4 h-4 inline ml-2" />
            SEO
          </button>
        </div>
      </div>

      {/* Form */}
      <form id="blog-form" onSubmit={handleSubmit} className="p-6">
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Title */}
            <div>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="כותרת הפוסט..."
                className="block w-full px-4 py-4 text-2xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title}</p>
              )}
            </div>

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
                  placeholder="post-url"
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
                  value={formData.category_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">בחר קטגוריה</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
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

              {/* Read Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  זמן קריאה (דקות)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={formData.read_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, read_time: parseInt(e.target.value) || 5 }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תקציר
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="תקציר קצר של הפוסט..."
              />
              {errors.excerpt && (
                <p className="text-sm text-red-600 mt-1">{errors.excerpt}</p>
              )}
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
                    <Tag className="w-3 h-3 ml-1" />
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

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תוכן הפוסט
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                placeholder="כתוב את תוכן הפוסט כאן..."
              />
              {errors.content && (
                <p className="text-sm text-red-600 mt-1">{errors.content}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                סטטוס הפוסט
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
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-6">
            <SEOTools content={{
              title: formData.title,
              description: formData.meta_description || formData.excerpt,
              content: formData.content,
              slug: formData.slug
            }} />
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">אופטימיזציה למנועי חיפוש</h3>
              <p className="text-sm text-blue-700">
                הגדרות SEO יעזרו לפוסט להיכתב טוב יותר במנועי החיפוש
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                כותרת SEO (Meta Title)
              </label>
              <input
                type="text"
                value={formData.meta_title}
                onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                placeholder="כותרת לתצוגה במנועי חיפוש..."
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                מומלץ: 50-60 תווים (כרגע: {formData.meta_title.length})
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תיאור SEO (Meta Description)
              </label>
              <textarea
                value={formData.meta_description}
                onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="תיאור קצר של הפוסט למנועי חיפוש..."
              />
              <p className="text-xs text-gray-500 mt-1">
                מומלץ: 150-160 תווים (כרגע: {formData.meta_description.length})
              </p>
            </div>

            {/* SEO Preview */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">תצוגה מקדימה בגוגל</h4>
              <div className="bg-white p-4 rounded border">
                <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                  {formData.meta_title || formData.title || 'כותרת הפוסט'}
                </div>
                <div className="text-green-700 text-sm">
                  eranfixer.com/blog/{formData.slug || 'post-url'}
                </div>
                <div className="text-gray-600 text-sm mt-1">
                  {formData.meta_description || formData.excerpt || 'תיאור הפוסט יופיע כאן במנועי החיפוש...'}
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
      
      {/* Content Preview */}
      <ContentPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title={formData.title}
        content={formData.content}
        slug={formData.slug}
        type="blog"
      />
    </div>
  )
}