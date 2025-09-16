import React, { useState } from 'react'
import { Globe, Search, FileText, Link, Image, Code, CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Modal } from '../ui/Modal'
import { ContentQualityGate } from '../../lib/seo-checklist'
import { ContentQualityAnalyzer, AnalyticsManager } from '../../lib/analytics'
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
    overallScore: number
    seoScore: number
    readabilityScore: number
    engagementScore: number
    recommendations: string[]
    canPublish: boolean
    issues: string[]
  } | null>(null)

  const runQualityCheck = async () => {
    if (!content) return

    try {
      // Advanced content analysis
      const analysis = ContentQualityAnalyzer.analyzeContent({
        title: content.title,
        content: content.content,
        meta_description: content.description
      })
      
      // Legacy quality check
      const legacyCheck = await ContentQualityGate.validateBeforePublish(content)
      
      const result = {
        ...analysis,
        canPublish: legacyCheck.canPublish && analysis.overallScore >= 60,
        issues: legacyCheck.issues
      }
      
      setQualityCheck(result)
      
      if (result.canPublish && result.overallScore >= 80) {
        toast.success(`תוכן מעולה! ציון: ${result.overallScore}/100`)
      } else if (result.canPublish) {
        toast.success(`התוכן מוכן לפרסום - ציון: ${result.overallScore}/100`)
      } else {
        toast.error(`נמצאו בעיות שיש לתקן - ציון: ${result.overallScore}/100`)
      }
    } catch (error) {
      toast.error('שגיאה בבדיקת איכות התוכן')
    }
  }

  const seoScore = content ? qualityCheck?.overallScore || calculateSEOScore(content) : 0

  return (
    <div className="space-y-6">
      {/* SEO Score */}
      {content && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ציון איכות תוכן</h3>
              <div className={`text-3xl font-bold ${
                seoScore >= 85 ? 'text-green-600' : 
                seoScore >= 70 ? 'text-blue-600' :
                seoScore >= 55 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {seoScore}/100
              </div>
              {qualityCheck && (
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="text-blue-600">SEO: {qualityCheck.seoScore}</span>
                  <span className="text-green-600">קריאות: {qualityCheck.readabilityScore}</span>
                  <span className="text-purple-600">מעורבות: {qualityCheck.engagementScore}</span>
                </div>
              )}
            </div>
            <div className="text-center">
              <Button onClick={runQualityCheck} size="sm">
                <CheckCircle className="w-4 h-4 ml-2" />
                בדוק איכות
              </Button>
              {content && (
                <div className="mt-3 text-xs text-gray-500">
                  מילים: {content.content.replace(/<[^>]*>/g, '').split(/\s+/).length}
                </div>
              )}
            </div>
          </div>
          
          {/* Quick Analysis */}
          {content && qualityCheck && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">ניתוח מהיר:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-lg font-bold text-gray-900">
                    {content.title.length}
                  </div>
                  <div className="text-xs text-gray-500">תווים בכותרת</div>
                  <div className={`text-xs mt-1 ${
                    content.title.length >= 30 && content.title.length <= 60 ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {content.title.length >= 30 && content.title.length <= 60 ? '✅ מושלם' : '⚠️ צריך שיפור'}
                  </div>
                </div>
                
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-lg font-bold text-gray-900">
                    {content.description.length}
                  </div>
                  <div className="text-xs text-gray-500">תווים בתיאור</div>
                  <div className={`text-xs mt-1 ${
                    content.description.length >= 120 && content.description.length <= 160 ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {content.description.length >= 120 && content.description.length <= 160 ? '✅ מושלם' : '⚠️ צריך שיפור'}
                  </div>
                </div>
                
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-lg font-bold text-gray-900">
                    {content.content.replace(/<[^>]*>/g, '').split(/\s+/).length}
                  </div>
                  <div className="text-xs text-gray-500">מילים בתוכן</div>
                  <div className={`text-xs mt-1 ${
                    content.content.replace(/<[^>]*>/g, '').split(/\s+/).length >= 300 ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {content.content.replace(/<[^>]*>/g, '').split(/\s+/).length >= 300 ? '✅ מספיק' : '⚠️ צריך עוד'}
                  </div>
                </div>
                
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-lg font-bold text-gray-900">
                    {(content.content.match(/<h[1-6]/g) || []).length}
                  </div>
                  <div className="text-xs text-gray-500">כותרות</div>
                  <div className={`text-xs mt-1 ${
                    (content.content.match(/<h[1-6]/g) || []).length >= 2 ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {(content.content.match(/<h[1-6]/g) || []).length >= 2 ? '✅ מובנה' : '⚠️ הוסף כותרות'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Quality Check Results */}
      {qualityCheck && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ניתוח איכות מתקדם</h3>
          
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
                {qualityCheck.canPublish ? 
                  `התוכן מוכן לפרסום! ציון כללי: ${qualityCheck.overallScore}/100` : 
                  `צריך שיפורים - ציון: ${qualityCheck.overallScore}/100`
                }
              </span>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{qualityCheck.seoScore}</div>
              <div className="text-sm text-blue-700">SEO</div>
              <div className="text-xs text-gray-500 mt-1">
                {qualityCheck.seoScore >= 80 ? 'מעולה' : 
                 qualityCheck.seoScore >= 60 ? 'טוב' : 'צריך שיפור'}
              </div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{qualityCheck.readabilityScore}</div>
              <div className="text-sm text-green-700">קריאות</div>
              <div className="text-xs text-gray-500 mt-1">
                {qualityCheck.readabilityScore >= 80 ? 'קריא מאוד' : 
                 qualityCheck.readabilityScore >= 60 ? 'קריא' : 'קשה לקריאה'}
              </div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{qualityCheck.engagementScore}</div>
              <div className="text-sm text-purple-700">מעורבות</div>
              <div className="text-xs text-gray-500 mt-1">
                {qualityCheck.engagementScore >= 80 ? 'מעורב מאוד' : 
                 qualityCheck.engagementScore >= 60 ? 'מעורב' : 'פחות מעורב'}
              </div>
            </div>
          </div>

          {/* Top Recommendations */}
          {qualityCheck.recommendations.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">💡 המלצות מרכזיות לשיפור:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {qualityCheck.recommendations.slice(0, 6).map((rec, index) => (
                  <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 ml-2" />
                    <span className="text-blue-700 text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Keywords Analysis */}
          {content && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">🔑 ניתוח מילות מפתח:</h4>
              <div className="flex flex-wrap gap-2">
                {AnalyticsManager.analyzeKeywords(content.content, content.title)
                  .slice(0, 8)
                  .map((keyword, index) => (
                    <span 
                      key={index}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        keyword.recommendation === 'good' ? 'bg-green-100 text-green-800' :
                        keyword.recommendation === 'low' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}
                      title={`תדירות: ${keyword.frequency}, צפיפות: ${keyword.density}%`}
                    >
                      {keyword.keyword} ({keyword.frequency})
                      {keyword.inTitle && <span className="mr-1">📌</span>}
                    </span>
                  ))
                }
              </div>
              <div className="mt-2 text-xs text-gray-500">
                📌 = מופיע בכותרת | מספר = תדירות בטקסט
              </div>
            </div>
          )}

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => setShowPreview(true)}
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center group"
          >
            <Search className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mx-auto mb-3" />
            <div className="text-sm font-medium text-gray-700 group-hover:text-blue-600 mb-1">
              תצוגה מקדימה בגוגל
            </div>
            <div className="text-xs text-gray-500">
              ראה איך העמוד ייראה בחיפוש
            </div>
          </button>

          <a
            href="https://search.google.com/search-console"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center group"
          >
            <Globe className="w-8 h-8 text-gray-400 group-hover:text-green-600 mx-auto mb-3" />
            <div className="text-sm font-medium text-gray-700 group-hover:text-green-600 mb-1">
              Search Console
            </div>
            <div className="text-xs text-gray-500">
              ניטור ביצועי החיפוש
            </div>
          </a>

          <a
            href="https://pagespeed.web.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center group"
          >
            <FileText className="w-8 h-8 text-gray-400 group-hover:text-purple-600 mx-auto mb-3" />
            <div className="text-sm font-medium text-gray-700 group-hover:text-purple-600 mb-1">
              PageSpeed Test
            </div>
            <div className="text-xs text-gray-500">
              בדוק מהירות האתר
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