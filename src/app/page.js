'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import LandingPage from '@/components/landing/LandingPage'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect to cluster if user is logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/cluster')
    }
  }, [user, loading, router])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-dark cyber-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-purple mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render landing page if already authenticated
  if (user) {
    return null
  }

  return <LandingPage />
}
