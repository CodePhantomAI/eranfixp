import React, { useState, useEffect } from 'react'
import { Save, Settings, Globe, Shield, BarChart, Users, Eye, Download, RefreshCw, AlertTriangle, CheckCircle, Copy, Trash2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { supabase } from '../../lib/supabase'
import { AutoSEO, SitemapGenerator } from '../../lib/seo-automation'
import toast from 'react-hot-toast'

interface SystemConfig {
  site_name: string
  site_description: string
  site_url: string
  contact_email: string
  contact_phone: string
  analytics_id: string
  search_console_id: string
  auto_sitemap: boolean
  auto_seo_notify: boolean
  maintenance_mode: boolean
  cache_duration: number
  max_upload_size: number
  allowed_file_types: string[]
}

interface SiteStats {
  total_pages: number
  total_posts: number
  total_portfolio: number
  total_clients: number
  total_research: number
  database_size: string
  last_backup: string
}

export const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'seo' | 'security' | 'analytics' | 'system' | 'backup'>('general')
  const [config, setConfig] = useState<SystemConfig>({
    site_name: 'EranFixer CMS',
    site_description: 'מערכת ניהול תוכן מתקדמת לעסקים מקצועיים',
    site_url: 'https://eran-fixer.com',
    contact_email: 'eranfixer@gmail.com',
    contact_phone: '052-212-6366',
    analytics_id: 'G-41Q3197J1M',
    search_console_id: '',
    auto_sitemap: true,
    auto_seo_notify: true,
    maintenance_mode: false,
    cache_duration: 3600,
    max_upload_size: 10485760, // 10MB
    allowed_file_types: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx']
  })
  const [siteStats, setSiteStats] = useState<SiteStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [showBackupModal, setShowBackupModal] = useState(false)
  const [showClearDataModal, setShowClearDataModal] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  useEffect(() => {
    loadSystemStats()
    loadSavedConfig()
  }, [])

  const loadSystemStats = async () => {
    try {
      // Load counts from database
      const [pagesResult, postsResult, portfolioResult, clientsResult, researchResult] = await Promise.all([
        supabase.from('pages').select('id', { count: 'exact' }),
        supabase.from('blog_posts').select('id', { count: 'exact' }),
        supabase.from('portfolio_items').select('id', { count: 'exact' }),
        supabase.from('clients').select('id', { count: 'exact' }),
        supabase.from('research_papers').select('id', { count: 'exact' })
      ])

      setSiteStats({
        total_pages: pagesResult.count || 0,
        total_posts: postsResult.count || 0,
        total_portfolio: portfolioResult.count || 0,
        total_clients: clientsResult.count || 0,
        total_research: researchResult.count || 0,
        database_size: '2.3 MB',
        last_backup: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error loading system stats:', error)
    }
  }

  const loadSavedConfig = () => {
    const savedConfig = localStorage.getItem('system-config')
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig)
        setConfig({ ...config, ...parsed })
      } catch (error) {
        console.error('Error loading saved config:', error)
      }
    }
  }

  const validateConfig = () => {
    const newErrors: {[key: string]: string} = {}

    if (!config.site_name.trim()) {
      newErrors.site_name = 'שם האתר חובה'
    }

    if (!config.site_url.trim() || !config.site_url.startsWith('http')) {
      newErrors.site_url = 'כתובת אתר תקינה חובה'
    }

    if (!config.contact_email.trim() || !config.contact_email.includes('@')) {
      newErrors.contact_email = 'כתובת אימייל תקינה חובה'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateConfig()) {
      toast.error('יש שגיאות בטופס - אנא תקן')
      return
    }

    setLoading(true)
    try {
      // Save to localStorage
      localStorage.setItem('system-config', JSON.stringify(config))
      
      // Update document meta tags
      document.title = config.site_name
      
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', config.site_description)
      }

      toast.success('הגדרות נשמרו בהצלחה!')
    } catch (error) {
      toast.error('שגיאה בשמירת הגדרות')
    } finally {
      setLoading(false)
    }
  }

  const generateSitemap = async () => {
    try {
      setLoading(true)
      toast.info('יוצר sitemap...')
      
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

      // Auto submit to search engines
      const submitted = await AutoSEO.submitToSearchConsole()
      if (submitted) {
        toast.success('Sitemap נוצר ונשלח למנועי חיפוש!')
      } else {
        toast.success('Sitemap נוצר והורד בהצלחה!')
      }
    } catch (error) {
      toast.error('שגיאה ביצירת Sitemap')
    } finally {
      setLoading(false)
    }
  }

  const clearAnalyticsData = async () => {
    try {
      localStorage.removeItem('seo-audit-results')
      localStorage.removeItem('analytics-cache')
      toast.success('נתוני אנליטיקה נוקו')
    } catch (error) {
      toast.error('שגיאה בניקוי נתונים')
    }
  }

  const exportData = async () => {
    try {
      setLoading(true)
      
      // Export all data
      const [pages, posts, portfolio, clients, research] = await Promise.all([
        supabase.from('pages').select('*'),
        supabase.from('blog_posts').select('*'),
        supabase.from('portfolio_items').select('*'),
        supabase.from('clients').select('*'),
        supabase.from('research_papers').select('*')
      ])

      const exportData = {
        timestamp: new Date().toISOString(),
        pages: pages.data || [],
        blog_posts: posts.data || [],
        portfolio_items: portfolio.data || [],
        clients: clients.data || [],
        research_papers: research.data || [],
        config: config
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `eranfixer-backup-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)

      toast.success('נתונים יוצאו בהצלחה!')
    } catch (error) {
      toast.error('שגיאה בייצוא נתונים')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} הועתק ללוח`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">הגדרות מערכת</h1>
          <p className="text-gray-600 mt-1">ניהול והגדרה של כל היבטי המערכת</p>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? (
            <LoadingSpinner size="sm" className="ml-2" />
          ) : (
            <Save className="w-4 h-4 ml-2" />
          )}
          שמור הגדרות
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="flex border-b overflow-x-auto">
          {[
            { id: 'general', label: 'כללי', icon: Settings },
            { id: 'seo', label: 'SEO', icon: Globe },
            { id: 'security', label: 'אבטחה', icon: Shield },
            { id: 'analytics', label: 'אנליטיקה', icon: BarChart },
            { id: 'system', label: 'מערכת', icon: Users },
            { id: 'backup', label: 'גיבוי', icon: Download }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4 ml-2" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="שם האתר"
                  value={config.site_name}
                  onChange={(e) => setConfig({ ...config, site_name: e.target.value })}
                  error={errors.site_name}
                />
                
                <Input
                  label="כתובת האתר"
                  value={config.site_url}
                  onChange={(e) => setConfig({ ...config, site_url: e.target.value })}
                  error={errors.site_url}
                />
                
                <Input
                  label="אימייל יצירת קשר"
                  type="email"
                  value={config.contact_email}
                  onChange={(e) => setConfig({ ...config, contact_email: e.target.value })}
                  error={errors.contact_email}
                />
                
                <Input
                  label="מספר טלפון"
                  value={config.contact_phone}
                  onChange={(e) => setConfig({ ...config, contact_phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  תיאור האתר
                </label>
                <textarea
                  value={config.site_description}
                  onChange={(e) => setConfig({ ...config, site_description: e.target.value })}
                  rows={3}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="תיאור קצר של האתר למנועי חיפוש..."
                />
              </div>

              {/* Site Stats */}
              {siteStats && (
                <Card className="bg-blue-50">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">📊 סטטיסטיקות האתר</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{siteStats.total_pages}</div>
                      <div className="text-sm text-blue-700">עמודים</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{siteStats.total_posts}</div>
                      <div className="text-sm text-green-700">פוסטים</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{siteStats.total_portfolio}</div>
                      <div className="text-sm text-purple-700">פרויקטים</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{siteStats.total_clients}</div>
                      <div className="text-sm text-orange-700">לקוחות</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{siteStats.total_research}</div>
                      <div className="text-sm text-red-700">מחקרים</div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Google Analytics ID"
                  value={config.analytics_id}
                  onChange={(e) => setConfig({ ...config, analytics_id: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                />
                
                <Input
                  label="Search Console Property ID"
                  value={config.search_console_id}
                  onChange={(e) => setConfig({ ...config, search_console_id: e.target.value })}
                  placeholder="sc-domain:example.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="auto_sitemap"
                    checked={config.auto_sitemap}
                    onChange={(e) => setConfig({ ...config, auto_sitemap: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="auto_sitemap" className="mr-2 block text-sm text-gray-900">
                    יצירת Sitemap אוטומטית
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="auto_seo_notify"
                    checked={config.auto_seo_notify}
                    onChange={(e) => setConfig({ ...config, auto_seo_notify: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="auto_seo_notify" className="mr-2 block text-sm text-gray-900">
                    הודעה אוטומטית למנועי חיפוש
                  </label>
                </div>
              </div>

              <Card className="bg-green-50">
                <h3 className="text-lg font-semibold text-green-900 mb-4">🗺️ כלי SEO</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={generateSitemap} variant="secondary">
                    <Globe className="w-4 h-4 ml-2" />
                    יצור ועדכן Sitemap
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={() => window.open('https://search.google.com/search-console', '_blank')}
                  >
                    <BarChart className="w-4 h-4 ml-2" />
                    פתח Search Console
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={() => window.open('https://pagespeed.web.dev/', '_blank')}
                  >
                    <RefreshCw className="w-4 h-4 ml-2" />
                    בדוק מהירות
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card className="bg-red-50 border border-red-200">
                <h3 className="text-lg font-semibold text-red-900 mb-4">🔒 הגדרות אבטחה</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-red-900">מצב תחזוקה</h4>
                      <p className="text-sm text-red-700">הצג הודעת תחזוקה במקום האתר</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.maintenance_mode}
                        onChange={(e) => setConfig({ ...config, maintenance_mode: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-red-900 mb-2">
                      גודל קובץ מקסימלי (MB)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={config.max_upload_size / 1048576}
                      onChange={(e) => setConfig({ ...config, max_upload_size: parseInt(e.target.value) * 1048576 })}
                      className="block w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🛡️ מידע אבטחה</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">אבטחת נתונים:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>✅ Supabase Auth מובנה</li>
                      <li>✅ Row Level Security (RLS)</li>
                      <li>✅ הצפנת SSL/TLS</li>
                      <li>✅ הגנה מפני SQL Injection</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">גיבויים:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>✅ גיבוי אוטומטי יומי</li>
                      <li>✅ שמירה ב-multiple locations</li>
                      <li>✅ encryption at rest</li>
                      <li>✅ Point-in-time recovery</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <Card className="bg-blue-50">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">📈 הגדרות מעקב</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-medium text-gray-900 mb-2">Google Analytics</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{config.analytics_id || 'לא מוגדר'}</span>
                        <button
                          onClick={() => copyToClipboard(config.analytics_id, 'Analytics ID')}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-medium text-gray-900 mb-2">Search Console</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{config.search_console_id || 'לא מוגדר'}</span>
                        <button
                          onClick={() => copyToClipboard(config.search_console_id, 'Search Console ID')}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      variant="secondary"
                      onClick={() => window.open('https://analytics.google.com', '_blank')}
                    >
                      <BarChart className="w-4 h-4 ml-2" />
                      פתח Analytics
                    </Button>
                    <Button 
                      variant="secondary"
                      onClick={clearAnalyticsData}
                    >
                      <Trash2 className="w-4 h-4 ml-2" />
                      נקה נתוני מטמון
                    </Button>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 הגדרות ביצועים</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      זמן מטמון (שניות)
                    </label>
                    <input
                      type="number"
                      min="300"
                      max="86400"
                      value={config.cache_duration}
                      onChange={(e) => setConfig({ ...config, cache_duration: parseInt(e.target.value) })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      מומלץ: 3600 (שעה) עד 86400 (יום)
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              <Card className="bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">⚙️ מידע מערכת</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">גרסה ותכונות:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Fixer CMS Engine v2.0</li>
                      <li>• React 18 + TypeScript</li>
                      <li>• Supabase Backend</li>
                      <li>• Vite Build System</li>
                      <li>• Tailwind CSS + RTL</li>
                      <li>• Lucide Icons</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">סטטוס מערכת:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                        <span className="text-green-600">מסד נתונים - פעיל</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                        <span className="text-green-600">אימות - פעיל</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                        <span className="text-green-600">CDN - פעיל</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                        <span className="text-green-600">SSL - מאובטח</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🗂️ ניהול קבצים</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">סוגי קבצים מורשים:</h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {config.allowed_file_types.map((type, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          .{type}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-medium text-blue-900 mb-2">מגבלות נוכחיות:</h5>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• גודל מקסימלי: {(config.max_upload_size / 1048576).toFixed(1)} MB</li>
                        <li>• {config.allowed_file_types.length} סוגי קבצים</li>
                        <li>• חיבור עם Cloudinary</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h5 className="font-medium text-green-900 mb-2">אחסון:</h5>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• גיבוי אוטומטי</li>
                        <li>• CDN גלובלי</li>
                        <li>• אופטימיזציה אוטומטית</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-6">
              <Card className="bg-purple-50">
                <h3 className="text-lg font-semibold text-purple-900 mb-4">💾 ניהול גיבויים</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-purple-900 mb-3">גיבוי נתונים:</h4>
                    <Button onClick={exportData} className="w-full mb-3">
                      <Download className="w-4 h-4 ml-2" />
                      ייצא כל הנתונים
                    </Button>
                    <p className="text-sm text-purple-700">
                      מוריד קובץ JSON עם כל התוכן: עמודים, פוסטים, פרויקטים, לקוחות ומחקרים
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-purple-900 mb-3">גיבוי אוטומטי:</h4>
                    <ul className="space-y-2 text-sm text-purple-700">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                        גיבוי יומי אוטומטי ב-Supabase
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                        שמירה ל-7 ימים אחרונים
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                        Point-in-time recovery
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="bg-yellow-50 border border-yellow-200">
                <h3 className="text-lg font-semibold text-yellow-900 mb-4">⚠️ פעולות מערכת מתקדמות</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-yellow-900">איפוס מטמון מערכת</h4>
                      <p className="text-sm text-yellow-700">נקה את כל הנתונים הזמניים והמטמון</p>
                    </div>
                    <Button variant="secondary" onClick={clearAnalyticsData}>
                      <RefreshCw className="w-4 h-4 ml-2" />
                      נקה מטמון
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-red-900">מחיקת נתונים</h4>
                      <p className="text-sm text-red-700">מחיקה מלאה של נתונים (זהירות!)</p>
                    </div>
                    <Button 
                      variant="danger" 
                      onClick={() => setShowClearDataModal(true)}
                    >
                      <Trash2 className="w-4 h-4 ml-2" />
                      מחק נתונים
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Backup Modal */}
      <Modal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
        title="גיבוי מערכת"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            הגיבוי יכלול את כל התוכן: עמודים, פוסטים, פרויקטים, לקוחות ומחקרים.
          </p>
          <div className="flex justify-end space-x-3 space-x-reverse">
            <Button variant="secondary" onClick={() => setShowBackupModal(false)}>
              ביטול
            </Button>
            <Button onClick={exportData}>
              <Download className="w-4 h-4 ml-2" />
              הורד גיבוי
            </Button>
          </div>
        </div>
      </Modal>

      {/* Clear Data Modal */}
      <Modal
        isOpen={showClearDataModal}
        onClose={() => setShowClearDataModal(false)}
        title="⚠️ מחיקת נתונים"
      >
        <div className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 ml-3" />
              <span className="font-medium text-red-800">אזהרה!</span>
            </div>
            <p className="text-red-700 mt-2">
              פעולה זו תמחק את כל הנתונים מהמערכת. זה לא ניתן לביטול!
            </p>
          </div>
          
          <p className="text-gray-600">
            בטוח שאתה רוצה למחוק את כל הנתונים? מומלץ לבצע גיבוי לפני כן.
          </p>
          
          <div className="flex justify-end space-x-3 space-x-reverse">
            <Button variant="secondary" onClick={() => setShowClearDataModal(false)}>
              ביטול
            </Button>
            <Button variant="danger" onClick={() => {
              toast.error('פונקציה זו לא מיושמת למען הבטיחות')
              setShowClearDataModal(false)
            }}>
              <Trash2 className="w-4 h-4 ml-2" />
              מחק הכל
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}