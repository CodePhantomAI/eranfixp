// Performance Optimization Utilities
export class PerformanceOptimizer {
  // Defer non-critical JavaScript
  static deferNonCriticalJS() {
    // Defer Google Analytics
    const deferGA = () => {
      if (typeof window.gtag === 'undefined') {
        const script = document.createElement('script')
        script.async = true
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-LPXNLBRXYF'
        document.head.appendChild(script)
        
        script.onload = () => {
          window.dataLayer = window.dataLayer || []
          function gtag(...args: any[]) { window.dataLayer.push(args) }
          gtag('js', new Date())
          gtag('config', 'G-LPXNLBRXYF')
        }
      }
    }

    // Defer until after page load
    if (document.readyState === 'complete') {
      setTimeout(deferGA, 1000)
    } else {
      window.addEventListener('load', () => {
        setTimeout(deferGA, 1000)
      })
    }
  }

  // Optimize images for faster loading
  static optimizeImages() {
    const images = document.querySelectorAll('img')
    images.forEach(img => {
      if (!img.loading) {
        img.loading = 'lazy'
      }
      if (!img.decoding) {
        img.decoding = 'async'
      }
    })
  }

  // Preload critical resources
  static preloadCriticalResources() {
    const criticalResources = [
      'https://fonts.googleapis.com',
      'https://res.cloudinary.com',
      'https://images.unsplash.com'
    ]

    criticalResources.forEach(url => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = url
      document.head.appendChild(link)
    })
  }

  // Reduce layout shifts
  static preventLayoutShifts() {
    // Add aspect ratio containers for images
    const images = document.querySelectorAll('img:not([width]):not([height])')
    images.forEach(img => {
      const container = document.createElement('div')
      container.style.aspectRatio = '16/9'
      container.style.overflow = 'hidden'
      img.parentNode?.insertBefore(container, img)
      container.appendChild(img)
    })
  }

  // Initialize all optimizations
  static init() {
    // Run immediately
    this.preloadCriticalResources()
    
    // Run after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.optimizeImages()
        this.preventLayoutShifts()
      })
    } else {
      this.optimizeImages()
      this.preventLayoutShifts()
    }

    // Defer non-critical scripts
    this.deferNonCriticalJS()
  }
}

// Auto-initialize
PerformanceOptimizer.init()