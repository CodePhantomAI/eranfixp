import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Users, Eye, Clock, Smartphone, Monitor, Tablet, RefreshCw } from 'lucide-react'
import { Card } from '../ui/Card'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { AnalyticsManager, AnalyticsData, GoogleAnalyticsIntegration } from '../../lib/analytics'

interface RealTimeAnalyticsProps {
  timeRange?: '7d' | '30d' | '90d'
}

export const RealTimeAnalytics: React.FC<RealTimeAnalyticsProps> = ({ 
  timeRange = '30d' 
}) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    loadAnalytics()
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadAnalytics, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [timeRange])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const data = await AnalyticsManager.getAnalyticsData(timeRange)
      setAnalyticsData(data)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case '7d': return '7 ימים אחרונים'
      case '30d': return '30 ימים אחרונים'
      case '90d': return '90 ימים אחרונים'
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (loading && !analyticsData) {
    return (
      <Card>
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" />
          <span className="mr-3 text-gray-600">טוען נתוני אנליטיקה...</span>
        </div>
      </Card>
    )
  }

  if (!analyticsData) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-gray-600">לא ניתן לטעון נתוני אנליטיקה</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">אנליטיקה בזמן אמת</h2>
          <p className="text-gray-600 text-sm">
            {getTimeRangeLabel()} | עודכן: {lastUpdate.toLocaleTimeString('he-IL')}
          </p>
        </div>
        <button
          onClick={loadAnalytics}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          עדכן
        </button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">צפיות</p>
              <p className="text-2xl font-bold text-blue-900">
                {analyticsData.pageviews.toLocaleString()}
              </p>
            </div>
            <Eye className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">הפעלות</p>
              <p className="text-2xl font-bold text-green-900">
                {analyticsData.sessions.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">משתמשים</p>
              <p className="text-2xl font-bold text-purple-900">
                {analyticsData.users.toLocaleString()}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">זמן ממוצע</p>
              <p className="text-2xl font-bold text-orange-900">
                {formatDuration(analyticsData.avgSessionDuration)}
              </p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">דפים פופולריים</h3>
          <div className="space-y-3">
            {analyticsData.topPages.map((page, index) => (
              <div key={page.page} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center ml-3">
                    {index + 1}
                  </span>
                  <div>
                    <div className="font-medium text-gray-900">{page.page}</div>
                    <div className="text-sm text-gray-500">{page.sessions} הפעלות</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{page.views.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">צפיות</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">מקורות תנועה</h3>
          <div className="space-y-3">
            {analyticsData.trafficSources.map((source, index) => (
              <div key={source.source} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full ml-3"
                    style={{ 
                      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index] || '#6B7280' 
                    }}
                  />
                  <div>
                    <div className="font-medium text-gray-900">{source.source}</div>
                    <div className="text-sm text-gray-500">{source.sessions} הפעלות</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{source.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Device Stats */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">סטטיסטיקת מכשירים</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <Smartphone className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{analyticsData.deviceStats.mobile}%</div>
            <div className="text-sm text-gray-600">מובייל</div>
          </div>
          <div className="text-center">
            <Monitor className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{analyticsData.deviceStats.desktop}%</div>
            <div className="text-sm text-gray-600">מחשב</div>
          </div>
          <div className="text-center">
            <Tablet className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{analyticsData.deviceStats.tablet}%</div>
            <div className="text-sm text-gray-600">טאבלט</div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{analyticsData.bounceRate}%</div>
              <div className="text-sm text-gray-600">שיעור יציאה</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">
                {(analyticsData.pageviews / analyticsData.sessions).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">דפים להפעלה</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Performance Alerts */}
      <Card className="bg-yellow-50 border border-yellow-200">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">🚨 התראות ביצועים</h3>
        <div className="space-y-2">
          {analyticsData.bounceRate > 60 && (
            <div className="flex items-center text-yellow-700">
              <TrendingDown className="w-4 h-4 ml-2" />
              <span className="text-sm">שיעור יציאה גבוה ({analyticsData.bounceRate}%) - שקול שיפור תוכן</span>
            </div>
          )}
          {analyticsData.avgSessionDuration < 120 && (
            <div className="flex items-center text-yellow-700">
              <Clock className="w-4 h-4 ml-2" />
              <span className="text-sm">זמן שהייה נמוך - הוסף תוכן מעניין יותר</span>
            </div>
          )}
          {analyticsData.deviceStats.mobile > 70 && (
            <div className="flex items-center text-blue-700">
              <Smartphone className="w-4 h-4 ml-2" />
              <span className="text-sm">רוב התנועה ממובייל - וודא אופטימיזציה מובייל</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}