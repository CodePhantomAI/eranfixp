import React, { useState } from 'react'
import { Save, Eye, ArrowLeft, Globe, FileText } from 'lucide-react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { RichTextEditor } from './RichTextEditor'
import { SEOTools } from './admin/SEOTools'
import { ContentPreview } from './ui/ContentPreview'
import { slugify } from '../lib/utils'

interface PageFormData {
  title: string
  slug: string
  content: string
  meta_title: string
  meta_description: string
  status: 'draft' | 'published' | 'archived'
}

interface PageEditorProps {
  onSave: (data: PageFormData) => void
  onCancel: () => void
  initialData?: Partial<PageFormData>
}

export const PageEditor: React.FC<PageEditorProps> = ({ 
  onSave, 
  onCancel, 
  initialData 
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content')
  const [showPreview, setShowPreview] = useState(false)
  const [formData, setFormData] = useState<PageFormData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    content: initialData?.content || '',
    meta_title: initialData?.meta_title || '',
    meta_description: initialData?.meta_description || '',
    status: initialData?.status || 'draft'
  })
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
    
    // Allow empty content for now
    // if (!formData.content.trim()) {
    //   newErrors.content = 'תוכן חובה'
    // }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      console.log('Form validation failed:', errors)
      return
    }
    
    console.log('Submitting form with data:', formData)
    
    setIsLoading(true)
    try {
      await onSave(formData)
    } finally {
      setIsLoading(false)
    }
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
              {initialData?.title ? 'עריכת עמוד' : 'עמוד חדש'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-3 space-x-reverse">
            <Button variant="ghost" size="sm" onClick={() => setShowPreview(true)}>
              <Eye className="w-4 h-4 ml-1" />
              תצוגה מקדימה
            </Button>
            <Button 
              type="submit" 
              form="page-form" 
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
      <form id="page-form" onSubmit={handleSubmit} className="p-6">
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Title */}
            <div>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="הכנס כותרת..."
                className="block w-full px-4 py-4 text-2xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title}</p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                נתיב URL (Slug)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="page-url"
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.slug && (
                <p className="text-sm text-red-600 mt-1">{errors.slug}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                הנתיב יהיה: eranfixer.com/{formData.slug || 'page-url'}
              </p>
              {formData.status === 'published' && formData.slug && (
                <p className="text-sm text-blue-600 mt-1">
                  <a 
                    href={`/${formData.slug}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    צפה בעמוד באתר ↗
                  </a>
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                סטטוס העמוד
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
              <p className="text-sm text-gray-500 mt-1">
                <strong>חשוב:</strong> עמודים עם סטטוס "פורסם" מופיעים באתר הציבורי מיד
              </p>
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תוכן העמוד
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
              />
              {errors.content && (
                <p className="text-sm text-red-600 mt-1">{errors.content}</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-6">
            <SEOTools content={{
              title: formData.title,
              description: formData.meta_description || formData.content.replace(/<[^>]*>/g, '').substring(0, 160),
              content: formData.content,
              slug: formData.slug
            }} />
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">אופטימיזציה למנועי חיפוש</h3>
              <p className="text-sm text-blue-700">
                הגדרות SEO יעזרו לעמוד להיכתב טוב יותר במנועי החיפוש
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
                placeholder="תיאור קצר של העמוד למנועי חיפוש..."
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
                  {formData.meta_title || formData.title || 'כותרת העמוד'}
                </div>
                <div className="text-green-700 text-sm">
                  eranfixer.com/{formData.slug || 'page-url'}
                </div>
                <div className="text-gray-600 text-sm mt-1">
                  {formData.meta_description || 'תיאור העמוד יופיע כאן במנועי החיפוש...'}
                </div>
              </div>
            </div>

            {/* Advanced SEO Options */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-4">🎯 אופטימיזציה מתקדמת</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Keywords Suggestions */}
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">מילות מפתח מומלצות</h5>
                  <div className="bg-white p-3 rounded border text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>אתרים בתל אביב</span>
                        <span className="text-green-600 text-xs">גבוה</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>קידום אתרים</span>
                        <span className="text-blue-600 text-xs">בינוני</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>פיתוח אתרים</span>
                        <span className="text-yellow-600 text-xs">נמוך</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* SEO Score */}
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">ציון SEO</h5>
                  <div className="bg-white p-3 rounded border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">כותרת:</span>
                      <span className={`text-sm font-medium ${
                        formData.title.length >= 30 && formData.title.length <= 60 
                          ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {formData.title.length >= 30 && formData.title.length <= 60 ? '✅' : '⚠️'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">תיאור:</span>
                      <span className={`text-sm font-medium ${
                        formData.meta_description.length >= 120 && formData.meta_description.length <= 160 
                          ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {formData.meta_description.length >= 120 && formData.meta_description.length <= 160 ? '✅' : '⚠️'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">תוכן:</span>
                      <span className={`text-sm font-medium ${
                        formData.content.split(/\s+/).length >= 300 
                          ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {formData.content.split(/\s+/).length >= 300 ? '✅' : '⚠️'}
                      </span>
                    </div>
                  </div>
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
        type="page"
      />
    </div>
  )
}