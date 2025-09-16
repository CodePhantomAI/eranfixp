import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Eye, TrendingUp, Users, Redo as Redirect, Image, Calendar, Activity } from 'lucide-react'
import { QuickActions } from './ui/QuickActions'

const stats = [
  { name: 'סך הכל עמודים', value: '12', icon: FileText, change: '+2', changeType: 'positive' },
  { name: 'צפיות חודשיות', value: '2,847', icon: Eye, change: '+12%', changeType: 'positive' },
  { name: 'הפניות פעילות', value: '8', icon: Redirect, change: '0', changeType: 'neutral' },
  { name: 'קבצי מדיה', value: '156', icon: Image, change: '+5', changeType: 'positive' },
]

const recentPages = [
  { title: 'מאמר על AI החדש', status: 'published', lastModified: '30 דקות', views: 23 },
  { title: 'קידום מקצועי 2025', status: 'published', lastModified: '2 שעות', views: 145 },
  { title: 'פתרונות אוטומציה', status: 'draft', lastModified: '1 יום', views: 0 },
  { title: 'עדכון שירותי SEO', status: 'published', lastModified: '3 ימים', views: 89 },
]

export const Dashboard: React.FC = () => {
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
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">ברוכים הבאים למערכת הניהול של ערן פיקסר</h1>
        <p className="text-blue-100">ניהול מתקדם של אתר EranFixer.com</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <stat.icon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' :
                stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 mr-2">מאז חודש שעבר</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Pages */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">עמודים אחרונים</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <h3 className="font-medium text-gray-900">{page.title}</h3>
                      <p className="text-sm text-gray-500">עודכן לפני {page.lastModified}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      page.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {page.status === 'published' ? 'פורסם' : 'טיוטה'}
                    </span>
                    <span className="text-sm text-gray-500">{page.views} צפיות</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">פעילות אחרונה</h2>
          </div>
          <div className="p-6">
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

              <div className="flex items-start space-x-3 space-x-reverse">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Image className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">5 תמונות חדשות הועלו לספרייה</p>
                  <p className="text-xs text-gray-500">לפני 2 ימים</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <QuickActions {...quickActions} />
    </div>
  )
}