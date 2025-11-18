'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/sonner'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  // Fetch user profile data and merge with auth user
  const fetchUserWithProfile = useCallback(async (authUser) => {
    if (!authUser) {
      setUser(null)
      return
    }

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, full_name, profile_picture, username, email, college_name, department, bio')
        .eq('id', authUser.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        setUser(authUser)
        return
      }

      // Merge auth user with profile data
      setUser({
        ...authUser,
        profile: profile
      })
    } catch (error) {
      console.error('Error in fetchUserWithProfile:', error)
      setUser(authUser)
    }
  }, [supabase])

  useEffect(() => {
    // Get initial session
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      await fetchUserWithProfile(session?.user ?? null)
      setLoading(false)
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Only fetch profile on specific events
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          await fetchUserWithProfile(session?.user ?? null)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
        setLoading(false)

        // Refresh the page on auth change
        if (event === 'SIGNED_IN') {
          const userName = session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || 'there'
          toast.success(`Welcome back, ${userName}! 🎉`)
          router.refresh()
        } else if (event === 'SIGNED_OUT') {
          toast.success('Successfully logged out. See you soon! 👋')
          router.push('/login')
          router.refresh()
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router, fetchUserWithProfile])

  const signUp = async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    return { data, error }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signInWithOAuth = async (provider, options = {}) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        ...options,
      },
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout. Please try again.')
      return { error }
    }
    
    // The auth state change listener will handle the redirect and success notification
    return { error: null }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
