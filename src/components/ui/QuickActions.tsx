import React from 'react'
import { Plus, FileText, Image, Users, Redo as Redirect, BookOpen, FlaskConical } from 'lucide-react'
import { Button } from './Button'

interface QuickActionsProps {
  onCreatePage?: () => void
  onCreatePost?: () => void
  onCreatePortfolio?: () => void
  onCreateResearch?: () => void
  onCreateRedirect?: () => void
  onUploadMedia?: () => void
  onCreateClient?: () => void
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onCreatePage,
  onCreatePost,
  onCreatePortfolio,
  onCreateResearch,
  onCreateRedirect,
  onUploadMedia,
  onCreateClient
}) => {
  const actions = [
    {
      icon: FileText,
      title: 'עמוד חדש',
      description: 'צור עמוד חדש באתר',
      onClick: onCreatePage,
      color: 'bg-blue-100 text-blue-600 hover:bg-blue-200'
    },
    {
      icon: BookOpen,
      title: 'פוסט בבלוג',
      description: 'כתוב מאמר חדש',
      onClick: onCreatePost,
      color: 'bg-green-100 text-green-600 hover:bg-green-200'
    },
    {
      icon: FlaskConical,
      title: 'פרויקט בתיק',
      description: 'הוסף פרויקט חדש',
      onClick: onCreatePortfolio,
      color: 'bg-purple-100 text-purple-600 hover:bg-purple-200'
    },
    {
      icon: Users,
      title: 'לקוח חדש',
      description: 'הוסף המלצת לקוח',
      onClick: onCreateClient,
      color: 'bg-orange-100 text-orange-600 hover:bg-orange-200'
    },
    {
      icon: Image,
      title: 'העלאת תמונה',
      description: 'העלה קובץ מדיה',
      onClick: onUploadMedia,
      color: 'bg-pink-100 text-pink-600 hover:bg-pink-200'
    },
    {
      icon: Redirect,
      title: 'הפניה 301',
      description: 'צור הפניה לSEO',
      onClick: onCreateRedirect,
      color: 'bg-cyan-100 text-cyan-600 hover:bg-cyan-200'
    }
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6 text-center">
        ⚡ פעולות מהירות
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-current transition-all duration-200 hover:scale-105 group ${action.color}`}
            disabled={!action.onClick}
          >
            <action.icon className="w-8 h-8 mx-auto mb-3 group-hover:animate-bounce" />
            <div className="text-sm font-semibold mb-1">{action.title}</div>
            <div className="text-xs opacity-80">{action.description}</div>
          </button>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">💡 טיפים מהירים:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• השתמשו ב-Ctrl+K להוספת קישורים מהירה בעורך</li>
          <li>• העלו תמונות מ-Unsplash לתוצאות SEO טובות יותר</li>
          <li>• הוסיפו הפניות 301 לשמירת דירוג SEO</li>
          <li>• עדכנו תוכן באופן קבוע לקידום טוב יותר</li>
        </ul>
      </div>
    </div>
  )
}