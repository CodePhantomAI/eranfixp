import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const user = await getCurrentUser()
    return !!user
  } catch {
    return false
  }
}

export type Database = {
  public: {
    Tables: {
      pages: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          meta_title: string | null
          meta_description: string | null
          status: 'draft' | 'published' | 'archived'
          created_at: string
          updated_at: string
          author_id: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          meta_title?: string | null
          meta_description?: string | null
          status?: 'draft' | 'published' | 'archived'
          created_at?: string
          updated_at?: string
          author_id: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          meta_title?: string | null
          meta_description?: string | null
          status?: 'draft' | 'published' | 'archived'
          created_at?: string
          updated_at?: string
          author_id?: string
        }
      }
      redirects: {
        Row: {
          id: string
          from_path: string
          to_path: string
          status_code: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          from_path: string
          to_path: string
          status_code?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          from_path?: string
          to_path?: string
          status_code?: number
          created_at?: string
          updated_at?: string
        }
      }
      media: {
        Row: {
          id: string
          filename: string
          original_name: string
          file_size: number
          mime_type: string
          url: string
          alt_text: string | null
          created_at: string
        }
        Insert: {
          id?: string
          filename: string
          original_name: string
          file_size: number
          mime_type: string
          url: string
          alt_text?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          filename?: string
          original_name?: string
          file_size?: number
          mime_type?: string
          url?: string
          alt_text?: string | null
          created_at?: string
        }
      }
      blog_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string
          color?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          color?: string
          created_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string
          content: string
          featured_image: string | null
          meta_title: string | null
          meta_description: string | null
          status: 'draft' | 'published' | 'archived'
          published_at: string | null
          created_at: string
          updated_at: string
          author_id: string
          category_id: string | null
          tags: string[]
          read_time: number
          views: number
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string
          content?: string
          featured_image?: string | null
          meta_title?: string | null
          meta_description?: string | null
          status?: 'draft' | 'published' | 'archived'
          published_at?: string | null
          created_at?: string
          updated_at?: string
          author_id: string
          category_id?: string | null
          tags?: string[]
          read_time?: number
          views?: number
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string
          content?: string
          featured_image?: string | null
          meta_title?: string | null
          meta_description?: string | null
          status?: 'draft' | 'published' | 'archived'
          published_at?: string | null
          created_at?: string
          updated_at?: string
          author_id?: string
          category_id?: string | null
          tags?: string[]
          read_time?: number
          views?: number
        }
      }
      portfolio_items: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          content: string
          featured_image: string | null
          gallery: string[]
          client_name: string | null
          project_url: string | null
          technologies: string[]
          category: string
          completion_date: string | null
          status: 'draft' | 'published' | 'archived'
          created_at: string
          updated_at: string
          author_id: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string
          content?: string
          featured_image?: string | null
          gallery?: string[]
          client_name?: string | null
          project_url?: string | null
          technologies?: string[]
          category?: string
          completion_date?: string | null
          status?: 'draft' | 'published' | 'archived'
          created_at?: string
          updated_at?: string
          author_id: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string
          content?: string
          featured_image?: string | null
          gallery?: string[]
          client_name?: string | null
          project_url?: string | null
          technologies?: string[]
          category?: string
          completion_date?: string | null
          status?: 'draft' | 'published' | 'archived'
          created_at?: string
          updated_at?: string
          author_id?: string
        }
      }
      clients: {
        Row: {
          id: string
          name: string
          logo: string | null
          website: string | null
          industry: string | null
          description: string
          testimonial: string | null
          rating: number
          project_count: number
          featured: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          logo?: string | null
          website?: string | null
          industry?: string | null
          description?: string
          testimonial?: string | null
          rating?: number
          project_count?: number
          featured?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          logo?: string | null
          website?: string | null
          industry?: string | null
          description?: string
          testimonial?: string | null
          rating?: number
          project_count?: number
          featured?: boolean
          created_at?: string
        }
      }
      case_studies: {
        Row: {
          id: string
          title: string
          slug: string
          client_id: string | null
          challenge: string
          solution: string
          results: string
          featured_image: string | null
          gallery: string[]
          metrics: any
          duration: string | null
          technologies: string[]
          status: 'draft' | 'published' | 'archived'
          created_at: string
          updated_at: string
          author_id: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          client_id?: string | null
          challenge?: string
          solution?: string
          results?: string
          featured_image?: string | null
          gallery?: string[]
          metrics?: any
          duration?: string | null
          technologies?: string[]
          status?: 'draft' | 'published' | 'archived'
          created_at?: string
          updated_at?: string
          author_id: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          client_id?: string | null
          challenge?: string
          solution?: string
          results?: string
          featured_image?: string | null
          gallery?: string[]
          metrics?: any
          duration?: string | null
          technologies?: string[]
          status?: 'draft' | 'published' | 'archived'
          created_at?: string
          updated_at?: string
          author_id?: string
        }
      }
      research_papers: {
        Row: {
          id: string
          title: string
          slug: string
          abstract: string
          content: string
          featured_image: string | null
          pdf_url: string | null
          authors: string[]
          publication_date: string | null
          category: string
          tags: string[]
          citations: number
          downloads: number
          status: 'draft' | 'published' | 'archived'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          abstract?: string
          content?: string
          featured_image?: string | null
          pdf_url?: string | null
          authors?: string[]
          publication_date?: string | null
          category?: string
          tags?: string[]
          citations?: number
          downloads?: number
          status?: 'draft' | 'published' | 'archived'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          abstract?: string
          content?: string
          featured_image?: string | null
          pdf_url?: string | null
          authors?: string[]
          publication_date?: string | null
          category?: string
          tags?: string[]
          citations?: number
          downloads?: number
          status?: 'draft' | 'published' | 'archived'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}