import React, { useState, useEffect } from 'react'
import { Activity, Zap, Clock } from 'lucide-react'

interface PerformanceMetrics {
  loadTime: number
  memoryUsage: number
  renderTime: number
}

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [showMetrics, setShowMetrics] = useState(false)

  useEffect(() => {
    // Only show in development
    if (import.meta.env.DEV) {
      const measurePerformance = () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart
        
        let memoryUsage = 0
        if ('memory' in performance) {
          const memory = (performance as any).memory
          memoryUsage = Math.round(memory.usedJSHeapSize / 1048576) // MB
        }

        const renderTime = performance.now()

        setMetrics({
          loadTime: Math.round(loadTime),
          memoryUsage,
          renderTime: Math.round(renderTime)
        })
      }

      // Measure after page load
      if (document.readyState === 'complete') {
        measurePerformance()
      } else {
        window.addEventListener('load', measurePerformance)
      }

      return () => window.removeEventListener('load', measurePerformance)
    }
  }, [])

  if (!metrics || !import.meta.env.DEV) return null

  return (
    <div className="fixed top-20 left-4 z-40">
      <button
        onClick={() => setShowMetrics(!showMetrics)}
        className="bg-gray-800 text-white p-2 rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
        title="Performance Metrics"
      >
        <Activity className="w-4 h-4" />
      </button>

      {showMetrics && (
        <div className="absolute top-full mt-2 bg-white rounded-lg shadow-xl border p-4 w-64 text-sm">
          <h3 className="font-semibold text-gray-900 mb-3">Performance Metrics</h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-blue-600 ml-2" />
                <span>Load Time</span>
              </div>
              <span className="font-mono text-green-600">{metrics.loadTime}ms</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Zap className="w-4 h-4 text-yellow-600 ml-2" />
                <span>Memory</span>
              </div>
              <span className="font-mono text-orange-600">{metrics.memoryUsage}MB</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="w-4 h-4 text-purple-600 ml-2" />
                <span>Render</span>
              </div>
              <span className="font-mono text-purple-600">{metrics.renderTime}ms</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}