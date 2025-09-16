import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Eye, TrendingUp, Users, Redo as Redirect, Image, Calendar, Activity, BarChart, Target } from 'lucide-react'
import { QuickActions } from './ui/QuickActions'
import { RealTimeAnalytics } from './admin/RealTimeAnalytics'
import { ContentAnalyzer } from './admin/ContentAnalyzer'

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'analytics' | 'content'>('overview')

  const quickActions = {
    onCreatePage: () => {
    window.location.href = '/admin/pages?action=create'
    },
    onCreatePost: () => {
      window.location.href = '/admin/blog?action=create'
    },
    onCreatePortfolio: () => {
      window.location.href = '/admin/portfolio?action=create'
    },
    onCreateResearch: () => {
      window.location.href = '/admin/research?action=create'
    },
    onCreateRedirect: () => {
      window.location.href = '/admin/redirects?action=create'
    },
    onUploadMedia: () => {
      window.location.href = '/admin/media?action=upload'
    },
    onCreateClient: () => {
      window.location.href = '/admin/clients?action=create'
    }
  }


  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">ברוכים הבאים למערכת הניהול המתקדמת</h1>
            <p className="text-blue-100 text-lg">EranFixer CMS - ניהול חכם ואנליטיקה בזמן אמת</p>
          </div>
          <div className="hidden lg:block">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">98%</div>
              <div className="text-sm text-blue-100">שביעות רצון</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Activity className="w-4 h-4 inline ml-2" />
            סקירה כללית
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'analytics'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart className="w-4 h-4 inline ml-2" />
            אנליטיקה
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'content'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Target className="w-4 h-4 inline ml-2" />
            ניתוח תוכן
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Quick Actions */}
              <QuickActions {...quickActions} />
              
              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">פעילות אחרונה</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">עמוד חדש נוצר: "פתרונות AI למעיסקים"</p>
                      <p className="text-xs text-gray-500">לפני 2 שעות</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">עלייה בתנועה באתר - 15% מהשבוע שעבר</p>
                      <p className="text-xs text-gray-500">לפני 4 שעות</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 space-x-reverse">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Redirect className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">הפניה חדשה נוספה: /old-page → /new-page</p>
                      <p className="text-xs text-gray-500">לפני יום</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <RealTimeAnalytics timeRange="30d" />
          )}

          {activeTab === 'content' && (
            <ContentAnalyzer />
          )}
        </div>
      </div>
    </div>
  )
}