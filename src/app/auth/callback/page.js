'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error during auth callback:', error)
        router.push('/auth')
        return
      }

      if (data.session) {
        router.push('/feed')
      } else {
        router.push('/auth')
      }
    }

    handleCallback()
  }, [router, supabase])

  return (
    <div className="min-h-screen immersive-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center animate-pulse">
          <span className="text-black font-bold text-xl">K</span>
        </div>
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  )
}
