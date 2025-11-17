'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'

const AuthContext = createContext(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        // Handle sign out event
        if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing state')
          setSession(null)
          setUser(null)
          setShowOnboarding(false)
          setLoading(false)
          return
        }
        
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        // Check if onboarding is required
        if (session?.user) {
          setTimeout(() => {
            checkOnboardingRequired(session.user.id)
          }, 0)
        }
      }
    )

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email)
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      setIsInitialized(true)
      
      if (session?.user) {
        checkOnboardingRequired(session.user.id)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkOnboardingRequired = async (userId) => {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username, full_name, department, roll_number')
        .eq('id', userId)
        .single()

      const needsOnboarding = !profileData?.username || 
                              !profileData?.full_name || 
                              !profileData?.department || 
                              !profileData?.roll_number

      setShowOnboarding(needsOnboarding)
    } catch (error) {
      console.error('Error checking onboarding status:', error)
    }
  }

  const signOut = async () => {
    try {
      console.log('Signing out user...')
      
      // Clear local state FIRST before calling Supabase
      setUser(null)
      setSession(null)
      setShowOnboarding(false)
      
      // Sign out from Supabase with 'local' scope to clear all local session data
      const { error } = await supabase.auth.signOut({ scope: 'local' })
      
      if (error) {
        console.error('Supabase signOut error:', error)
      }
      
      // Clear any browser storage manually as backup
      if (typeof window !== 'undefined') {
        // Clear all Supabase auth keys
        const keysToRemove = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && key.startsWith('sb-')) {
            keysToRemove.push(key)
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key))
        
        // Also clear session storage
        sessionStorage.clear()
      }
      
      // Small delay to ensure auth state has updated
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Force hard redirect to landing page (clears all React state)
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
      // Clear state and force redirect anyway
      setUser(null)
      setSession(null)
      window.location.href = '/'
    }
  }

  const value = {
    user,
    session,
    loading,
    isInitialized,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
