import React from 'react'
import { Eye, Globe, Smartphone, Tablet, Monitor } from 'lucide-react'
import { Button } from './Button'
import { Modal } from './Modal'

interface ContentPreviewProps {
  isOpen: boolean
  onClose: () => void
  title: string
  content: string
  slug?: string
  type?: 'page' | 'blog' | 'portfolio'
}

export const ContentPreview: React.FC<ContentPreviewProps> = ({
  isOpen,
  onClose,
  title,
  content,
  slug,
  type = 'page'
}) => {
  const [viewMode, setViewMode] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  const getPreviewUrl = () => {
    if (!slug) return '#'
    
    switch (type) {
      case 'blog':
        return `/blog/${slug}`
      case 'portfolio':
        return `/portfolio/${slug}`
      default:
        return `/${slug}`
    }
  }

  const viewModes = {
    desktop: { width: '100%', icon: Monitor },
    tablet: { width: '768px', icon: Tablet },
    mobile: { width: '375px', icon: Smartphone }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="תצוגה מקדימה"
      size="xl"
    >
      <div className="space-y-4">
        {/* Preview Controls */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">תצוגה מקדימה</span>
            {slug && (
              <span className="text-sm text-gray-500">
                ({getPreviewUrl()})
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {Object.entries(viewModes).map(([mode, config]) => {
              const IconComponent = config.icon
              return (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as any)}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === mode
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                  title={mode}
                >
                  <IconComponent className="w-4 h-4" />
                </button>
              )
            })}
          </div>
        </div>

        {/* Preview Frame */}
        <div className="bg-gray-100 p-4 rounded-lg overflow-auto">
          <div 
            className="bg-white rounded-lg shadow-sm border transition-all duration-300 mx-auto"
            style={{ 
              width: viewModes[viewMode].width,
              minHeight: '500px'
            }}
          >
            <div className="p-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                {title}
              </h1>
              <div 
                className="prose prose-sm max-w-none"
                style={{ direction: 'rtl' }}
                onClick={(e) => {
                  const target = e.target as HTMLElement
                  if (target.tagName === 'A') {
                    e.preventDefault()
                    e.stopPropagation()
                    const href = target.getAttribute('href')
                    if (href) {
                      window.open(href, '_blank', 'noopener,noreferrer')
                    }
                  }
                }}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <div className="flex gap-3">
            {slug && (
              <Button
                variant="secondary"
                onClick={() => window.open(getPreviewUrl(), '_blank')}
              >
                <Globe className="w-4 h-4 ml-2" />
                פתח באתר
              </Button>
            )}
          </div>
          
          <Button onClick={onClose}>
            סגור תצוגה מקדימה
          </Button>
        </div>
      </div>
    </Modal>
  )
}