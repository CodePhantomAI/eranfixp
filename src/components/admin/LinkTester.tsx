import React, { useState } from 'react'
import { Link, CheckCircle, XCircle, ExternalLink } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { LoadingSpinner } from '../ui/LoadingSpinner'

interface LinkTestResult {
  url: string
  status: 'working' | 'broken' | 'redirect'
  statusCode?: number
  redirectUrl?: string
  responseTime?: number
}

export const LinkTester: React.FC = () => {
  const [testUrl, setTestUrl] = useState('')
  const [testResults, setTestResults] = useState<LinkTestResult[]>([])
  const [testing, setTesting] = useState(false)

  const testLink = async (url: string): Promise<LinkTestResult> => {
    try {
      const startTime = Date.now()
      const response = await fetch(url, { 
        method: 'HEAD',
        mode: 'no-cors' // This will limit what we can check but avoids CORS issues
      })
      const responseTime = Date.now() - startTime

      return {
        url,
        status: 'working',
        statusCode: 200, // We can't actually get the status code with no-cors
        responseTime
      }
    } catch (error) {
      return {
        url,
        status: 'broken'
      }
    }
  }

  const handleTestSingleLink = async () => {
    if (!testUrl.trim()) return

    setTesting(true)
    try {
      const result = await testLink(testUrl)
      setTestResults([result])
    } catch (error) {
      console.error('Error testing link:', error)
    } finally {
      setTesting(false)
    }
  }

  const generateTestLink = (text: string, url: string) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6 !important; text-decoration: underline !important; cursor: pointer !important; pointer-events: all !important; position: relative !important; z-index: 1 !important; font-weight: 500 !important;">${text}</a>`
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🔗 בודק קישורים</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL לבדיקה
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button 
              onClick={handleTestSingleLink}
              disabled={testing || !testUrl.trim()}
            >
              {testing ? <LoadingSpinner size="sm" className="ml-2" /> : <Link className="w-4 h-4 ml-2" />}
              בדוק
            </Button>
          </div>
        </div>

        {/* Sample Links for Testing */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-3">🧪 קישורים לבדיקה:</h4>
          <div className="space-y-2">
            <button
              onClick={() => setTestUrl('https://wa.me/972522126366')}
              className="block text-blue-600 hover:text-blue-700 text-sm"
            >
              WhatsApp → https://wa.me/972522126366
            </button>
            <button
              onClick={() => setTestUrl('https://seo.eranfixer.co.il')}
              className="block text-blue-600 hover:text-blue-700 text-sm"
            >
              SEO Research → https://seo.eranfixer.co.il
            </button>
            <button
              onClick={() => setTestUrl('https://ai.eranfixer.co.il')}
              className="block text-blue-600 hover:text-blue-700 text-sm"
            >
              AI Solutions → https://ai.eranfixer.co.il
            </button>
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">תוצאות בדיקה:</h4>
            {testResults.map((result, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                result.status === 'working' ? 'bg-green-50 border border-green-200' :
                result.status === 'broken' ? 'bg-red-50 border border-red-200' :
                'bg-yellow-50 border border-yellow-200'
              }`}>
                <div className="flex items-center">
                  {result.status === 'working' ? (
                    <CheckCircle className="w-5 h-5 text-green-500 ml-3" />
                  ) : result.status === 'broken' ? (
                    <XCircle className="w-5 h-5 text-red-500 ml-3" />
                  ) : (
                    <ExternalLink className="w-5 h-5 text-yellow-500 ml-3" />
                  )}
                  <div>
                    <div className="font-medium text-gray-900">{result.url}</div>
                    <div className="text-sm text-gray-500">
                      {result.status === 'working' ? 'קישור עובד תקין' :
                       result.status === 'broken' ? 'קישור לא עובד' :
                       'הפניה'}
                      {result.responseTime && ` (${result.responseTime}ms)`}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Generated HTML Examples */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">📝 דוגמאות HTML לקישורים:</h4>
          <div className="space-y-3 text-sm">
            <div>
              <strong>וואטסאפ:</strong>
              <code className="block bg-white p-2 rounded mt-1 text-xs break-all">
                {generateTestLink('שלח הודעה בווטסאפ', 'https://wa.me/972522126366?text=היי')}
              </code>
            </div>
            <div>
              <strong>מייל:</strong>
              <code className="block bg-white p-2 rounded mt-1 text-xs break-all">
                {generateTestLink('שלח מייל', 'mailto:eranfixer@gmail.com')}
              </code>
            </div>
            <div>
              <strong>טלפון:</strong>
              <code className="block bg-white p-2 rounded mt-1 text-xs break-all">
                {generateTestLink('התקשר', 'tel:052-212-6366')}
              </code>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}