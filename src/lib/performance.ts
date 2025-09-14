// Performance optimization utilities

export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

export const preloadImages = async (urls: string[]): Promise<void> => {
  try {
    const promises = urls.map(url => preloadImage(url).catch(err => {
      console.warn(`Failed to preload image: ${url}`, err)
      return null
    }))
    await Promise.allSettled(promises)
  } catch (error) {
    console.warn('Some images failed to preload:', error)
  }
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Lazy loading utility
export const createLazyLoader = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          if (img.dataset.src) {
            img.src = img.dataset.src
            img.classList.remove('lazy')
            observer.unobserve(img)
          }
        }
      })
    },
    { threshold: 0.1 }
  )

  return observer
}

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now()
  fn()
  const end = performance.now()
  console.log(`${name} took ${end - start} milliseconds`)
}

// Memory usage monitoring
export const getMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory
    return {
      used: Math.round(memory.usedJSHeapSize / 1048576),
      total: Math.round(memory.totalJSHeapSize / 1048576),
      limit: Math.round(memory.jsHeapSizeLimit / 1048576)
    }
  }
  return null
}