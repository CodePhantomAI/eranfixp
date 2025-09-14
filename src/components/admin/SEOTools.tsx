import React, { useState } from 'react'
import { Globe, Search, FileText, Link, Image, Code, CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Modal } from '../ui/Modal'
import { ContentQualityGate } from '../../lib/seo-checklist'
import toast from 'react-hot-toast'

interface SEOToolsProps {
  content?: {
    title: string
    description: string
    content: string
    slug: string
  }
}

export const SEOTools: React.FC<SEOToolsProps> = ({ content }) => {
  const [showPreview, setShowPreview] = useState(false)
  const [qualityCheck, setQualityCheck] = useState<{
    canPublish: boolean
    issues: string[]
  } | null>(null)

  const runQualityCheck = async () => {
    if (!content) return

    try {
      const result = await ContentQualityGate.validateBeforePublish(content)
      setQualityCheck(result)
      
      if (result.canPublish) {
        toast.success('התוכן עובר את כל בדיקות האיכות!')
      } else {
        toast.error(`נמצאו ${result.issues.length} בעיות שיש לתקן`)
      }
    } catch (error) {
      toast.error('שגיאה בבדיקת איכות התוכן')
    }
  }

  const seoScore = content ? calculateSEOScore(content) : 0

  return (
    <div className="space-y-6">
      {/* SEO Score */}
      {content && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ציון SEO</h3>
              <div className={`text-3xl font-bold ${
                seoScore >= 80 ? 'text-green-600' : 
                seoScore >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {seoScore}/100
              </div>
            </div>
            <div className="text-center">
              <Button onClick={runQualityCheck} size="sm">
                <CheckCircle className="w-4 h-4 ml-2" />
                בדוק איכות
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Quality Check Results */}
      {qualityCheck && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">תוצאות בדיקת איכות</h3>
          
          <div className={`p-4 rounded-lg mb-4 ${
            qualityCheck.canPublish ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center">
              {qualityCheck.canPublish ? (
                <CheckCircle className="w-5 h-5 text-green-500 ml-3" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-500 ml-3" />
              )}
              <span className={`font-medium ${
                qualityCheck.canPublish ? 'text-green-800' : 'text-red-800'
              }`}>
                {qualityCheck.canPublish ? 'התוכן מוכן לפרסום!' : 'יש בעיות שיש לתקן'}
              </span>
            </div>
          </div>

          {qualityCheck.issues.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">בעיות לתיקון:</h4>
              {qualityCheck.issues.map((issue, index) => (
                <div key={index} className="flex items-start p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 ml-2" />
                  <span className="text-red-700 text-sm">{issue}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* SEO Tools */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">כלי SEO</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowPreview(true)}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center group"
          >
            <Search className="w-6 h-6 text-gray-400 group-hover:text-blue-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
              תצוגה מקדימה בגוגל
            </div>
          </button>

          <a
            href="https://search.google.com/search-console"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center group"
          >
            <Globe className="w-6 h-6 text-gray-400 group-hover:text-blue-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
              Search Console
            </div>
          </a>

          <a
            href="https://pagespeed.web.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center group"
          >
            <FileText className="w-6 h-6 text-gray-400 group-hover:text-blue-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
              PageSpeed Test
            </div>
          </a>
        </div>
      </Card>

      {/* Google Preview Modal */}
      {content && (
        <Modal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          title="תצוגה מקדימה בגוגל"
          size="lg"
        >
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg border">
              <div className="text-blue-600 text-xl hover:underline cursor-pointer mb-1">
                {content.title}
              </div>
              <div className="text-green-700 text-sm mb-2">
                eran-fixer.com/{content.slug}
              </div>
              <div className="text-gray-600 text-sm leading-relaxed">
                {content.description}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">טיפים לשיפור:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• כותרת: 50-60 תווים (כרגע: {content.title.length})</li>
                <li>• תיאור: 150-160 תווים (כרגע: {content.description.length})</li>
                <li>• השתמשו במילות מפתח רלוונטיות</li>
                <li>• הוסיפו קריאה לפעולה</li>
              </ul>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// Helper function to calculate SEO score
function calculateSEOScore(content: {
  title: string
  description: string
  content: string
  slug: string
}): number {
  let score = 0

  // Title length (50-60 chars is optimal)
  if (content.title.length >= 30 && content.title.length <= 60) {
    score += 20
  } else if (content.title.length >= 20) {
    score += 10
  }

  // Description length (150-160 chars is optimal)
  if (content.description.length >= 120 && content.description.length <= 160) {
    score += 20
  } else if (content.description.length >= 80) {
    score += 10
  }

  // Content length
  const wordCount = content.content.split(/\s+/).length
  if (wordCount >= 300) {
    score += 20
  } else if (wordCount >= 150) {
    score += 10
  }

  // Slug quality
  if (/^[a-z0-9-]+$/.test(content.slug) && content.slug.length <= 50) {
    score += 20
  } else if (content.slug.length <= 80) {
    score += 10
  }

  // Content structure (check for headings)
  const hasHeadings = /<h[1-6]/.test(content.content)
  if (hasHeadings) {
    score += 20
  }

  return Math.min(100, score)
}