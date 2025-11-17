'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()
  const [isValidating, setIsValidating] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // First, check if there's an error in the URL (from Supabase Auth)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const errorDescription = hashParams.get('error_description')
        const errorCode = hashParams.get('error_code')
        
        if (errorDescription || errorCode) {
          console.error('Auth error from URL:', { errorDescription, errorCode })
          
          // Check if this is a domain validation error from the database trigger
          if (errorDescription?.includes('not authorized') || errorDescription?.includes('Email domain')) {
            setErrorMessage(errorDescription)
            setIsValidating(false)
            
            toast({
              variant: "destructive",
              title: "Unauthorized Email Domain",
              description: errorDescription,
              duration: 8000,
            })
            
            setTimeout(() => router.push('/auth'), 4000)
            return
          }
          
          // Other auth errors
          setErrorMessage('Authentication failed')
          setTimeout(() => router.push('/auth'), 2000)
          return
        }

        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error during auth callback:', error)
          setErrorMessage(error.message || 'Authentication failed')
          setTimeout(() => router.push('/auth'), 1500)
          return
        }

        if (data.session) {
          const userEmail = data.session.user.email
          
          console.log('User authenticated successfully:', userEmail)
          
          // Double-check that profile was created (it should have been by the trigger)
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id, organization_id, email_domains:organization_id(domain, organization_name)')
            .eq('id', data.session.user.id)
            .single()
          
          if (profileError || !profile) {
            console.error('Profile check failed:', profileError)
            
            // Sign out user if profile doesn't exist (shouldn't happen with proper trigger)
            await supabase.auth.signOut()
            
            setErrorMessage('Failed to create user profile. Your email domain may not be authorized.')
            setIsValidating(false)
            
            toast({
              variant: "destructive",
              title: "Authentication Error",
              description: 'Your account could not be created. Please ensure you are using an authorized institutional email.',
              duration: 8000,
            })
            
            setTimeout(() => router.push('/auth'), 4000)
            return
          }
          
          // If organization_id is null, domain wasn't found (shouldn't happen with new trigger)
          if (!profile.organization_id) {
            console.error('User has no organization - domain not authorized')
            
            await supabase.auth.signOut()
            
            const domain = userEmail.split('@')[1]
            setErrorMessage(`${domain} is not an authorized domain. Only institutional emails are allowed.`)
            setIsValidating(false)
            
            toast({
              variant: "destructive",
              title: "Unauthorized Email Domain",
              description: `${domain} is not an authorized domain. Only institutional emails are allowed.`,
              duration: 8000,
            })
            
            setTimeout(() => router.push('/auth'), 4000)
            return
          }
          
          console.log('Authentication successful, redirecting to feed')
          
          toast({
            title: "Welcome!",
            description: "You've been signed in successfully.",
            duration: 3000,
          })
          
          router.push('/feed')
        } else {
          router.push('/auth')
        }
      } catch (err) {
        console.error('Callback error:', err)
        setErrorMessage('Something went wrong')
        setTimeout(() => router.push('/auth'), 1500)
      }
    }

    handleCallback()
  }, [router, supabase, toast])

  return (
    <div className="min-h-screen bg-cyber-dark cyber-bg flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center animate-pulse">
          <span className="text-black font-bold text-xl">K</span>
        </div>
        {errorMessage ? (
          <div className="space-y-2">
            <p className="text-destructive font-semibold">Access Denied</p>
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
            <p className="text-xs text-muted-foreground">Redirecting back to login...</p>
          </div>
        ) : (
          <p className="text-muted-foreground">
            {isValidating ? 'Validating your credentials...' : 'Redirecting...'}
          </p>
        )}
      </div>
    </div>
  )
}
