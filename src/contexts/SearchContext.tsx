import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface SearchResult {
  id: string
  title: string
  excerpt: string
  url: string
  type: 'page' | 'blog' | 'portfolio' | 'research'
  image?: string
  date?: string
}

interface SearchContextType {
  searchTerm: string
  setSearchTerm: (term: string) => void
  results: SearchResult[]
  isSearching: boolean
  isSearchOpen: boolean
  setIsSearchOpen: (open: boolean) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([])
      return
    }

    const searchContent = async () => {
      setIsSearching(true)
      try {
        const searchQuery = searchTerm.toLowerCase()
        
        // Search in pages
        const { data: pages } = await supabase
          .from('pages')
          .select('id, title, content, slug, meta_description, updated_at')
          .eq('status', 'published')
          .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,meta_description.ilike.%${searchQuery}%`)

        // Search in blog posts
        const { data: blogPosts } = await supabase
          .from('blog_posts')
          .select('id, title, excerpt, slug, featured_image, published_at')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .order('created_at', { ascending: false })
          .or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)

        // Search in portfolio
        const { data: portfolio } = await supabase
          .from('portfolio_items')
          .select('id, title, description, slug, featured_image, completion_date')
          .eq('status', 'published')
          .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)

        // Search in research
        const { data: research } = await supabase
          .from('research_papers')
          .select('id, title, abstract, slug, featured_image, publication_date')
          .eq('status', 'published')
          .or(`title.ilike.%${searchQuery}%,abstract.ilike.%${searchQuery}%`)

        // Combine and format results
        const allResults: SearchResult[] = [
          ...(pages || []).map(page => ({
            id: page.id,
            title: page.title,
            excerpt: page.meta_description || page.content.substring(0, 150) + '...',
            url: `/${page.slug}`,
            type: 'page' as const,
            date: page.updated_at
          })),
          ...(blogPosts || []).map(post => ({
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            url: `/blog/${post.slug}`,
            type: 'blog' as const,
            image: post.featured_image,
            date: post.published_at
          })),
          ...(portfolio || []).map(item => ({
            id: item.id,
            title: item.title,
            excerpt: item.description,
            url: `/portfolio/${item.slug}`,
            type: 'portfolio' as const,
            image: item.featured_image,
            date: item.completion_date
          })),
          ...(research || []).map(paper => ({
            id: paper.id,
            title: paper.title,
            excerpt: paper.abstract,
            url: `/research/${paper.slug}`,
            type: 'research' as const,
            image: paper.featured_image,
            date: paper.publication_date
          }))
        ]

        setResults(allResults.slice(0, 10)) // Limit to 10 results
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsSearching(false)
      }
    }

    const debounceTimer = setTimeout(searchContent, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  return (
    <SearchContext.Provider value={{
      searchTerm,
      setSearchTerm,
      results,
      isSearching,
      isSearchOpen,
      setIsSearchOpen
    }}>
      {children}
    </SearchContext.Provider>
  )
}