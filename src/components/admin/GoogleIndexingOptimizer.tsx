import React, { useState, useEffect } from 'react'
import { Search, CheckCircle, AlertTriangle, XCircle, RefreshCw, Globe, Zap, Link, Clock, Send, Eye, TrendingUp } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { Modal } from '../ui/Modal'
import { supabase } from '../../lib/supabase'
import { AutoSEO } from '../../lib/seo-automation'
import toast from 'react-hot-toast'

interface IndexingCheck {
  url: string
  status: 'indexed' | 'not-indexed' | 'pending' | 'error'
  lastCrawled?: string
  issues: string[]
  recommendations: string[]
  seoScore: number
}

interface SiteStructureIssue {
  type: 'critical' | 'warning' | 'info'
  category: 'sitemap' | 'internal-links' | 'meta-tags' | 'performance' | 'crawlability'
  title: string
  description: string
  fix: string
  impact: 'high' | 'medium' | 'low'
}

export const GoogleIndexingOptimizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'structure' | 'indexing' | 'optimization'>('structure')
  const [siteStructure, setSiteStructure] = useState<any>(null)
  const [indexingChecks, setIndexingChecks] = useState<IndexingCheck[]>([])
  const [structureIssues, setStructureIssues] = useState<SiteStructureIssue[]>([])
  const [loading, setLoading] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [urlToSubmit, setUrlToSubmit] = useState('')

  useEffect(() => {
    analyzeSiteStructure()
  }, [])

  const analyzeSiteStructure = async () => {
    setLoading(true)
    try {
      // בדיקת מבנה האתר
      const structure = await checkSiteStructure()
      setSiteStructure(structure)
      
      // זיהוי בעיות במבנה
      const issues = await identifyStructureIssues(structure)
      setStructureIssues(issues)
      
      toast.success('ניתוח מבנה האתר הושלם')
    } catch (error) {
      toast.error('שגיאה בניתוח מבנה האתר')
      console.error('Error analyzing site structure:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkSiteStructure = async () => {
    // טעינת כל התוכן מהמסד
    const [pagesResult, postsResult, portfolioResult, researchResult] = await Promise.all([
      supabase.from('pages').select('id, title, slug, status, updated_at, meta_title, meta_description, content').eq('status', 'published'),
      supabase.from('blog_posts').select('id, title, slug, status, updated_at, meta_title, meta_description, content, excerpt').eq('status', 'published'),
      supabase.from('portfolio_items').select('id, title, slug, status, updated_at, description, content').eq('status', 'published'),
      supabase.from('research_papers').select('id, title, slug, status, updated_at, abstract, content').eq('status', 'published')
    ])

    const allContent = [
      ...(pagesResult.data || []).map(item => ({ ...item, type: 'page', url: `/${item.slug}` })),
      ...(postsResult.data || []).map(item => ({ ...item, type: 'blog', url: `/blog/${item.slug}` })),
      ...(portfolioResult.data || []).map(item => ({ ...item, type: 'portfolio', url: `/portfolio/${item.slug}` })),
      ...(researchResult.data || []).map(item => ({ ...item, type: 'research', url: `/research/${item.slug}` }))
    ]

    return {
      totalPages: allContent.length,
      pagesByType: {
        pages: pagesResult.data?.length || 0,
        blog: postsResult.data?.length || 0,
        portfolio: portfolioResult.data?.length || 0,
        research: researchResult.data?.length || 0
      },
      content: allContent,
      lastUpdate: new Date().toISOString()
    }
  }

  const identifyStructureIssues = async (structure: any): Promise<SiteStructureIssue[]> => {
    const issues: SiteStructureIssue[] = []

    // בדיקת sitemap
    try {
      const sitemapResponse = await fetch('/sitemap.xml')
      if (!sitemapResponse.ok) {
        issues.push({
          type: 'critical',
          category: 'sitemap',
          title: 'Sitemap לא נמצא',
          description: 'קובץ sitemap.xml לא נגיש או לא קיים',
          fix: 'צור sitemap.xml ועדכן אותו אוטומטית',
          impact: 'high'
        })
      } else {
        const sitemapText = await sitemapResponse.text()
        const urlCount = (sitemapText.match(/<loc>/g) || []).length
        if (urlCount < structure.totalPages) {
          issues.push({
            type: 'warning',
            category: 'sitemap',
            title: 'Sitemap לא מעודכן',
            description: `Sitemap מכיל ${urlCount} URLs אבל יש ${structure.totalPages} דפים`,
            fix: 'עדכן את ה-sitemap לכלול את כל הדפים החדשים',
            impact: 'high'
          })
        }
      }
    } catch (error) {
      issues.push({
        type: 'critical',
        category: 'sitemap',
        title: 'שגיאה בגישה ל-Sitemap',
        description: 'לא ניתן לגשת לקובץ sitemap.xml',
        fix: 'בדוק שהקובץ קיים ונגיש',
        impact: 'high'
      })
    }

    // בדיקת robots.txt
    try {
      const robotsResponse = await fetch('/robots.txt')
      if (!robotsResponse.ok) {
        issues.push({
          type: 'warning',
          category: 'crawlability',
          title: 'Robots.txt לא נמצא',
          description: 'קובץ robots.txt חסר',
          fix: 'צור קובץ robots.txt עם הפניה ל-sitemap',
          impact: 'medium'
        })
      }
    } catch (error) {
      issues.push({
        type: 'warning',
        category: 'crawlability',
        title: 'בעיה בגישה ל-Robots.txt',
        description: 'לא ניתן לגשת לקובץ robots.txt',
        fix: 'בדוק שהקובץ קיים ונגיש',
        impact: 'medium'
      })
    }

    // בדיקת meta tags
    structure.content.forEach((item: any) => {
      if (!item.meta_title || item.meta_title.length < 30) {
        issues.push({
          type: 'warning',
          category: 'meta-tags',
          title: `Meta title חסר או קצר - ${item.title}`,
          description: `הדף "${item.title}" חסר meta title או שהוא קצר מדי`,
          fix: 'הוסף meta title באורך 50-60 תווים',
          impact: 'high'
        })
      }

      if (!item.meta_description || item.meta_description.length < 120) {
        issues.push({
          type: 'warning',
          category: 'meta-tags',
          title: `Meta description חסר - ${item.title}`,
          description: `הדף "${item.title}" חסר meta description`,
          fix: 'הוסף meta description באורך 150-160 תווים',
          impact: 'high'
        })
      }

      // בדיקת אורך תוכן
      const contentText = (item.content || item.excerpt || item.description || '').replace(/<[^>]*>/g, '')
      const wordCount = contentText.split(/\s+/).length
      if (wordCount < 300) {
        issues.push({
          type: 'info',
          category: 'meta-tags',
          title: `תוכן קצר - ${item.title}`,
          description: `הדף מכיל רק ${wordCount} מילים`,
          fix: 'הוסף תוכן איכותי עד לפחות 300 מילים',
          impact: 'medium'
        })
      }
    })

    return issues
  }

  const checkPageIndexing = async (url: string): Promise<IndexingCheck> => {
    try {
      // בדיקה בסיסית של הדף
      const fullUrl = url.startsWith('http') ? url : `https://eran-fixer.com${url}`
      
      // ניסיון לגשת לדף
      const response = await fetch(fullUrl, { method: 'HEAD', mode: 'no-cors' })
      
      // בדיקת SEO בסיסית
      const seoScore = calculateBasicSEO(url)
      
      return {
        url: fullUrl,
        status: 'pending', // לא יכולים לדעת בוודאות ללא Google API
        issues: [],
        recommendations: [
          'שלח ל-Google Search Console',
          'בדוק internal links',
          'וודא meta tags מלאים'
        ],
        seoScore
      }
    } catch (error) {
      return {
        url,
        status: 'error',
        issues: ['לא ניתן לגשת לדף'],
        recommendations: ['בדוק שהדף נגיש'],
        seoScore: 0
      }
    }
  }

  const calculateBasicSEO = (url: string): number => {
    // חישוב ציון SEO בסיסי
    let score = 0
    
    // בדיקת URL structure
    if (url.length < 100 && !url.includes('?') && !url.includes('#')) {
      score += 20
    }
    
    // בדיקת HTTPS
    if (url.startsWith('https://')) {
      score += 20
    }
    
    // בדיקת slug quality
    const slug = url.split('/').pop() || ''
    if (/^[a-z0-9-]+$/.test(slug) && slug.length > 3) {
      score += 20
    }
    
    return Math.min(score + 40, 100) // 40 נקודות בונוס בסיסיות
  }

  const submitToGoogle = async (url: string) => {
    try {
      const fullUrl = url.startsWith('http') ? url : `https://eran-fixer.com${url}`
      
      // שימוש ב-Edge Function לשליחה לגוגל
      const success = await AutoSEO.notifyGoogleOfNewPage(fullUrl)
      
      if (success) {
        toast.success(`הדף נשלח לגוגל בהצלחה: ${fullUrl}`)
        
        // עדכון סטטוס בטבלה
        setIndexingChecks(prev => prev.map(check => 
          check.url === fullUrl 
            ? { ...check, status: 'pending' as const, lastCrawled: new Date().toISOString() }
            : check
        ))
      } else {
        toast.error('שגיאה בשליחה לגוגל')
      }
    } catch (error) {
      toast.error('שגיאה בשליחה לגוגל')
      console.error('Error submitting to Google:', error)
    }
  }

  const submitAllNewPages = async () => {
    if (!siteStructure) return
    
    setLoading(true)
    try {
      let successCount = 0
      
      for (const item of siteStructure.content) {
        const success = await AutoSEO.notifyGoogleOfNewPage(`https://eran-fixer.com${item.url}`)
        if (success) successCount++
        
        // המתנה קצרה בין בקשות
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      
      toast.success(`${successCount} דפים נשלחו לגוגל בהצלחה`)
    } catch (error) {
      toast.error('שגיאה בשליחה המונית לגוגל')
    } finally {
      setLoading(false)
    }
  }

  const generateOptimizedSitemap = async () => {
    try {
      setLoading(true)
      
      // יצירת sitemap מותאם לאינדוקס מהיר
      const sitemap = await AutoSEO.generateCompleteSitemap()
      
      // הורדת הקובץ
      const blob = new Blob([sitemap], { type: 'application/xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'optimized-sitemap.xml'
      a.click()
      URL.revokeObjectURL(url)
      
      toast.success('Sitemap מותאם נוצר והורד')
    } catch (error) {
      toast.error('שגיאה ביצירת Sitemap')
    } finally {
      setLoading(false)
    }
  }

  const checkInternalLinking = () => {
    if (!siteStructure) return { score: 0, issues: [] }
    
    let score = 0
    const issues: string[] = []
    
    // בדיקה שכל דף נגיש דרך קישורים פנימיים
    const hasNavigation = document.querySelector('nav') !== null
    const hasFooter = document.querySelector('footer') !== null
    
    if (hasNavigation) score += 30
    else issues.push('חסר תפריט ניווט ראשי')
    
    if (hasFooter) score += 20
    else issues.push('חסר פוטר עם קישורים')
    
    // בדיקת breadcrumbs
    const hasBreadcrumbs = document.querySelector('[aria-label="breadcrumb"]') !== null
    if (hasBreadcrumbs) score += 25
    else issues.push('חסרים breadcrumbs לניווט היררכי')
    
    // בדיקת קישורים פנימיים
    const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="./"]')
    if (internalLinks.length >= 10) score += 25
    else issues.push(`מעט קישורים פנימיים (${internalLinks.length})`)
    
    return { score, issues }
  }

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'critical': return <XCircle className="w-5 h-5 text-red-500" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'info': return <CheckCircle className="w-5 h-5 text-blue-500" />
      default: return <CheckCircle className="w-5 h-5 text-green-500" />
    }
  }

  const getIssueColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-50 border-red-200'
      case 'warning': return 'bg-yellow-50 border-yellow-200'
      case 'info': return 'bg-blue-50 border-blue-200'
      default: return 'bg-green-50 border-green-200'
    }
  }

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high': return <Badge variant="error" size="sm">השפעה גבוהה</Badge>
      case 'medium': return <Badge variant="warning" size="sm">השפעה בינונית</Badge>
      case 'low': return <Badge variant="info" size="sm">השפעה נמוכה</Badge>
      default: return <Badge variant="default" size="sm">לא ידוע</Badge>
    }
  }

  const linkingAnalysis = checkInternalLinking()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🚀 אופטימיזציה לאינדוקס מהיר בגוגל</h1>
          <p className="text-gray-600 mt-1">כלים מתקדמים להאצת זיהוי הדפים החדשים שלכם בגוגל</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={generateOptimizedSitemap} variant="secondary">
            <Globe className="w-4 h-4 ml-2" />
            צור Sitemap מותאם
          </Button>
          <Button onClick={submitAllNewPages} disabled={loading}>
            {loading ? (
              <LoadingSpinner size="sm" className="ml-2" />
            ) : (
              <Send className="w-4 h-4 ml-2" />
            )}
            שלח הכל לגוגל
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('structure')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'structure'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Globe className="w-4 h-4 inline ml-2" />
            מבנה האתר
          </button>
          <button
            onClick={() => setActiveTab('indexing')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'indexing'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Search className="w-4 h-4 inline ml-2" />
            סטטוס אינדוקס
          </button>
          <button
            onClick={() => setActiveTab('optimization')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'optimization'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Zap className="w-4 h-4 inline ml-2" />
            אופטימיזציה
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'structure' && (
            <div className="space-y-6">
              {/* Site Overview */}
              {siteStructure && (
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 סקירת מבנה האתר</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{siteStructure.pagesByType.pages}</div>
                      <div className="text-sm text-gray-600">עמודים</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{siteStructure.pagesByType.blog}</div>
                      <div className="text-sm text-gray-600">פוסטי בלוג</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{siteStructure.pagesByType.portfolio}</div>
                      <div className="text-sm text-gray-600">פרויקטים</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{siteStructure.pagesByType.research}</div>
                      <div className="text-sm text-gray-600">מחקרים</div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">ניתוח קישורים פנימיים:</h4>
                    <div className="flex items-center justify-between">
                      <span>ציון קישורים פנימיים:</span>
                      <span className={`font-bold ${
                        linkingAnalysis.score >= 80 ? 'text-green-600' : 
                        linkingAnalysis.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {linkingAnalysis.score}/100
                      </span>
                    </div>
                    {linkingAnalysis.issues.length > 0 && (
                      <div className="mt-3">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">בעיות לתיקון:</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {linkingAnalysis.issues.map((issue, index) => (
                            <li key={index}>• {issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Structure Issues */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 בעיות במבנה האתר</h3>
                {structureIssues.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-green-800 mb-2">מבנה האתר מעולה!</h4>
                    <p className="text-green-600">לא נמצאו בעיות קריטיות במבנה האתר</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {['critical', 'warning', 'info'].map(type => {
                      const typeIssues = structureIssues.filter(issue => issue.type === type)
                      if (typeIssues.length === 0) return null

                      return (
                        <div key={type}>
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                            {getIssueIcon(type)}
                            <span className="mr-2">
                              {type === 'critical' ? 'בעיות קריטיות' : 
                               type === 'warning' ? 'אזהרות' : 'מידע'}
                            </span>
                            <Badge variant={type === 'critical' ? 'error' : type === 'warning' ? 'warning' : 'info'}>
                              {typeIssues.length}
                            </Badge>
                          </h4>
                          <div className="space-y-3">
                            {typeIssues.map((issue, index) => (
                              <div key={index} className={`border rounded-lg p-4 ${getIssueColor(issue.type)}`}>
                                <div className="flex items-start justify-between mb-2">
                                  <h5 className="font-semibold text-gray-900">{issue.title}</h5>
                                  {getImpactBadge(issue.impact)}
                                </div>
                                <p className="text-gray-700 text-sm mb-3">{issue.description}</p>
                                <div className="bg-white p-3 rounded border">
                                  <strong className="text-green-800 text-sm">💡 תיקון:</strong>
                                  <p className="text-green-700 text-sm mt-1">{issue.fix}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </Card>
            </div>
          )}

          {activeTab === 'indexing' && (
            <div className="space-y-6">
              {/* Quick Submit */}
              <Card className="bg-green-50">
                <h3 className="text-lg font-semibold text-green-900 mb-4">⚡ שליחה מהירה לגוגל</h3>
                <div className="flex gap-3 mb-4">
                  <input
                    type="url"
                    value={urlToSubmit}
                    onChange={(e) => setUrlToSubmit(e.target.value)}
                    placeholder="https://eran-fixer.com/blog/new-post"
                    className="flex-1 px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <Button onClick={() => submitToGoogle(urlToSubmit)} disabled={!urlToSubmit.trim()}>
                    <Send className="w-4 h-4 ml-2" />
                    שלח לגוגל
                  </Button>
                </div>
                <p className="text-green-700 text-sm">
                  💡 <strong>טיפ:</strong> שלחו כל דף חדש מיד אחרי הפרסום לאינדוקס מהיר יותר
                </p>
              </Card>

              {/* Recent Content */}
              {siteStructure && (
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 תוכן אחרון (לשליחה לגוגל)</h3>
                  <div className="space-y-3">
                    {siteStructure.content
                      .sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
                      .slice(0, 10)
                      .map((item: any, index: number) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <Badge variant={
                              item.type === 'blog' ? 'success' :
                              item.type === 'portfolio' ? 'info' :
                              item.type === 'research' ? 'warning' : 'default'
                            } size="sm" className="ml-3">
                              {item.type}
                            </Badge>
                            <div>
                              <div className="font-medium text-gray-900">{item.title}</div>
                              <div className="text-sm text-gray-500">{item.url}</div>
                              <div className="text-xs text-gray-400">
                                עודכן: {new Date(item.updated_at).toLocaleDateString('he-IL')}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="צפה בדף"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                            <Button
                              size="sm"
                              onClick={() => submitToGoogle(item.url)}
                            >
                              <Send className="w-3 h-3 ml-1" />
                              שלח
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'optimization' && (
            <div className="space-y-6">
              {/* Optimization Tips */}
              <Card className="bg-gradient-to-r from-green-50 to-blue-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 טיפים לאינדוקס מהיר יותר</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">פעולות מיידיות:</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                        שלח דפים חדשים ל-Search Console מיד
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                        עדכן sitemap אוטומטית אחרי כל פרסום
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                        הוסף קישורים פנימיים לדפים חדשים
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                        שתף ברשתות חברתיות לקבלת crawl מהיר
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">אופטימיזציה טכנית:</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                        וודא meta tags מלאים לכל דף
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                        הוסף structured data (Schema.org)
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                        שפר מהירות טעינה (Core Web Vitals)
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                        בדוק שאין שגיאות 404 או 500
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Google Tools */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🛠️ כלי גוגל מומלצים</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <a
                    href="https://search.google.com/search-console"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group text-center"
                  >
                    <Search className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-3" />
                    <h4 className="font-medium text-gray-600 group-hover:text-blue-600 mb-1">Search Console</h4>
                    <p className="text-xs text-gray-500">שלח URLs ובדוק סטטוס אינדוקס</p>
                  </a>

                  <a
                    href="https://pagespeed.web.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group text-center"
                  >
                    <Zap className="w-8 h-8 text-gray-400 group-hover:text-green-500 mx-auto mb-3" />
                    <h4 className="font-medium text-gray-600 group-hover:text-green-600 mb-1">PageSpeed Insights</h4>
                    <p className="text-xs text-gray-500">בדוק מהירות וCore Web Vitals</p>
                  </a>

                  <a
                    href="https://developers.facebook.com/tools/debug/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors group text-center"
                  >
                    <Globe className="w-8 h-8 text-gray-400 group-hover:text-purple-500 mx-auto mb-3" />
                    <h4 className="font-medium text-gray-600 group-hover:text-purple-600 mb-1">Facebook Debugger</h4>
                    <p className="text-xs text-gray-500">בדוק שיתוף ברשתות חברתיות</p>
                  </a>
                </div>
              </Card>

              {/* Advanced Optimization */}
              <Card className="bg-yellow-50 border border-yellow-200">
                <h3 className="text-lg font-semibold text-yellow-900 mb-4">⚡ אופטימיזציה מתקדמת לאינדוקס מהיר</h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">1. IndexNow API (מיושם באתר)</h4>
                    <p className="text-gray-600 text-sm mb-2">
                      המערכת שולחת אוטומטית הודעה למנועי חיפוש על תוכן חדש
                    </p>
                    <div className="bg-green-100 p-2 rounded text-green-800 text-xs">
                      ✅ פעיל - כל דף חדש נשלח אוטומטית
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">2. Sitemap דינמי</h4>
                    <p className="text-gray-600 text-sm mb-2">
                      Sitemap מתעדכן אוטומטית עם כל תוכן חדש
                    </p>
                    <div className="bg-green-100 p-2 rounded text-green-800 text-xs">
                      ✅ פעיל - עדכון אוטומטי
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">3. Internal Linking אוטומטי</h4>
                    <p className="text-gray-600 text-sm mb-2">
                      קישורים פנימיים לתוכן קשור מתווספים אוטומטית
                    </p>
                    <div className="bg-yellow-100 p-2 rounded text-yellow-800 text-xs">
                      ⚠️ חלקי - ניתן לשפר
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">4. Social Signals</h4>
                    <p className="text-gray-600 text-sm mb-2">
                      שיתוף ברשתות חברתיות מאיץ זיהוי של גוגל
                    </p>
                    <div className="bg-yellow-100 p-2 rounded text-yellow-800 text-xs">
                      📱 ידני - שתפו דפים חדשים בפייסבוק/לינקדאין
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h3 className="text-xl font-bold mb-6 text-center">🚀 פעולות מהירות לשיפור האינדוקס</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => window.open('https://search.google.com/search-console/url-inspection', '_blank')}
            className="bg-white/10 backdrop-blur rounded-lg p-4 hover:bg-white/20 transition-colors text-center"
          >
            <Search className="w-8 h-8 mx-auto mb-2" />
            <div className="font-medium">URL Inspection</div>
            <div className="text-xs text-blue-100">בדוק סטטוס אינדוקס</div>
          </button>

          <button
            onClick={() => window.open('https://search.google.com/search-console/sitemaps', '_blank')}
            className="bg-white/10 backdrop-blur rounded-lg p-4 hover:bg-white/20 transition-colors text-center"
          >
            <Globe className="w-8 h-8 mx-auto mb-2" />
            <div className="font-medium">Submit Sitemap</div>
            <div className="text-xs text-blue-100">הגש sitemap חדש</div>
          </button>

          <button
            onClick={analyzeSiteStructure}
            className="bg-white/10 backdrop-blur rounded-lg p-4 hover:bg-white/20 transition-colors text-center"
          >
            <RefreshCw className="w-8 h-8 mx-auto mb-2" />
            <div className="font-medium">נתח מחדש</div>
            <div className="text-xs text-blue-100">בדוק שינויים</div>
          </button>
        </div>
      </Card>

      {/* Pro Tips */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200">
        <h3 className="text-lg font-semibold text-yellow-900 mb-4">💡 טיפים מקצועיים לאינדוקס מהיר</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-yellow-800 mb-3">לפני פרסום:</h4>
            <ul className="space-y-1 text-yellow-700 text-sm">
              <li>• וודא שיש לפחות 300 מילים בתוכן</li>
              <li>• הוסף meta title ו-description</li>
              <li>• בדוק שאין שגיאות 404 בקישורים</li>
              <li>• הוסף תמונות עם alt text</li>
              <li>• וודא שהדף מהיר (PageSpeed 90+)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-yellow-800 mb-3">אחרי פרסום:</h4>
            <ul className="space-y-1 text-yellow-700 text-sm">
              <li>• שלח ל-Search Console תוך 5 דקות</li>
              <li>• שתף בפייסבוק/לינקדאין/טוויטר</li>
              <li>• הוסף קישור פנימי מדף קיים</li>
              <li>• עדכן sitemap ושלח לגוגל</li>
              <li>• בדוק אחרי 24-48 שעות אם נאינדקס</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-white rounded-lg border border-yellow-300">
          <h4 className="font-semibold text-yellow-900 mb-2">🔥 טריק מתקדם:</h4>
          <p className="text-yellow-800 text-sm">
            <strong>שלח לגוגל דרך Search Console + שתף בפייסבוק + הוסף קישור פנימי</strong> - 
            השילוב הזה מאיץ אינדוקס פי 3-5 לעומת המתנה פסיבית.
          </p>
        </div>
      </Card>
    </div>
  )
}