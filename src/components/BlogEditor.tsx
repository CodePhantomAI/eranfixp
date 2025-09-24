import React, { useState, useEffect } from 'react'
import { Save, X, Eye, Globe, Calendar, Tag, Image, FileText, AlertCircle } from 'lucide-react'
import { Button } from './ui/Button'
import { RichTextEditor } from './RichTextEditor'
import { generateSlug, calculateReadTime } from '../lib/utils'
import toast from 'react-hot-toast'

interface BlogCategory {
  id: string
  name: string
  slug: string
  color: string
}

interface BlogEditorProps {
  onSave: (data: any) => void
  onCancel: () => void
  categories: BlogCategory[]
  initialData?: {
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
}

export const BlogEditor: React.FC<BlogEditorProps> = ({
  onSave,
  onCancel,
  categories,
  initialData
}) => {
  const [formData, setFormData] = useState({
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
    status: initialData?.status || 'draft' as const
  })

  const [tagInput, setTagInput] = useState('')
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'settings'>('content')
  const [saving, setSaving] = useState(false)

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !initialData) {
      const newSlug = generateSlug(formData.title)
      setFormData(prev => ({ ...prev, slug: newSlug }))
    }
  }, [formData.title, initialData])

  // Auto-calculate read time from content
  useEffect(() => {
    if (formData.content) {
      const readTime = calculateReadTime(formData.content)
      setFormData(prev => ({ ...prev, read_time: readTime }))
    }
  }, [formData.content])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSave = async (status: 'draft' | 'published') => {
    if (!formData.title.trim()) {
      toast.error('כותרת הפוסט חובה')
      return
    }

    if (!formData.slug.trim()) {
      toast.error('Slug חובה')
      return
    }

    if (!formData.content.trim()) {
      toast.error('תוכן הפוסט חובה')
      return
    }

    setSaving(true)
    try {
      await onSave({
        ...formData,
        status,
        meta_title: formData.meta_title || formData.title,
        meta_description: formData.meta_description || formData.excerpt
      })
    } catch (error) {
      console.error('Error saving blog post:', error)
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'content', label: 'תוכן', icon: FileText },
    { id: 'seo', label: 'SEO', icon: Globe },
    { id: 'settings', label: 'הגדרות', icon: AlertCircle }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4 space-x-reverse">
              <h1 className="text-xl font-semibold text-gray-900">
                {initialData ? 'עריכת פוסט' : 'פוסט חדש'}
              </h1>
              {formData.title && (
                <span className="text-sm text-gray-500">- {formData.title}</span>
              )}
            </div>
            
            <div className="flex items-center space-x-3 space-x-reverse">
              <Button
                variant="secondary"
                onClick={onCancel}
                disabled={saving}
              >
                <X className="w-4 h-4 ml-2" />
                ביטול
              </Button>
              
              <Button
                variant="secondary"
                onClick={() => handleSave('draft')}
                disabled={saving}
              >
                <Save className="w-4 h-4 ml-2" />
                שמור כטיוטה
              </Button>
              
              <Button
                onClick={() => handleSave('published')}
                disabled={saving}
              >
                <Globe className="w-4 h-4 ml-2" />
                פרסם
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border mb-6">
              <div className="border-b">
                <nav className="flex space-x-8 space-x-reverse px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="w-4 h-4 ml-2" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Content Tab */}
                {activeTab === 'content' && (
                  <div className="space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        כותרת הפוסט *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="הכנס כותרת מעניינת ומושכת..."
                        className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    {/* Slug */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slug (כתובת URL) *
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                          /blog/
                        </span>
                        <input
                          type="text"
                          value={formData.slug}
                          onChange={(e) => handleInputChange('slug', e.target.value)}
                          placeholder="post-slug"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Excerpt */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        תקציר (מומלץ)
                      </label>
                      <textarea
                        value={formData.excerpt}
                        onChange={(e) => handleInputChange('excerpt', e.target.value)}
                        placeholder="תקציר קצר של הפוסט שיוצג ברשימות ובתוצאות חיפוש..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Content Editor */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        תוכן הפוסט *
                      </label>
                      <RichTextEditor
                        value={formData.content}
                        onChange={(content) => handleInputChange('content', content)}
                        placeholder="כתוב את תוכן הפוסט כאן..."
                        height="500px"
                      />
                    </div>
                  </div>
                )}

                {/* SEO Tab */}
                {activeTab === 'seo' && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-medium text-blue-900 mb-2">אופטימיזציה למנועי חיפוש</h3>
                      <p className="text-sm text-blue-700">
                        שדות אלה יעזרו לפוסט שלך להופיע טוב יותר בגוגל ורשתות חברתיות
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Title (כותרת SEO)
                      </label>
                      <input
                        type="text"
                        value={formData.meta_title}
                        onChange={(e) => handleInputChange('meta_title', e.target.value)}
                        placeholder={formData.title || "כותרת לגוגל (אם ריק - ייקח את הכותרת הרגילה)"}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={60}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        מומלץ: 50-60 תווים ({formData.meta_title.length}/60)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Description (תיאור SEO)
                      </label>
                      <textarea
                        value={formData.meta_description}
                        onChange={(e) => handleInputChange('meta_description', e.target.value)}
                        placeholder={formData.excerpt || "תיאור קצר לגוגל (אם ריק - ייקח את התקציר)"}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={160}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        מומלץ: 150-160 תווים ({formData.meta_description.length}/160)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        תמונה ראשית (Featured Image)
                      </label>
                      <input
                        type="url"
                        value={formData.featured_image}
                        onChange={(e) => handleInputChange('featured_image', e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {formData.featured_image && (
                        <div className="mt-2">
                          <img
                            src={formData.featured_image}
                            alt="תצוגה מקדימה"
                            className="w-32 h-20 object-cover rounded border"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        קטגוריה
                      </label>
                      <select
                        value={formData.category_id}
                        onChange={(e) => handleInputChange('category_id', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">בחר קטגוריה...</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        תגיות
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                          placeholder="הוסף תגית..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={handleAddTag}
                          disabled={!tagInput.trim()}
                        >
                          הוסף
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                          >
                            <Tag className="w-3 h-3 ml-1" />
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="mr-2 text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        זמן קריאה (דקות)
                      </label>
                      <input
                        type="number"
                        value={formData.read_time}
                        onChange={(e) => handleInputChange('read_time', parseInt(e.target.value) || 5)}
                        min="1"
                        max="60"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        מחושב אוטומטית לפי אורך התוכן
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
              <h3 className="font-medium text-gray-900 mb-4">סטטוס הפוסט</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">סטטוס:</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    formData.status === 'published' 
                      ? 'bg-green-100 text-green-800'
                      : formData.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {formData.status === 'published' ? 'פורסם' : 
                     formData.status === 'draft' ? 'טיוטה' : 'בארכיון'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">זמן קריאה:</span>
                  <span className="text-sm font-medium">{formData.read_time} דק'</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">תווים:</span>
                  <span className="text-sm font-medium">{formData.content.length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">מילים:</span>
                  <span className="text-sm font-medium">
                    {formData.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length}
                  </span>
                </div>

                {formData.tags.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-600 block mb-2">תגיות:</span>
                    <div className="flex flex-wrap gap-1">
                      {formData.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {formData.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          +{formData.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="space-y-3">
                  <Button
                    variant="secondary"
                    onClick={() => handleSave('draft')}
                    disabled={saving}
                    className="w-full"
                  >
                    <Save className="w-4 h-4 ml-2" />
                    {saving ? 'שומר...' : 'שמור טיוטה'}
                  </Button>
                  
                  <Button
                    onClick={() => handleSave('published')}
                    disabled={saving}
                    className="w-full"
                  >
                    <Globe className="w-4 h-4 ml-2" />
                    {saving ? 'מפרסם...' : 'פרסם עכשיו'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}