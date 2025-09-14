import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { SearchProvider } from './contexts/SearchContext'
import { useAuth } from './hooks/useAuth'
import { LoginForm } from './components/LoginForm'
import { Layout } from './components/Layout'
import { Dashboard } from './components/Dashboard'
import { PagesManager } from './components/PagesManager'
import { RedirectsManager } from './components/RedirectsManager'
import { BlogManager } from './components/BlogManager'
import { PortfolioManager } from './components/PortfolioManager'
import { ClientsManager } from './components/ClientsManager'
import { ResearchManager } from './components/ResearchManager'
import { MediaManager } from './components/MediaManager'
import { LoadingSpinner } from './components/ui/LoadingSpinner'
import { FrontendApp } from './components/frontend/FrontendApp'
import { SEODashboard } from './components/admin/SEODashboard'

// Import toast for error handling
import toast from 'react-hot-toast'

const AppContent: React.FC = () => {
  const { user, loading } = useAuth()
  const location = useLocation()
  
  // Check if we're on an admin route
  const isAdminRoute = location.pathname.startsWith('/admin')
  
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-700 font-medium">טוען מערכת...</p>
        </div>
      </div>
    )
  }

  // If not admin route, show frontend
  if (!isAdminRoute) {
    return <FrontendApp />
  }

  // Admin routes require authentication
  if (!user) {
    return (
      <>
        <LoginForm />
        <Toaster position="top-center" />
      </>
    )
  }

  return (
    <Routes>
      <Route path="/admin" element={
        <SearchProvider>
          <Layout currentPage="dashboard">
            <Dashboard />
          </Layout>
        </SearchProvider>
      } />
      
      <Route path="/admin/pages" element={
        <SearchProvider>
          <Layout currentPage="pages">
            <PagesManager />
          </Layout>
        </SearchProvider>
      } />
      
      <Route path="/admin/redirects" element={
        <SearchProvider>
          <Layout currentPage="redirects">
            <RedirectsManager />
          </Layout>
        </SearchProvider>
      } />
      
      <Route path="/admin/blog" element={
        <SearchProvider>
          <Layout currentPage="blog">
            <BlogManager />
          </Layout>
        </SearchProvider>
      } />
      
      <Route path="/admin/portfolio" element={
        <SearchProvider>
          <Layout currentPage="portfolio">
            <PortfolioManager />
          </Layout>
        </SearchProvider>
      } />
      
      <Route path="/admin/clients" element={
        <SearchProvider>
          <Layout currentPage="clients">
            <ClientsManager />
          </Layout>
        </SearchProvider>
      } />
      
      <Route path="/admin/research" element={
        <SearchProvider>
          <Layout currentPage="research">
            <ResearchManager />
          </Layout>
        </SearchProvider>
      } />
      
      <Route path="/admin/media" element={
        <SearchProvider>
          <Layout currentPage="media">
            <MediaManager />
          </Layout>
        </SearchProvider>
      } />
      
      <Route path="/admin/seo" element={
        <SearchProvider>
          <Layout currentPage="seo">
            <SEODashboard />
          </Layout>
        </SearchProvider>
      } />
      
      <Route path="/admin/settings" element={
        <SearchProvider>
          <Layout currentPage="settings">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">הגדרות מערכת</h1>
              <p className="text-gray-600">הגדרות המערכת יתווספו בהמשך...</p>
            </div>
          </Layout>
        </SearchProvider>
      } />
      
      <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
      
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
          },
        }}
      />
    </Router>
  )
}

export default App