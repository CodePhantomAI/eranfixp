import React, { useState } from 'react'
import { Save, ArrowLeft, Globe, FileText, Calendar, Code, User, ExternalLink } from 'lucide-react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { RichTextEditor } from './RichTextEditor'
import { slugify } from '../lib/utils'

interface PortfolioFormData {
  title: string
  slug: string
  description: string
  content: string
  featured_image: string
  client_name: string
  project_url: string
  technologies: string[]
  category: string
  completion_date: string
  status: 'draft' | 'published' | 'archived'
}

interface PortfolioEditorProps {
  onSave: (data: PortfolioFormData) => void
  onCancel: () => void
  initialData?: Partial<PortfolioFormData>
}

const categories = [
  { value: 'web-development', label: 'פיתוח אתרים' },
  { value: 'seo', label: 'קידום SEO' },
  { value: 'ai-solutions', label: 'פתרונות AI' },
  { value: 'e-commerce', label: 'חנויות מקוונות' },
  { value: 'mobile-apps', label: 'אפליקציות' },
]

export const PortfolioEditor: React.FC<PortfolioEditorProps> = ({ 
  onSave, 
  onCancel, 
  initialData 
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'content' | 'details'>('content')
  const [formData, setFormData] = useState<PortfolioFormData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    content: initialData?.content || '',
    featured_image: initialData?.featured_image || '',
    client_name: initialData?.client_name || '',
    project_url: initialData?.project_url || '',
    technologies: initialData?.technologies || [],
    category: initialData?.category || 'web-development',
    completion_date: initialData?.completion_date || '',
    status: initialData?.status || 'draft'
  })
  const [techInput, setTechInput] = useState('')
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
    
    if (!formData.description.trim()) {
      newErrors.description = 'תיאור חובה'
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

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()]
      }))
      setTechInput('')
    }
  }

  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
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
              {initialData?.title ? 'עריכת פרויקט' : 'פרויקט חדש'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-3 space-x-reverse">
            <Button 
              type="submit" 
              form="portfolio-form" 
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
      <form id="portfolio-form" onSubmit={handleSubmit} className="p-6">
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Title */}
            <div>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="שם הפרויקט..."
                className="block w-full px-4 py-4 text-2xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תיאור קצר
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="תיאור קצר של הפרויקט..."
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description}</p>
              )}
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תוכן מפורט
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                placeholder="תאר את הפרויקט בפירוט..."
              />
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
                  placeholder="project-name"
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

              {/* Client Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  שם הלקוח
                </label>
                <input
                  type="text"
                  value={formData.client_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                  placeholder="שם הלקוח (אופציונלי)"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Project URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  קישור לפרויקט
                </label>
                <input
                  type="url"
                  value={formData.project_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, project_url: e.target.value }))}
                  placeholder="https://example.com"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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

              {/* Completion Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  תאריך השלמה
                </label>
                <input
                  type="date"
                  value={formData.completion_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, completion_date: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Technologies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                טכנולוגיות
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                  placeholder="הוסף טכנולוגיה..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button type="button" onClick={addTechnology} size="sm">
                  הוסף
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(tech)}
                      className="mr-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                סטטוס הפרויקט
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
      </form>
    </div>
  )
}