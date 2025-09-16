import React, { useState, useEffect } from 'react'
import { FileText, Target, Eye, TrendingUp, AlertTriangle, CheckCircle, Info, BarChart } from 'lucide-react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { Button } from '../ui/Button'
import { ContentQualityAnalyzer, AnalyticsManager, ContentPerformance } from '../../lib/analytics'
import { supabase } from '../../lib/supabase'

interface ContentAnalysis {
  contentId: string
  title: string
  type: 'page' | 'blog' | 'portfolio' | 'research'
  overallScore: number
  seoScore: number
  readabilityScore: number
  engagementScore: number
  recommendations: string[]
  issues: Array<{ type: 'critical' | 'warning' | 'info', message: string }>
  keywords: Array<{
    keyword: string
    frequency: number
    density: number
    inTitle: boolean
    recommendation: 'good' | 'low' | 'high'
  }>
}

export const ContentAnalyzer: React.FC = () => {
  const [contentAnalysis, setContentAnalysis] = useState<ContentAnalysis[]>([])
  const [contentPerformance, setContentPerformance] = useState<ContentPerformance[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<'all' | 'page' | 'blog' | 'portfolio' | 'research'>('all')
  const [sortBy, setSortBy] = useState<'score' | 'performance' | 'updated'>('score')

  useEffect(() => {
    analyzeAllContent()
  }, [])

  const analyzeAllContent = async () => {
    try {
      setLoading(true)
      const analysis: ContentAnalysis[] = []
      
      // Analyze pages
      const { data: pages } = await supabase
        .from('pages')
        .select('id, title, content, meta_description, updated_at')
        .eq('status', 'published')

      if (pages) {
        pages.forEach(page => {
          const contentAnalysis = ContentQualityAnalyzer.analyzeContent({
            title: page.title,
            content: page.content,
            meta_description: page.meta_description || ''
          })
          
          const keywords = AnalyticsManager.analyzeKeywords(page.content, page.title)
          
          analysis.push({
            contentId: page.id,
            title: page.title,
            type: 'page',
            ...contentAnalysis,
            keywords
          })
        })
      }

      // Analyze blog posts
      const { data: blogPosts } = await supabase
        .from('blog_posts')
        .select('id, title, content, excerpt, meta_description, updated_at')
        .eq('status', 'published')

      if (blogPosts) {
        blogPosts.forEach(post => {
          const contentAnalysis = ContentQualityAnalyzer.analyzeContent({
            title: post.title,
            content: post.content,
            excerpt: post.excerpt,
            meta_description: post.meta_description || ''
          })
          
          const keywords = AnalyticsManager.analyzeKeywords(post.content, post.title)
          
          analysis.push({
            contentId: post.id,
            title: post.title,
            type: 'blog',
            ...contentAnalysis,
            keywords
          })
        })
      }

      // Get performance data
      const performance = await AnalyticsManager.getContentPerformance()
      
      setContentAnalysis(analysis)
      setContentPerformance(performance)
    } catch (error) {
      console.error('Error analyzing content:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredContent = contentAnalysis.filter(content => 
    selectedType === 'all' || content.type === selectedType
  ).sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return b.overallScore - a.overallScore
      case 'performance':
        const perfA = contentPerformance.find(p => p.contentId === a.contentId)
        const perfB = contentPerformance.find(p => p.contentId === b.contentId)
        return (perfB?.views || 0) - (perfA?.views || 0)
      case 'updated':
        return new Date(b.contentId).getTime() - new Date(a.contentId).getTime()
      default:
        return 0
    }
  })

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'info': return <Info className="w-4 h-4 text-blue-500" />
      default: return <CheckCircle className="w-4 h-4 text-green-500" />
    }
  }

  const getKeywordColor = (recommendation: string) => {
    switch (recommendation) {
      case 'good': return 'bg-green-100 text-green-800'
      case 'low': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <span className="mr-3 text-gray-600">מנתח את כל התוכן...</span>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">ניתוח תוכן מתקדם</h2>
            <Button onClick={analyzeAllContent} variant="secondary" size="sm">
              <RefreshCw className="w-4 h-4 ml-2" />
              נתח מחדש
            </Button>
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">כל התוכן</option>
              <option value="page">עמודים</option>
              <option value="blog">בלוג</option>
              <option value="portfolio">פרויקטים</option>
              <option value="research">מחקרים</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="score">לפי ציון איכות</option>
              <option value="performance">לפי ביצועים</option>
              <option value="updated">לפי עדכון אחרון</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Content Analysis Results */}
      <div className="space-y-4">
        {filteredContent.map((content) => {
          const performance = contentPerformance.find(p => p.contentId === content.contentId)
          
          return (
            <Card key={content.contentId} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{content.title}</h3>
                    <Badge variant={
                      content.type === 'blog' ? 'success' :
                      content.type === 'portfolio' ? 'info' :
                      content.type === 'research' ? 'warning' : 'default'
                    }>
                      {content.type === 'blog' ? 'בלוג' :
                       content.type === 'portfolio' ? 'פרויקט' :
                       content.type === 'research' ? 'מחקר' : 'עמוד'}
                    </Badge>
                  </div>
                  
                  {performance && (
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 ml-1" />
                        {performance.views} צפיות
                      </span>
                      <span className="flex items-center">
                        <TrendingUp className="w-4 h-4 ml-1" />
                        {performance.engagementRate}% מעורבות
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 ml-1" />
                        {Math.round(performance.avgTimeOnPage)}s זמן ממוצע
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="text-left">
                  <div className={`text-3xl font-bold p-3 rounded-lg ${getScoreColor(content.overallScore)}`}>
                    {content.overallScore}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">ציון כללי</div>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">{content.seoScore}</div>
                  <div className="text-xs text-blue-700">SEO</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-xl font-bold text-green-600">{content.readabilityScore}</div>
                  <div className="text-xs text-green-700">קריאות</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-xl font-bold text-purple-600">{content.engagementScore}</div>
                  <div className="text-xs text-purple-700">מעורבות</div>
                </div>
              </div>

              {/* Issues and Recommendations */}
              {content.issues.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-3">🚨 בעיות לתיקון:</h4>
                  <div className="space-y-2">
                    {content.issues.slice(0, 3).map((issue, index) => (
                      <div key={index} className="flex items-start p-2 bg-gray-50 rounded-lg">
                        {getIssueIcon(issue.type)}
                        <span className="text-sm text-gray-700 mr-2">{issue.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Keywords */}
              {content.keywords.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-3">🔑 מילות מפתח עיקריות:</h4>
                  <div className="flex flex-wrap gap-2">
                    {content.keywords.slice(0, 6).map((keyword, index) => (
                      <span 
                        key={index}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getKeywordColor(keyword.recommendation)}`}
                        title={`תדירות: ${keyword.frequency}, צפיפות: ${keyword.density}%`}
                      >
                        {keyword.keyword} ({keyword.frequency})
                        {keyword.inTitle && <span className="mr-1">📌</span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Recommendations */}
              {content.recommendations.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">💡 המלצות לשיפור:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {content.recommendations.slice(0, 4).map((rec, index) => (
                      <div key={index} className="flex items-start p-2 bg-blue-50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 ml-2" />
                        <span className="text-sm text-blue-700">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {/* Summary Stats */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 סיכום ניתוח התוכן</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(filteredContent.reduce((sum, c) => sum + c.overallScore, 0) / filteredContent.length) || 0}
            </div>
            <div className="text-sm text-gray-600">ציון ממוצע</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {filteredContent.filter(c => c.overallScore >= 80).length}
            </div>
            <div className="text-sm text-gray-600">תוכן מעולה</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {filteredContent.filter(c => c.issues.some(i => i.type === 'critical')).length}
            </div>
            <div className="text-sm text-gray-600">דורש תיקון</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {contentPerformance.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">סך צפיות</div>
          </div>
        </div>

        {/* Action Items */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">🎯 פעולות מומלצות:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <h5 className="font-medium text-red-700 mb-2">דחוף לתיקון:</h5>
              <ul className="text-sm text-red-600 space-y-1">
                {filteredContent
                  .filter(c => c.issues.some(i => i.type === 'critical'))
                  .slice(0, 3)
                  .map((c, i) => (
                    <li key={i}>• {c.title} - ציון {c.overallScore}</li>
                  ))
                }
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <h5 className="font-medium text-green-700 mb-2">הצלחות:</h5>
              <ul className="text-sm text-green-600 space-y-1">
                {filteredContent
                  .filter(c => c.overallScore >= 85)
                  .slice(0, 3)
                  .map((c, i) => (
                    <li key={i}>• {c.title} - ציון {c.overallScore}</li>
                  ))
                }
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}