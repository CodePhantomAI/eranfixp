import React, { useState, useEffect } from 'react'
import { Search, CheckCircle, AlertTriangle, XCircle, RefreshCw, TrendingUp, Globe, Zap } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { SEOAudit, SEOChecklistItem, PerformanceMonitor, SitemapGenerator } from '../../lib/seo-checklist'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export const SEODashboard: React.FC = () => {
  const [auditResults, setAuditResults] = useState<{
    score: number
    checklist: SEOChecklistItem[]
    recommendations: string[]
  } | null>(null)
  const [isRunningAudit, setIsRunningAudit] = useState(false)
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null)
  const [lastAuditDate, setLastAuditDate] = useState<string>('')

  useEffect(() => {
    // Load last audit results from localStorage
    const savedAudit = localStorage.getItem('seo-audit-results')
    if (savedAudit) {
      try {
        const parsed = JSON.parse(savedAudit)
        setAuditResults(parsed.results)
        setLastAuditDate(parsed.date)
      } catch (error) {
        console.error('Error loading saved audit:', error)
      }
    }

    // Load performance metrics
    loadPerformanceMetrics()
  }, [])

  const loadPerformanceMetrics = async () => {
    try {
      const metrics = await PerformanceMonitor.measurePageLoad()
      const webVitals = await PerformanceMonitor.checkCoreWebVitals()
      setPerformanceMetrics({ ...metrics, ...webVitals })
    } catch (error) {
      console.error('Error loading performance metrics:', error)
    }
  }

  const runSEOAudit = async () => {
    setIsRunningAudit(true)
    try {
      const results = await SEOAudit.runFullAudit()
      setAuditResults(results)
      
      const auditData = {
        results,
        date: new Date().toISOString()
      }
      localStorage.setItem('seo-audit-results', JSON.stringify(auditData))
      setLastAuditDate(auditData.date)
      
      toast.success(`ביקורת SEO הושלמה! ציון: ${results.score}/100`)
    } catch (error) {
      toast.error('שגיאה בביקורת SEO')
      console.error('SEO audit error:', error)
    } finally {
      setIsRunningAudit(false)
    }
  }

  const generateSitemap = async () => {
    try {
      // Load all published content
      const [pagesResult, postsResult, portfolioResult] = await Promise.all([
        supabase.from('pages').select('*').eq('status', 'published'),
        supabase.from('blog_posts').select('*').eq('status', 'published'),
        supabase.from('portfolio_items').select('*').eq('status', 'published')
      ])

      const sitemap = await SitemapGenerator.generateSitemap(
        pagesResult.data || [],
        postsResult.data || [],
        portfolioResult.data || []
      )

      // Download sitemap
      const blob = new Blob([sitemap], { type: 'application/xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'sitemap.xml'
      a.click()
      URL.revokeObjectURL(url)

      toast.success('Sitemap נוצר והורד בהצלחה!')
    } catch (error) {
      toast.error('שגיאה ביצירת Sitemap')
      console.error('Sitemap generation error:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'failed': return <XCircle className="w-5 h-5 text-red-500" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      default: return <div className="w-5 h-5 bg-gray-300 rounded-full" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'accessibility': return <Globe className="w-4 h-4" />
      case 'meta': return <Search className="w-4 h-4" />
      case 'performance': return <Zap className="w-4 h-4" />
      case 'linking': return <TrendingUp className="w-4 h-4" />
      default: return <CheckCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SEO Dashboard</h1>
          <p className="text-gray-600 mt-1">ניטור ואופטימיזציה למנועי חיפוש</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={generateSitemap}>
            <Globe className="w-4 h-4 ml-2" />
            יצירת Sitemap
          </Button>
          <Button onClick={runSEOAudit} disabled={isRunningAudit}>
            {isRunningAudit ? (
              <LoadingSpinner size="sm" className="ml-2" />
            ) : (
              <RefreshCw className="w-4 h-4 ml-2" />
            )}
            {isRunningAudit ? 'רץ ביקורת...' : 'הרץ ביקורת SEO'}
          </Button>
        </div>
      </div>

      {/* SEO Score */}
      {auditResults && (
        <Card variant="elevated" className="bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">ציון SEO כללי</h2>
              <div className={`text-4xl font-bold ${getScoreColor(auditResults.score)}`}>
                {auditResults.score}/100
              </div>
              {lastAuditDate && (
                <p className="text-sm text-gray-500 mt-2">
                  ביקורת אחרונה: {new Date(lastAuditDate).toLocaleDateString('he-IL')}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className={`w-24 h-24 rounded-full border-8 flex items-center justify-center ${
                auditResults.score >= 90 ? 'border-green-500 bg-green-50' :
                auditResults.score >= 70 ? 'border-yellow-500 bg-yellow-50' :
                'border-red-500 bg-red-50'
              }`}>
                <span className={`text-2xl font-bold ${getScoreColor(auditResults.score)}`}>
                  {auditResults.score}
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Performance Metrics */}
      {performanceMetrics && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">מדדי ביצועים</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {performanceMetrics.lcp?.toFixed(1)}s
              </div>
              <div className="text-sm text-gray-600">LCP</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {performanceMetrics.cls?.toFixed(3)}
              </div>
              <div className="text-sm text-gray-600">CLS</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {performanceMetrics.inp?.toFixed(0)}ms
              </div>
              <div className="text-sm text-gray-600">INP</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {performanceMetrics.memoryUsage}MB
              </div>
              <div className="text-sm text-gray-600">Memory</div>
            </div>
          </div>
        </Card>
      )}

      {/* Recommendations */}
      {auditResults?.recommendations && auditResults.recommendations.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">המלצות לשיפור</h3>
          <div className="space-y-3">
            {auditResults.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 ml-3" />
                <p className="text-gray-700">{rec}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Detailed Checklist */}
      {auditResults && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">צ'קליסט מפורט</h3>
          <div className="space-y-4">
            {['critical', 'high', 'medium', 'low'].map(priority => {
              const items = auditResults.checklist.filter(item => item.priority === priority)
              if (items.length === 0) return null

              return (
                <div key={priority}>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Badge 
                      variant={priority === 'critical' ? 'error' : priority === 'high' ? 'warning' : 'default'}
                      size="sm"
                      className="ml-2"
                    >
                      {priority === 'critical' ? 'קריטי' : 
                       priority === 'high' ? 'חשוב' :
                       priority === 'medium' ? 'בינוני' : 'נמוך'}
                    </Badge>
                    עדיפות {priority === 'critical' ? 'קריטית' : 
                             priority === 'high' ? 'גבוהה' :
                             priority === 'medium' ? 'בינונית' : 'נמוכה'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                          {getStatusIcon(item.status)}
                          <div className="mr-3">
                            <div className="font-medium text-gray-900">{item.title}</div>
                            <div className="text-sm text-gray-600">{item.description}</div>
                            {item.details && (
                              <div className="text-xs text-gray-500 mt-1">{item.details}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center">
                          {getCategoryIcon(item.category)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">פעולות מהירות</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => window.open('https://search.google.com/search-console', '_blank')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group text-center"
          >
            <Search className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600 group-hover:text-blue-600">Search Console</p>
          </button>
          
          <button 
            onClick={() => window.open('https://pagespeed.web.dev/', '_blank')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group text-center"
          >
            <Zap className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600 group-hover:text-blue-600">PageSpeed Insights</p>
          </button>
          
          <button 
            onClick={() => window.open('https://www.google.com/webmasters/tools/mobile-friendly/', '_blank')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group text-center"
          >
            <Globe className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600 group-hover:text-blue-600">Mobile-Friendly Test</p>
          </button>
        </div>
      </Card>

      {/* SEO Tips */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 טיפים לשיפור SEO</h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 ml-3" />
            <div>
              <strong>תוכן איכותי:</strong> כתבו תוכן ייחודי ומועיל שעונה על שאלות של הקהל שלכם
            </div>
          </div>
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 ml-3" />
            <div>
              <strong>מילות מפתח:</strong> השתמשו במילות מפתח רלוונטיות באופן טבעי בכותרות ובתוכן
            </div>
          </div>
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 ml-3" />
            <div>
              <strong>קישורים פנימיים:</strong> קשרו בין דפים באתר עם anchor text רלוונטי
            </div>
          </div>
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 ml-3" />
            <div>
              <strong>עדכונים תקופתיים:</strong> עדכנו תוכן קיים ופרסמו תוכן חדש באופן קבוע
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}