import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Search, Filter, Edit, Trash2, Eye, Calendar, User, Tag, FileText } from 'lucide-react'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'
import { LoadingSpinner } from './ui/LoadingSpinner'
import { BlogEditor } from './BlogEditor'
import { supabase } from '../lib/supabase'
import { formatDate } from '../lib/utils'
import toast from 'react-hot-toast'
import { AutoSEO } from '../lib/seo-automation'

interface BlogPost {
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
  blog_categories: {
    name: string
    color: string
  } | null
}

interface BlogCategory {
  id: string
  name: string
  slug: string
  color: string
}

export const BlogManager: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [showCategoryModal, setShowCategoryModal] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load categories
      const { data: categoriesData } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name')

      // Load posts
      const { data: postsData } = await supabase
        .from('blog_posts')
        .select(`
          *,
          blog_categories (
            name,
            color
          )
        `)
        .order('updated_at', { ascending: false })

      setCategories(categoriesData || [])
      setPosts(postsData || [])
    } catch (error: any) {
      toast.error('שגיאה בטעינת הנתונים')
      console.error('Error loading blog data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async () => {
    if (!postToDelete) return

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postToDelete.id)

      if (error) throw error
      
      toast.success('הפוסט נמחק בהצלחה')
      setShowDeleteModal(false)
      setPostToDelete(null)
      loadData()
    } catch (error: any) {
      toast.error('שגיאה במחיקת הפוסט')
    }
  }

  const handleSavePost = async (postData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('משתמש לא מחובר')

      const postPayload = {
        title: postData.title,
        slug: postData.slug,
        excerpt: postData.excerpt,
        content: postData.content,
        featured_image: postData.featured_image || null,
        meta_title: postData.meta_title || null,
        meta_description: postData.meta_description || null,
        category_id: postData.category_id || null,
        tags: postData.tags,
        read_time: postData.read_time,
        status: postData.status,
        author_id: user.id,
        published_at: postData.status === 'published' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      }

      console.log('Saving blog post with data:', postPayload)
      console.log('Blog content being saved:', postPayload.content.substring(0, 200))

      let error
      
      if (editingPost) {
        // Update existing post
        const result = await supabase
          .from('blog_posts')
          .update(postPayload)
          .eq('id', editingPost.id)
          .select()
        error = result.error
        if (result.data) {
          console.log('Blog post updated successfully:', result.data[0])
          console.log('Updated blog content preview:', result.data[0].content.substring(0, 200))
          
          // הודעה לגוגל על עדכון פוסט
          AutoSEO.notifyGoogleOfNewPage(`/blog/${result.data[0].slug}`)
        }
      } else {
        // Create new post
        const result = await supabase
          .from('blog_posts')
          .insert([{ ...postPayload, created_at: new Date().toISOString() }])
          .select()
        error = result.error
        if (result.data) {
          console.log('Blog post created successfully:', result.data[0])
          console.log('Created blog content preview:', result.data[0].content.substring(0, 200))
          
          // הודעה לגוגל על פוסט חדש
          AutoSEO.notifyGoogleOfNewPage(`/blog/${result.data[0].slug}`)
          console.log('Notified Google about new blog post:', result.data[0].slug)
        }
      }

      if (error) throw error
      toast.success(editingPost ? 'הפוסט עודכן בהצלחה' : 'הפוסט נוצר בהצלחה')
      setShowCreateModal(false)
      setShowEditModal(false)
      setEditingPost(null)
      loadData()
    } catch (error: any) {
      console.error('Error saving blog post:', error)
      toast.error('שגיאה בשמירת הפוסט: ' + (error.message || 'שגיאה לא ידועה'))
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || post.category_id === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'פורסם'
      case 'draft': return 'טיוטה'
      case 'archived': return 'בארכיון'
      default: return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ניהול בלוג</h1>
          <p className="text-gray-600 mt-1">נהל את כל פוסטי הבלוג והקטגוריות</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowCategoryModal(true)}>
            <Plus className="w-4 h-4 ml-2" />
            קטגוריה חדשה
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 ml-2" />
            פוסט חדש
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="חיפוש פוסטים..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">כל הסטטוסים</option>
              <option value="published">פורסם</option>
              <option value="draft">טיוטה</option>
              <option value="archived">בארכיון</option>
            </select>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">כל הקטגוריות</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-xl shadow-sm border">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">אין פוסטים</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'לא נמצאו פוסטים התואמים לחיפוש'
                : 'עדיין לא נוצרו פוסטים בבלוג'
              }
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 ml-2" />
              צור פוסט ראשון
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    פוסט
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    קטגוריה
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    סטטוס
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    צפיות
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    עודכן
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    פעולות
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {post.featured_image && (
                          <img
                            src={post.featured_image}
                            alt={post.title}
                            className="w-12 h-12 rounded-lg object-cover ml-3"
                          />
                        )}
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{post.title}</h3>
                          <p className="text-sm text-gray-500">/{post.slug}</p>
                          {post.excerpt && (
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                              {post.excerpt}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {post.blog_categories && (
                        <span 
                          className="inline-flex px-2 py-1 text-xs font-medium rounded-full text-white"
                          style={{ backgroundColor: post.blog_categories.color }}
                        >
                          {post.blog_categories.name}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(post.status)}`}>
                        {getStatusText(post.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {post.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 ml-1" />
                        {formatDate(post.updated_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        {post.status === 'published' && (
                          <button
                            onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="צפייה באתר"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEditingPost(post)
                            setShowEditModal(true)
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="עריכה"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setPostToDelete(post)
                            setShowDeleteModal(true)
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="מחיקה"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="מחיקת פוסט"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            האם אתה בטוח שברצונך למחוק את הפוסט "{postToDelete?.title}"?
          </p>
          <p className="text-sm text-red-600">
            פעולה זו לא ניתנת לביטול!
          </p>
          <div className="flex justify-end space-x-3 space-x-reverse">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              ביטול
            </Button>
            <Button
              variant="danger"
              onClick={handleDeletePost}
            >
              מחק פוסט
            </Button>
          </div>
        </div>
      </Modal>

      {/* Blog Editor */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          <BlogEditor
            onSave={handleSavePost}
            onCancel={() => setShowCreateModal(false)}
            categories={categories}
          />
        </div>
      )}

      {/* Blog Editor for Edit */}
      {showEditModal && editingPost && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          <BlogEditor
            onSave={handleSavePost}
            onCancel={() => {
              setShowEditModal(false)
              setEditingPost(null)
            }}
            categories={categories}
            initialData={{
              title: editingPost.title,
              slug: editingPost.slug,
              excerpt: editingPost.excerpt,
              content: editingPost.content,
              featured_image: editingPost.featured_image || '',
              meta_title: editingPost.meta_title || '',
              meta_description: editingPost.meta_description || '',
              category_id: editingPost.category_id || '',
              tags: editingPost.tags,
              read_time: editingPost.read_time,
              status: editingPost.status
            }}
          />
        </div>
      )}

      {/* Create Category Modal Placeholder */}
      <Modal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        title="יצירת קטגוריה חדשה"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            יצירת קטגוריות חדשות למאמרי הבלוג
          </p>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-medium text-yellow-800 mb-2">בפיתוח</h3>
            <p className="text-sm text-yellow-700">
              תכונה זו תתווסף בקרוב. בינתיים ניתן ליצור קטגוריות דרך מסד הנתונים.
            </p>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setShowCategoryModal(false)}>
              סגור
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}