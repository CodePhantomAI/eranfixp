import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('he-IL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

export function slugify(text: string): string {
  console.log('Slugifying text:', text)
  
  if (!text || text.trim() === '') {
    console.log('Empty text provided to slugify')
    return ''
  }
  
  const result = text
    .toLowerCase()
    .trim()
    .replace(/[\u0590-\u05FF\u200F\u200E]/g, '') // Remove Hebrew characters and RTL marks
    .replace(/[^\w\s-]/g, '') // Remove special characters except word chars, spaces, hyphens
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
  
  console.log('Slugified result:', result)
  return result
}