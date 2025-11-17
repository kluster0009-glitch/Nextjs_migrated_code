'use client'

import { useAuth } from '@/lib/auth-context'
import LandingPage from '@/components/landing/LandingPage'

export default function HomePage() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-dark cyber-bg flex items-center justify-center">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center animate-pulse">
          <span className="text-black font-bold text-xl">K</span>
        </div>
      </div>
    )
  }

  // Middleware handles redirect to /feed if user is logged in
  return <LandingPage />
}
